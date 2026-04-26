import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); 
  const [errorMsg, setErrorMsg] = useState("");

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

    try {
      const response = await axios.post(`${API_URL}/convert`, formData, {
        responseType: "blob", 
      });

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "handwritten.pdf");
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
    padding: "2.5rem",
    textAlign: "center",
    marginBottom: "1rem",
    transition: "border-color 0.2s",
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