import { useState } from "react";
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

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Customization settings
  const [font, setFont] = useState("caveat");
  const [fontSize, setFontSize] = useState(16);
  const [inkColor, setInkColor] = useState("black");
  const [paperStyle, setPaperStyle] = useState("blank");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setStatus("idle");
      setErrorMsg("");
    }
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

    try {
      const response = await axios.post(`${API_URL}/convert`, formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "penflow-output.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Penflow</h1>
          <p style={styles.subtitle}>
            Upload a document. Get it back in your handwriting.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          style={styles.dropzone}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div style={styles.uploadIcon}>📄</div>
          <p style={styles.dropText}>
            {file ? file.name : "Drop your file here"}
          </p>
          <p style={styles.dropSubtext}>Supports PDF and DOCX files</p>
          <label style={styles.browseBtn}>
            Browse Files
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* File Info */}
        {file && (
          <div style={styles.fileInfo}>
            <span>📎 {file.name}</span>
            <span style={styles.fileSize}>
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        {/* Customization Section */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Customize</p>

          {/* Font Style */}
          <div style={styles.field}>
            <label style={styles.label}>Handwriting Style</label>
            <select
              style={styles.select}
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div style={styles.field}>
            <label style={styles.label}>Font Size — {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Ink Color */}
          <div style={styles.field}>
            <label style={styles.label}>Ink Color</label>
            <div style={styles.colorRow}>
              {INK_COLORS.map((ink) => (
                <button
                  key={ink.value}
                  onClick={() => setInkColor(ink.value)}
                  style={{
                    ...styles.colorBtn,
                    border: inkColor === ink.value
                      ? `2px solid ${ink.color}`
                      : "2px solid transparent",
                    background: inkColor === ink.value ? "#f0f0f0" : "transparent",
                  }}
                >
                  <span style={{
                    ...styles.colorDot,
                    background: ink.color,
                  }} />
                  {ink.label}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Style */}
          <div style={styles.field}>
            <label style={styles.label}>Paper Style</label>
            <div style={styles.paperRow}>
              {PAPER_STYLES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPaperStyle(p.value)}
                  style={{
                    ...styles.paperBtn,
                    background: paperStyle === p.value ? "#1a1a1a" : "#f5f5f0",
                    color: paperStyle === p.value ? "#fff" : "#1a1a1a",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <button
          style={{
            ...styles.convertBtn,
            opacity: !file || status === "loading" ? 0.6 : 1,
            cursor: !file || status === "loading" ? "not-allowed" : "pointer",
          }}
          onClick={handleConvert}
          disabled={!file || status === "loading"}
        >
          {status === "loading" ? "Converting..." : "Convert to Handwriting"}
        </button>

        {/* Success Message */}
        {status === "success" && (
          <div style={styles.successBox}>
            ✅ Your handwritten PDF has been downloaded!
          </div>
        )}

        {/* Error Message */}
        {status === "error" && (
          <div style={styles.errorBox}>
            ❌ {errorMsg}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "6px",
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
  uploadIcon: {
    fontSize: "36px",
    marginBottom: "0.75rem",
  },
  dropText: {
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  dropSubtext: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "1.25rem",
  },
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
    alignItems: "center",
    background: "#f5f5f0",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "1rem",
  },
  fileSize: {
    color: "#888",
  },
  section: {
    background: "#fafafa",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1.25rem",
    border: "1px solid #eee",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "1rem",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#444",
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    background: "#fff",
    cursor: "pointer",
  },
  slider: {
    width: "100%",
    cursor: "pointer",
  },
  colorRow: {
    display: "flex",
    gap: "8px",
  },
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
  paperRow: {
    display: "flex",
    gap: "8px",
  },
  paperBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  convertBtn: {
    width: "100%",
    padding: "13px",
    fontSize: "15px",
    fontWeight: "500",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    marginBottom: "1rem",
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