import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Maps and Data", href: "/" },
  { label: "Tools and Resources", href: "/tools-and-resources" },
  { label: "Opportunities and Initiatives", href: "/opportunities" },
  { label: "About", href: "/about" },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Logo Header */}
      <div className="bg-primary py-8 px-4 ">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Organization Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-8">
            <p className="text-white font-bold">JAP Upload Tool</p>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white text-gray-800 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
            </select>
            {/* Right Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-who.png"
                alt="Partner Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-secondary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
