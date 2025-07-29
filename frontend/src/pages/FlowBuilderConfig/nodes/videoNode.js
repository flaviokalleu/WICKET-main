import {
  ContentCopy,
  Delete,
  Image,
  Message,
  Videocam
} from "@mui/icons-material";
import React, { memo } from "react";

import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";

export default memo(({ data, isConnectable, id }) => {
  const link =
    process.env.REACT_APP_BACKEND_URL === "https://localhost:8090"
      ? "https://localhost:8090"
      : process.env.REACT_APP_BACKEND_URL;

  const storageItems = useNodeStorage();

  return (
    <div
      style={{ 
        background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)", 
        padding: "16px", 
        borderRadius: "12px",
        border: "1px solid #333333",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        minWidth: "200px",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{ 
          background: "linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)",
          width: "12px",
          height: "12px",
          border: "2px solid #ffffff",
        }}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 8,
          top: 8,
          cursor: "pointer",
          gap: 8
        }}
      >
        <ContentCopy
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("duplicate");
          }}
          sx={{ 
            width: "16px", 
            height: "16px", 
            color: "#a0a0a0",
            '&:hover': { color: "#00d4aa" },
            transition: "color 0.3s ease",
          }}
        />

        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ 
            width: "16px", 
            height: "16px", 
            color: "#a0a0a0",
            '&:hover': { color: "#ff4757" },
            transition: "color 0.3s ease",
          }}
        />
      </div>
      <div
        style={{
          color: "#ffffff",
          fontSize: "16px",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <Videocam
          sx={{
            width: "20px",
            height: "20px",
            marginRight: "8px",
            color: "#00d4aa"
          }}
        />
        <div style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600 }}>Vídeo</div>
      </div>
      <div style={{ 
        color: "#a0a0a0", 
        fontSize: "12px", 
        width: 180,
        backgroundColor: "#0f0f0f",
        borderRadius: "8px",
        padding: "8px",
        border: "1px solid #333333",
      }}>
        <video 
          controls="controls" 
          width="180px"
          style={{
            borderRadius: "6px",
            backgroundColor: "#000000",
          }}
        >
          <source src={`${link}/public/${data.url}`} type="video/mp4" />
          seu navegador não suporta HTML5
        </video>
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{ 
          background: "linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)",
          width: "12px",
          height: "12px",
          border: "2px solid #ffffff",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
