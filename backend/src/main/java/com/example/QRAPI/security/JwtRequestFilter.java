package com.example.QRAPI.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import com.example.QRAPI.repository.*;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ChauffeurRepository chauffeurRepository;
    
    @Autowired
    private ClientRepository clientRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        final String requestURI = request.getRequestURI();

        // Exclure les routes publiques
        if (requestURI.contains("/signup") || requestURI.contains("/login")) {
            chain.doFilter(request, response);
            return;
        }

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing or malformed");
            return;
        }

        String jwt = authorizationHeader.substring(7);
        String email;
        String role;

        try {
            email = jwtUtil.extractEmail(jwt);
            role = jwtUtil.extractRole(jwt);
        } catch (ExpiredJwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token is expired");
            return;
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JWT token");
            return;
        }

        if (email != null && jwtUtil.validateToken(jwt, email)) {
            Object user = findUserByRoleAndEmail(role, email);
            if (user != null) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(user, null, Collections.singletonList(authority));
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        chain.doFilter(request, response);
    }

    private Object findUserByRoleAndEmail(String role, String email) {
        if ("CHAUFFEUR".equals(role)) {
            return chauffeurRepository.findByEmail(email).orElse(null);
        } else if ("CLIENT".equals(role)) {
            return clientRepository.findByEmail(email).orElse(null);
        }
        return null;
    }
}
