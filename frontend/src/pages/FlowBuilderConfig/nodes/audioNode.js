import { ContentCopy, Delete, Message, MicNone } from "@mui/icons-material";
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
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        minWidth: "220px",
        maxWidth: "220px",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        transition: "all 0.2s ease",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          width: "12px",
          height: "12px",
          top: "24px",
          left: "-6px",
          cursor: "pointer",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "12px",
          top: "12px",
          gap: "6px",
          zIndex: 10,
        }}
      >
        <div
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("duplicate");
          }}
          style={{
            padding: "4px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <ContentCopy
            sx={{
              width: "12px",
              height: "12px",
              color: "#6b7280",
              transition: "color 0.2s ease",
            }}
          />
        </div>
        <div
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          style={{
            padding: "4px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <Delete
            sx={{
              width: "12px",
              height: "12px",
              color: "#6b7280",
              transition: "color 0.2s ease",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          paddingRight: "60px",
        }}
      >
        <div
          style={{
            backgroundColor: "#e0f7fa",
            padding: "6px",
            borderRadius: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MicNone
            sx={{
              width: "16px",
              height: "16px",
              color: "#00bcd4",
            }}
          />
        </div>
        <div
          style={{
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "-0.025em",
          }}
        >
          Áudio
        </div>
      </div>
      <div
        style={{
          color: "#232323",
          fontSize: "12px",
          marginBottom: "12px",
          lineHeight: "1.4",
        }}
      >
        <div style={{ marginBottom: "6px" }}>
          {data.record ? "Gravado na hora" : "Áudio enviado"}
        </div>
        <audio controls style={{ width: "100%" }}>
          <source src={`${link}/public/${data.url}`} type="audio/mp3" />
          seu navegador não suporta HTML5
        </audio>
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          width: "12px",
          height: "12px",
          top: "50%",
          right: "-6px",
          cursor: "pointer",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
