import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Icon from "../ui/Icon";
import useAuth from "../../hooks/useAuth";

const resourceIcons: Record<string, "Chatbot"> = {
  'chatbot': "Chatbot",
};

export type MenuItem = {
  key: string;
  label: string;
  routePrefix: string;
};

export type MenuSection = {
  title: string;
  icon: "Chatbot";
  items: MenuItem[];
};

export const defaultMenuSections: MenuSection[] = [];

function getIcon(key: string) {
    return resourceIcons[key] || "MoreHorizontal";
}

type SidebarNavProps = {
  sections?: MenuSection[];
  branding?: {
    title: string;
  };
};

export default function SidebarNav({ sections = defaultMenuSections, branding }: SidebarNavProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const visibleSections = useMemo(
    () => sections.filter((s) => s.title === "Map" || isAuthenticated),
    [sections, isAuthenticated]
  );

  const getInitialOpenState = (): Record<string, boolean> => {
    const state: Record<string, boolean> = {};
    visibleSections.forEach((section) => {
      state[section.title] = section.items.some((item) =>
        location.pathname.startsWith(item.routePrefix.replace(/\/$/, ""))
      );
    });
    return state;
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(getInitialOpenState);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    setOpenSections((prev) => {
      let changed = false;
      let activeSection = "";
      for (const section of visibleSections) {
        if (section.items.some((item) => location.pathname.startsWith(item.routePrefix.replace(/\/$/, "")))) {
          activeSection = section.title;
          break;
        }
      }
      if (activeSection) {
        const next = { ...prev };
        visibleSections.forEach((s) => {
          const shouldBeOpen = s.title === activeSection;
          if (next[s.title] !== shouldBeOpen) {
            next[s.title] = shouldBeOpen;
            changed = true;
          }
        });
        return changed ? next : prev;
      }
      return prev;
    });
  }, [location.pathname, visibleSections]);

  return (
    <aside className="master-nav">
      {branding && (
        <div className="sidebar-brand">
          <div><img src="/chatbot.png" height={50} width={50}></img></div>
          <div>
            <h2>{branding.title}</h2>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <>
          <h3 className="sidebar-section-title">Navigation</h3>
          <div className="master-nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "master-nav-link active" : "master-nav-link")}>
              <Icon name="Dashboard" size={16} /> Dashboard
            </NavLink>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "0.6rem 0.38rem" }} />
        </>
      )}

      {visibleSections.map((section) => (
        <div key={section.title}>
          <button
            type="button"
            className={openSections[section.title] ? "master-nav-link dropdown-toggle open" : "master-nav-link dropdown-toggle"}
            onClick={() => toggleSection(section.title)}
          >
            <Icon name={section.icon} size={16} />
            <span>{section.title}</span>
            <span className="dropdown-arrow" aria-hidden="true">
              {openSections[section.title] ? "▾" : "▸"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openSections[section.title] ? (
              <motion.div
                className="master-nav-links"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                {section.items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.routePrefix}
                    className={({ isActive }) => (isActive ? "master-nav-link active nested-link" : "master-nav-link nested-link")}
                  >
                    <Icon name={getIcon(item.key)} size={16} /> {item.label}
                  </NavLink>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "0.4rem 0.38rem" }} />
        </div>
      ))}
    </aside>
  );
}