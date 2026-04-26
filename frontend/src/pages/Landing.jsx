import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#0f6e56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span style={styles.logoText}>Penflow</span>
          </div>
          <button style={styles.navBtn} onClick={() => navigate("/app")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>✍️ Handwriting made effortless</div>
        <h1 style={styles.heroTitle}>
          Turn any document into<br />
          <span style={styles.heroAccent}>handwritten text</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Upload a PDF or Word document and Penflow converts it into
          a realistic handwritten-style PDF — ready to print.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.primaryBtn} onClick={() => navigate("/app")}>
            Try Penflow Free →
          </button>
          <button style={styles.secondaryBtn}>
            See how it works
          </button>
        </div>

        {/* Demo Card */}
        <div style={styles.demoCard}>
          <div style={styles.demoHeader}>
            <div style={styles.demoDot} />
            <div style={{ ...styles.demoDot, background: "#fbbf24" }} />
            <div style={{ ...styles.demoDot, background: "#34d399" }} />
            <span style={styles.demoLabel}>penflow-output.pdf</span>
          </div>
          <div style={styles.demoContent}>
            <p style={styles.demoText}>
              The quick brown fox jumps over the lazy dog.
              Pack my box with five dozen liquor jugs.
            </p>
            <p style={styles.demoText}>
              Handwriting has never been this easy to create
              from any digital document.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Everything you need</h2>
        <div style={styles.featureGrid}>
          {[
            {
              icon: "📄",
              title: "PDF & DOCX Support",
              desc: "Upload any Word document or PDF and we'll handle the rest."
            },
            {
              icon: "🖊️",
              title: "Multiple Styles",
              desc: "Choose from 4 handwriting fonts, 3 ink colors, and 3 paper styles."
            },
            {
              icon: "🧠",
              title: "Personal Handwriting",
              desc: "Upload a photo of your handwriting and we'll match your unique style."
            },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to write smarter?</h2>
        <p style={styles.ctaSubtitle}>
          Join students and professionals saving hours every week.
        </p>
        <button style={styles.primaryBtn} onClick={() => navigate("/app")}>
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Built by Lander Fernando · Penflow 2026
        </p>
      </footer>

    </div>
  );
}

const styles = {
  page: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#ffffff",
    minHeight: "100vh",
    color: "#0a0a0a",
  },
  navbar: {
    borderBottom: "1px solid #f0f0f0",
    padding: "0 2rem",
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    zIndex: 100,
  },
  navContent: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0a0a0a",
  },
  navBtn: {
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: "500",
    background: "#0a0a0a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  hero: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "5rem 2rem 4rem",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "#f0faf5",
    color: "#0f6e56",
    border: "1px solid #b2e8d4",
    borderRadius: "50px",
    padding: "6px 16px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "1.5rem",
  },
  heroTitle: {
    fontSize: "52px",
    fontWeight: "800",
    lineHeight: "1.15",
    marginBottom: "1.25rem",
    color: "#0a0a0a",
  },
  heroAccent: {
    color: "#0f6e56",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#555",
    lineHeight: "1.7",
    marginBottom: "2rem",
    maxWidth: "560px",
    margin: "0 auto 2rem",
  },
  heroButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "3rem",
  },
  primaryBtn: {
    padding: "12px 28px",
    fontSize: "15px",
    fontWeight: "600",
    background: "#0f6e56",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px 28px",
    fontSize: "15px",
    fontWeight: "500",
    background: "#fff",
    color: "#0a0a0a",
    border: "1px solid #ddd",
    borderRadius: "10px",
    cursor: "pointer",
  },
  demoCard: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    textAlign: "left",
    maxWidth: "600px",
    margin: "0 auto",
  },
  demoHeader: {
    background: "#f7f7f7",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderBottom: "1px solid #e5e5e5",
  },
  demoDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#f87171",
  },
  demoLabel: {
    fontSize: "12px",
    color: "#888",
    marginLeft: "8px",
  },
  demoContent: {
    padding: "2rem",
    background: "#fffef9",
  },
  demoText: {
    fontFamily: "'Caveat', cursive",
    fontSize: "22px",
    color: "#1a1a2e",
    lineHeight: "2",
    marginBottom: "0.5rem",
  },
  features: {
    background: "#fafafa",
    padding: "5rem 2rem",
  },
  featuresTitle: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "3rem",
    color: "#0a0a0a",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  featureCard: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: "14px",
    padding: "1.75rem",
  },
  featureIcon: {
    fontSize: "28px",
    marginBottom: "1rem",
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#0a0a0a",
  },
  featureDesc: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
  },
  cta: {
    padding: "6rem 2rem",
    textAlign: "center",
    background: "#fff",
  },
  ctaTitle: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#0a0a0a",
  },
  ctaSubtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "2rem",
  },
  footer: {
    borderTop: "1px solid #f0f0f0",
    padding: "2rem",
    textAlign: "center",
  },
  footerText: {
    fontSize: "13px",
    color: "#999",
  },
};