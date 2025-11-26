import { useState } from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DownloadIcon from '@mui/icons-material/Download';

export default function FilePreview({ filePath }) {
  const [hover, setHover] = useState(false);
  const ext = filePath?.split(".").pop().toLowerCase();

  const containerStyle = {
    width: 100,
    height: 100,
    border: "1px solid #ccc",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    cursor: filePath ? "pointer" : "default",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)", // סימן מים אפור
    display: hover ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 24,
    transition: "all 0.2s ease",
    borderRadius: 6,
  };

  // --- אם אין קובץ --- //
  if (!filePath) {
    return (
      <div style={containerStyle}>
        <DoNotDisturbIcon style={{ fontSize: 40, color: "#ccc" }} />
      </div>
    );
  }

  // פונקציית הורדה
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `http://localhost:3001/${filePath}`;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={containerStyle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
  {["jpg","jpeg","png","gif","webp"].includes(ext) ? (
    <img src={`http://localhost:3001/${filePath}`} alt="file" style={{ maxWidth:"100%", maxHeight:"100%" }} />
  ) : (
    <InsertDriveFileIcon style={{ fontSize:40, color:"#999" }} />
  )}

  {/* overlay */}
  {hover && (
    <a
      href={`http://localhost:3001/${filePath}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "absolute",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"rgba(0,0,0,0.3)",
        color:"#fff",
        borderRadius:6,
      }}
    >
      <DownloadIcon style={{ fontSize:30 }} />
    </a>
  )}
</div>

  );
}
