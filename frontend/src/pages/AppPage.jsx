import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const FONTS = [
  { value: "caveat", label: "Caveat" },
  { value: "patrick_hand", label: "Patrick Hand" },
  { value: "indie_flower", label: "Indie Flower" },
  { value: "shadows_into_light", label: "Shadows Into Light" },
];

const INK_COLORS = [
  { value: "black", label: "Black", color: "#1a1a1a" },
  { value: "blue", label: "Blue Ink", color: "#1a33b3" },
  { value: "pencil", label: "Pencil", color: "#666666" },
];

const PAPER_STYLES = [
  { value: "blank", label: "Blank" },
  { value: "lined", label: "Lined" },
  { value: "grid", label: "Grid" },
];

export default function AppPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [font, setFont] = useState("caveat");
  const [fontSize, setFontSize] = useState(16);
  const [inkColor, setInkColor] = useState("black");
  const [paperStyle, setPaperStyle] = useState("blank");
  const [handwritingImage, setHandwritingImage] = useState(null);
  const [analyzeStatus, setAnalyzeStatus] = useState("idle");
  const [personalStyle, setPersonalStyle] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) { setFile(selected); setStatus("idle"); setErrorMsg(""); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setStatus("idle"); setErrorMsg(""); }
  };

  const handleHandwritingImage = (e) => {
    const selected = e.target.files[0];
    if (selected) { setHandwritingImage(selected); setAnalyzeStatus("idle"); setPersonalStyle(null); }
  };

  const handleAnalyze = async () => {
    if (!handwritingImage) return;
    setAnalyzeStatus("loading");
    const formData = new FormData();
    formData.append("image", handwritingImage);
    try {
      const response = await axios.post(`${API_URL}/analyze`, formData);
      setPersonalStyle(response.data);
      setAnalyzeStatus("success");
    } catch { setAnalyzeStatus("error"); }
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("loading");
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("font", font);
    formData.append("font_size", fontSize);
    formData.append("ink_color", inkColor);
    formData.append("paper_style", paperStyle);
    if (personalStyle) {
      formData.append("use_personal_style", "true");
      formData.append("slant", personalStyle.slant);
      formData.append("spacing_factor", personalStyle.spacing_factor);
      formData.append("stroke_weight", personalStyle.stroke_weight);
    }
    try {
      const response = await axios.post(`${API_URL}/convert`, formData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "penflow-output.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo} onClick={() => navigate("/")} >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#0f6e56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span style={styles.logoText}>Penflow</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1 style={styles.title}>Convert Document</h1>
            <p style={styles.subtitle}>Upload your file and customize your handwriting style.</p>
          </div>

          {/* Upload */}
          <div style={styles.dropzone} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div style={styles.uploadIcon}>📄</div>
            <p style={styles.dropText}>{file ? file.name : "Drop your file here"}</p>
            <p style={styles.dropSubtext}>PDF or DOCX supported</p>
            <label style={styles.browseBtn}>
              Browse Files
              <input type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
          </div>

          {file && (
            <div style={styles.fileInfo}>
              <span>📎 {file.name}</span>
              <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}

          {/* Customize */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Customize</p>

            <div style={styles.field}>
              <label style={styles.label}>Handwriting Style</label>
              <select style={styles.select} value={font} onChange={(e) => setFont(e.target.value)}>
                {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Font Size — {fontSize}px</label>
              <input type="range" min="12" max="24" value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))} style={styles.slider} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Ink Color</label>
              <div style={styles.colorRow}>
                {INK_COLORS.map((ink) => (
                  <button key={ink.value} onClick={() => setInkColor(ink.value)} style={{
                    ...styles.colorBtn,
                    border: inkColor === ink.value ? `2px solid ${ink.color}` : "2px solid transparent",
                    background: inkColor === ink.value ? "#f0f0f0" : "transparent",
                  }}>
                    <span style={{ ...styles.colorDot, background: ink.color }} />
                    {ink.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Paper Style</label>
              <div style={styles.paperRow}>
                {PAPER_STYLES.map((p) => (
                  <button key={p.value} onClick={() => setPaperStyle(p.value)} style={{
                    ...styles.paperBtn,
                    background: paperStyle === p.value ? "#0f6e56" : "#f5f5f0",
                    color: paperStyle === p.value ? "#fff" : "#1a1a1a",
                    border: paperStyle === p.value ? "none" : "1px solid #ddd",
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Handwriting */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>✍️ Personal Handwriting</p>
            <p style={styles.sectionDesc}>Upload a photo of your handwriting and we'll match your style.</p>

            <label style={styles.browseBtn}>
              {handwritingImage ? handwritingImage.name : "Upload Handwriting Photo"}
              <input type="file" accept="image/png,image/jpeg" onChange={handleHandwritingImage} style={{ display: "none" }} />
            </label>

            {handwritingImage && analyzeStatus !== "success" && (
              <button style={{ ...styles.analyzeBtn, opacity: analyzeStatus === "loading" ? 0.6 : 1 }}
                onClick={handleAnalyze} disabled={analyzeStatus === "loading"}>
                {analyzeStatus === "loading" ? "Analyzing..." : "Analyze My Handwriting"}
              </button>
            )}

            {analyzeStatus === "success" && personalStyle && (
              <div style={styles.styleResult}>
                <p style={styles.styleResultTitle}>✅ Handwriting analyzed!</p>
                <div style={styles.styleGrid}>
                  <div style={styles.styleStat}><span style={styles.styleLabel}>Font Size</span><span style={styles.styleValue}>{personalStyle.font_size}px</span></div>
                  <div style={styles.styleStat}><span style={styles.styleLabel}>Slant</span><span style={styles.styleValue}>{personalStyle.slant}°</span></div>
                  <div style={styles.styleStat}><span style={styles.styleLabel}>Stroke</span><span style={styles.styleValue}>{personalStyle.stroke_weight}</span></div>
                  <div style={styles.styleStat}><span style={styles.styleLabel}>Spacing</span><span style={styles.styleValue}>{personalStyle.spacing_factor}x</span></div>
                </div>
              </div>
            )}

            {analyzeStatus === "error" && (
              <div style={styles.errorBox}>❌ Could not analyze image. Please try a clearer photo.</div>
            )}
          </div>

          {/* Convert Button */}
          <button style={{
            ...styles.convertBtn,
            opacity: !file || status === "loading" ? 0.6 : 1,
            cursor: !file || status === "loading" ? "not-allowed" : "pointer",
          }} onClick={handleConvert} disabled={!file || status === "loading"}>
            {status === "loading" ? "Converting..." : "Convert to Handwriting"}
          </button>

          {status === "success" && (
            <div style={styles.successBox}>✅ Your handwritten PDF has been downloaded!</div>
          )}
          {status === "error" && (
            <div style={styles.errorBox}>❌ {errorMsg}</div>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#f7f7f5",
    minHeight: "100vh",
  },
  navbar: {
    borderBottom: "1px solid #e5e5e5",
    padding: "0 2rem",
    background: "#fff",
  },
  navContent: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    height: "64px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0a0a0a",
  },
  content: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    border: "1px solid #e5e5e5",
  },
  header: {
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0a0a0a",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
  },
  dropzone: {
    border: "2px dashed #ddd",
    borderRadius: "12px",
    padding: "2rem",
    textAlign: "center",
    marginBottom: "1rem",
  },
  uploadIcon: { fontSize: "32px", marginBottom: "0.75rem" },
  dropText: { fontSize: "15px", fontWeight: "500", marginBottom: "4px" },
  dropSubtext: { fontSize: "13px", color: "#888", marginBottom: "1rem" },
  browseBtn: {
    display: "inline-block",
    padding: "8px 20px",
    fontSize: "13px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#f9f9f9",
  },
  fileInfo: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f7f7f5",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "1rem",
  },
  fileSize: { color: "#888" },
  section: {
    background: "#fafafa",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1rem",
    border: "1px solid #eee",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "1rem",
  },
  sectionDesc: { fontSize: "13px", color: "#888", marginBottom: "1rem" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px", color: "#444" },
  select: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    background: "#fff",
    cursor: "pointer",
  },
  slider: { width: "100%", cursor: "pointer" },
  colorRow: { display: "flex", gap: "8px" },
  colorBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  colorDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    display: "inline-block",
  },
  paperRow: { display: "flex", gap: "8px" },
  paperBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  analyzeBtn: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    fontWeight: "500",
    background: "#f0f4ff",
    color: "#1a33b3",
    border: "1px solid #c7d2fe",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "0.75rem",
  },
  styleResult: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "12px",
    marginTop: "0.75rem",
  },
  styleResultTitle: { fontSize: "13px", fontWeight: "600", color: "#15803d", marginBottom: "8px" },
  styleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
  styleStat: { display: "flex", justifyContent: "space-between", fontSize: "12px" },
  styleLabel: { color: "#666" },
  styleValue: { fontWeight: "500", color: "#1a1a1a" },
  convertBtn: {
    width: "100%",
    padding: "13px",
    fontSize: "15px",
    fontWeight: "600",
    background: "#0f6e56",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    marginBottom: "1rem",
    cursor: "pointer",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#15803d",
    textAlign: "center",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#dc2626",
    textAlign: "center",
  },
};