import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products" },
    { to: "/contact", label: "Contact" },
  ];

  // Show loading state while checking auth
  if (loading) {
    return (
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "navbar-glass shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">JC</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-black font-display">
                Jhansel
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <span className="spinner text-green-600"></span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "navbar-glass shadow-sm py-3" : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">JS</span>
            </div>
            <div className="ml-3 hidden sm:block">
              <span className="text-lg font-semibold text-black font-display">
                Jhansel
              </span>
              <span className="block text-xs text-gray-500 -mt-0.5 tracking-wide">
                CEMENT POTS MANUFACTURING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-th-large mr-2"></i>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <i className="fas fa-user mr-2"></i>
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-all duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute top-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 top-3" : "top-0"
                  }`}
                  style={{ top: isMenuOpen ? "11px" : "0" }}
                ></span>
                <span
                  className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 bottom-3" : "bottom-0"
                  }`}
                  style={{ bottom: isMenuOpen ? "11px" : "0" }}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                }`
              }
            >
              <i className="fas fa-chevron-right mr-3 text-xs"></i>
              {link.label}
            </NavLink>
          ))}
          <div className="pt-4 space-y-2 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-th-large mr-3"></i>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300"
              >
                <i className="fas fa-user mr-2"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
