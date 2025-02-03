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

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;
        String role = null;
        String requestURI = request.getRequestURI();

        // Exclure les routes publiques comme "/signup" et "/login"
        if (requestURI.contains("/signup") || requestURI.contains("/login")) {
            chain.doFilter(request, response);
            return;
        }

        // Vérifier si le token JWT est présent
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
                role = jwtUtil.extractRole(jwt);
            } catch (ExpiredJwtException e) {
                // Le token est expiré, renvoyer une erreur
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token is expired");
                return;
            } catch (Exception e) {
                // Autres erreurs liées au JWT
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JWT token");
                return;
            }
        } else {
            // Pas de token trouvé, renvoyer une erreur
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing or malformed");
            return;
        }

        // Vérifier l'authentification si l'email est présent et le token est valide
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwt != null && jwtUtil.validateToken(jwt, email)) {
                // Créer une autorité basée sur le rôle
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                // Créer un token d'authentification avec l'email et le rôle
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(email, null, Collections.singletonList(authority));

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // Passer la requête au prochain filtre
        chain.doFilter(request, response);
    }
}
