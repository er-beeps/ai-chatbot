import useAuth from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon, { type IconName } from "../ui/Icon";

export type TopBarProps = {
  showDate?: boolean;
  showNotifications?: boolean;
  showThemeToggle?: boolean;
  breadcrumb?: string;
  title?: string;
  titleIcon?: IconName | null;
  action?: React.ReactNode;
};

export default function TopBar({showNotifications = true, showThemeToggle = true, title = "", titleIcon = null, action }: TopBarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hasNotifications] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const darkEnabled = stored === "dark";
    setIsDark(darkEnabled);
    document.documentElement.setAttribute("data-theme", darkEnabled ? "dark" : "light");
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }


  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        {titleIcon && <Icon name={titleIcon} size={20} className="topbar-title-icon" />}
        {title && <h1 className="topbar-title">{title}</h1>}
        {action}
      </div>

      <div className="admin-top-actions">
        {showNotifications && (
          <button type="button" className="action-btn" aria-label="Notifications">
            <Icon name="Bell" size={16} />
            {hasNotifications && <span className="notification-badge" />}
          </button>
        )}
        {showThemeToggle && (
          <button type="button" className="action-btn" aria-label="Toggle theme" onClick={toggleTheme}>
            <Icon name={isDark ? "Sun" : "Moon"} size={16} />
          </button>
        )}
        {isAuthenticated ? (
          <div className="profile-menu" ref={menuRef}>
            <button type="button" className="profile-pill profile-trigger" onClick={() => setIsMenuOpen((prev) => !prev)}>
              <div className="avatar-dot">{(user?.username ?? "A").slice(0, 1).toUpperCase()}</div>
              <div className="profile-info">
                <span className="profile-name">{user?.username ?? "Admin User"}</span>
                <span className="profile-role">{user?.role ?? "Super Admin"}</span>
              </div>
              <Icon name="ChevronDown" size={14} className="dropdown-arrow" />
            </button>
            {isMenuOpen ? (
              <div className="profile-dropdown">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  <Icon name="User" size={14} />
                  View Profile
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/change-password");
                  }}
                >
                  <Icon name="Lock" size={14} />
                  Change Password
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item logout"
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                  }}
                >
                  <Icon name="LogOut" size={14} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button type="button" className="btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}