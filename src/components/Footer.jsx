import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { to: "/", label: "Home", icon: "fas fa-home" },
      { to: "/about", label: "About Us", icon: "fas fa-info-circle" },
      { to: "/products", label: "Products", icon: "fas fa-box" },
      { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
    ],
    categories: [
      { to: "/products", label: "Traditional Pots" },
      { to: "/products", label: "Modern Designs" },
      { to: "/products", label: "Hanging Baskets" },
      { to: "/products", label: "Custom Orders" },
    ],
    support: [
      { to: "/contact", label: "FAQ" },
      { to: "/contact", label: "Shipping Info" },
      { to: "/contact", label: "Returns" },
      { to: "/contact", label: "Size Guide" },
    ],
  };

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" },
    { icon: "fab fa-youtube", href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-xl">JC</span>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold font-display">
                  Jhansel Cement Pots
                </span>
                <span className="block text-xs text-gray-400 -mt-1">
                  Manufacturing
                </span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Crafting beautiful, durable cement pots since 2010. Handcrafted
              with passion and precision to transform your outdoor spaces.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <i className={`${link.icon} mr-2 text-sm opacity-50 group-hover:opacity-100 transition-opacity`}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
              Categories
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Contact Us
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary"></i>
                <span>123 Cement Pot Street Manila, Philippines</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-primary"></i>
                <span>+63 917 123 4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-primary"></i>
                <span>info@jhanselcementpots.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-primary"></i>
                <span>Mon - Sat: 8AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-lg mb-1">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-gray-400 text-sm">
                Get updates on new products and special offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold rounded-r-xl transition-all duration-300">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Jhansel Cement Pots Manufacturing. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/sitemap"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
