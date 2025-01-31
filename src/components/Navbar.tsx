import { authService } from '@/services/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const userRole = authService.getUserRole();
  const dashboardLink = userRole === 'CHAUFFEUR' ? '/chauffeur/dashboard' : '/client/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href={dashboardLink} className="navbar-brand">
          <Image
            src="/img/vehicleLogo.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span>Transport App</span>
        </Link>

        <div className="navbar-links">
          {userRole === 'CHAUFFEUR' ? (
            <>
              <Link href={dashboardLink} className="navbar-link">
                Mes Courses
              </Link>
              <Link href="/scan" className="navbar-link">
                Scanner
              </Link>
            </>
          ) : (
            <>
              <Link href={dashboardLink} className="navbar-link">
                Courses Disponibles
              </Link>
              <Link href={`${dashboardLink}?tab=my-courses`} className="navbar-link">
                Mes Réservations
              </Link>
            </>
          )}
          <button
            onClick={() => authService.logout()}
            className="btn btn-danger ml-4"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
