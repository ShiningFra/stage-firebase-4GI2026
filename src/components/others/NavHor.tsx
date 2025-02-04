"use client"
import Link from "next/link";
import React, { useState, useRef,useEffect } from "react";



interface MenuItem {
  url: any;
  title: string | JSX.Element;
  submenu?: MenuItem[];
  reference?: string;
}

interface DropdownProps {
  subNavdata: MenuItem[];
  dropdown: boolean;
  depthLevel: number;
}

const Dropdown: React.FC<DropdownProps> = ({
                                             subNavdata,
                                             dropdown,
                                             depthLevel,
                                           }) => {
  depthLevel = depthLevel + 1;
  const dropdownClass =
      depthLevel > 1
          ? "static lg:absolute left-full z-10 bg-white min-w-[200px] top-0"
          : "top-full static lg:absolute min-w-[200px] left-0 z-10 bg-white";
  return (
      <ul
          className={`my-dropdown static duration-300 shadow-md ${dropdownClass} ${
              dropdown ? "flexStart flex-col border-b text-blue-900 border-orange-600 sm:min-w-[220px] min-w-max   rounded-xl ring-1  ring-gray-900/5 shadow-menu" : "hidden"
          }`}>
        {subNavdata.map((submenu, index) => (
            <MenuItems depthLevel={depthLevel} items={submenu} key={index} />
        ))}
      </ul>
  );
};

interface MenuItemsProps {
  items: MenuItem;
  depthLevel: number;
}

const MenuItems: React.FC<MenuItemsProps> = ({ items, depthLevel }) => {

  const [dark, setDark] = useState(false);
  const navbarDark = () => {
    if (window.scrollY > 10 && window.scrollY < window.innerHeight - 80) {
      setDark(false);
    } else if (window.scrollY >= window.innerHeight - 80) {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", navbarDark);
    return () => {
      window.removeEventListener("scroll", navbarDark);
    };
  }, []);

  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const onMouseEnter = () => {
    window.innerWidth > 992 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 992 && setDropdown(false);
  };

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (
          dropdown &&
          ref.current &&
          !ref.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  return (
      <li className="group relative text menu-items cursor-pointer"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={ref}>
        {items.submenu ? (
            <>

          <span
              aria-haspopup="menu"
              aria-expanded={dropdown ? "true" : "false"}
              onClick={() => setDropdown((prev) => !prev)}
              className="flex items-center text-[#243757] justify-between gap-1 font-bold">
            {items.title}{" "}
            {depthLevel > 0 && <i className="las la-angle-right"></i>}
            {depthLevel == 0 && typeof items.title === "string" && (
                <i className="las la-angle-down"></i>
            )}
          </span>
              <Dropdown
                  dropdown={dropdown}
                  subNavdata={items.submenu}
                  depthLevel={depthLevel}
              />
            </>
        ) : (

            //   <a
            //   href={`#${items.reference}`}
            //   className={`px-1 mx-8 py-4 xl:mx-4 hover:text-opacity-80 `}
            // >
            //   {items.title}
            // </a>
            <Link href={`${items.url}`} className="font-bold text-[#243757]">{items.title}</Link>

        )}
      </li>
  );
};

/////////////////////////////////
type linkProps = {
  title?: string;
  reference: string;
  items:any;
  id?: any; // Use 'id' instead of 'key' if you need this value within the component

};

const NavHor = ({ title, reference,items, id}: linkProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Listen for authentication changes
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              {title}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/ongoing-rides" className="text-gray-600 hover:text-gray-900">
              Available Rides
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    window.location.href = '/';
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/ongoing-rides"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Available Rides
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    window.location.href = '/';
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavHor;