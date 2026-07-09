import type { ReactNode } from "react";
import PageMotion from "./PageMotion";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <PageMotion>
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-header">
            <span className="badge auth-badge">AI - Chatbot</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
          <div className="auth-footer">{footer}</div>
        </section>
      </main>
    </PageMotion>
  );
}
