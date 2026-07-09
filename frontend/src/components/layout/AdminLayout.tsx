import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import SidebarNav, { defaultMenuSections } from "./SidebarNav";
import TopBar from "./TopBar";

function getPageInfo(pathname: string) {
  if (pathname === "/dashboard" || pathname === "/") {
    return { icon: null as string | null, title: "Dashboard" };
  }
  if (pathname === "/profile") {
    return { icon: null as string | null, title: "Profile" };
  }
  if (pathname === "/change-password") {
    return { icon: null as string | null, title: "Change Password" };
  }

  for (const section of defaultMenuSections) {
    for (const item of section.items) {
      const prefix = item.routePrefix.replace(/\/$/, "");

      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        if (pathname.endsWith("/create")) {
          return { icon: "Plus", title: `Add new ${item.label}` };
        }
        if (pathname.match(/\/(\d+)\/edit$/)) {
          return { icon: "Pencil", title: `Edit ${item.label}` };
        }
        return { icon: "ClipboardList", title: item.label, listRoute: prefix + "/create" };
      }
    }
  }

  return { icon: null as string | null, title: "" };
}

export default function AdminLayout() {
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);

  const action = pageInfo.listRoute ? (
    <Link className="btn-primary topbar-action-btn" to={pageInfo.listRoute}>
      <span>+ Add New</span>
    </Link>
  ) : null;

  return (
    <main className="dashboard-page">
      <section className="master-layout">
        <SidebarNav
          branding={{
            title: "AI Chatbot",
          }}
        />
        <section className="master-content">
          <TopBar title={pageInfo.title} titleIcon={pageInfo.icon} action={action} />
          <motion.div
            className="page-content"
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </section>
      </section>
    </main>
  );
}
