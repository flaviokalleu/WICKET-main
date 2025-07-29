import {
  ArrowForwardIos,
  ContentCopy,
  Delete,
  Message
} from "@mui/icons-material";
import React, { memo } from "react";

import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #333333",
        minWidth: "220px",
        maxWidth: "220px",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 35px rgba(79, 172, 254, 0.2)";
        e.currentTarget.style.borderColor = "#4facfe";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
        e.currentTarget.style.borderColor = "#333333";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)",
          width: "14px",
          height: "14px",
          top: "24px",
          left: "-7px",
          cursor: "pointer",
          border: "3px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
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
          gap: "8px",
          zIndex: 10,
        }}
      >
        <div
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("duplicate");
          }}
          style={{
            padding: "6px",
            borderRadius: "6px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
            border: "1px solid #333333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)";
            e.target.style.transform = "scale(1)";
          }}
        >
          <ContentCopy
            sx={{
              width: "14px",
              height: "14px",
              color: "#a0a0a0",
              transition: "color 0.3s ease",
            }}
          />
        </div>
        <div
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          style={{
            padding: "6px",
            borderRadius: "6px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
            border: "1px solid #333333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(135deg, #ff4757 0%, #ff3742 100%)";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)";
            e.target.style.transform = "scale(1)";
          }}
        >
          <Delete
            sx={{
              width: "14px",
              height: "14px",
              color: "#a0a0a0",
              transition: "color 0.3s ease",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          paddingRight: "80px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)",
            padding: "8px",
            borderRadius: "8px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
          }}
        >
          <Message
            sx={{
              width: "18px",
              height: "18px",
              color: "#ffffff",
            }}
          />
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Mensagem
        </div>
      </div>
      <div
        style={{
          color: "#a0a0a0",
          fontSize: "13px",
          marginBottom: "12px",
          lineHeight: "1.4",
          backgroundColor: "#0f0f0f",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #333333",
        }}
      >
        💬 {data.label}
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)",
          width: "14px",
          height: "14px",
          top: "50%",
          right: "-7px",
          cursor: "pointer",
          border: "3px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
