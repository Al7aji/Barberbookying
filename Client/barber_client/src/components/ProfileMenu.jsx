import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Calendar, ShoppingBag, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  // Show first letter of first_name if available, else generic User icon
  const initial = user?.first_name?.[0]?.toUpperCase() || "?";

  return (
    <div className="relative" ref={menuRef}>
      {/* Circle trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="size-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
          {initial}
        </span>
        <ChevronDown
          className={`size-4 text-gray-600 transition-transform hidden sm:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50"
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.first_name} {user?.Last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                Admin
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <MenuItem
              icon={<Calendar className="size-4" />}
              label="My Appointments"
              to="/appointments"
              onClick={() => setOpen(false)}
            />
            <MenuItem
              icon={<ShoppingBag className="size-4" />}
              label="My Orders"
              to="/orders"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              role="menuitem"
            >
              <LogOut className="size-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      role="menuitem"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}