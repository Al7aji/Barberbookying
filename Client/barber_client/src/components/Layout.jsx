import { Outlet, Link, useLocation } from "react-router-dom";
import { Scissors, Home as HomeIcon, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Layout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path) =>
    `inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ─── Header ─── */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Scissors className="size-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Elite Barber</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-3">
              <Link to="/" className={linkClass("/")}>
                <HomeIcon className="size-4" />
                Home
              </Link>

              {/* Right side: profile menu (when logged in) OR Login link */}
              {loading ? (
                <span className="text-sm text-gray-400 px-4">...</span>
              ) : user ? (
                <ProfileMenu />
              ) : (
                <Link to="/login" className={linkClass("/login")}>
                  <LogIn className="size-4" />
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile: show profile/Login on the right too */}
            <div className="md:hidden flex items-center gap-2">
              {loading ? null : user ? (
                <ProfileMenu />
              ) : (
                <Link to="/login" className={linkClass("/login")}>
                  <LogIn className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile nav row */}
          <nav className="flex md:hidden mt-3 gap-2">
            <Link to="/" className={`flex-1 text-center ${linkClass("/")} justify-center`}>
              Home
            </Link>
            {!user && (
              <Link to="/login" className={`flex-1 text-center ${linkClass("/login")} justify-center`}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ─── Page content ─── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t mt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="size-6 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">Elite Barber</span>
              </div>
              <p className="text-gray-600">
                Premium grooming services for the modern gentleman.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Contact</h3>
              <div className="space-y-2 text-gray-600">
                <p>123 Main Street</p>
                <p>Amsterdam, 1012 AB</p>
                <p>Tel: +31 20 123 4567</p>
                <p>info@elitebarber.nl</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Opening Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 - 20:00</p>
                <p>Saturday: 9:00 - 18:00</p>
                <p>Sunday: 10:00 - 16:00</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Elite Barber. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}