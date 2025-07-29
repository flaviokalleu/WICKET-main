import {
  ArrowForwardIos,
  CallSplit,
  ContentCopy,
  Delete,
  Message,
} from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Typography } from "@mui/material";

export default memo(({ data, isConnectable, id }) => {
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
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Handle de entrada */}
      <Handle
        type="target"
        position="left"
        style={{
          background: "linear-gradient(135deg, #1FBADC 0%, #0891b2 100%)",
          width: "12px",
          height: "12px",
          top: "24px",
          left: "-6px",
          cursor: "pointer",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />

      {/* Botões de ação */}
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
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#1FBADC";
            e.target.style.borderColor = "#1FBADC";
            const icon = e.target.querySelector("svg");
            if (icon) icon.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f8fafc";
            e.target.style.borderColor = "#e2e8f0";
            const icon = e.target.querySelector("svg");
            if (icon) icon.style.color = "#6b7280";
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
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ef4444";
            e.target.style.borderColor = "#ef4444";
            const icon = e.target.querySelector("svg");
            if (icon) icon.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f8fafc";
            e.target.style.borderColor = "#e2e8f0";
            const icon = e.target.querySelector("svg");
            if (icon) icon.style.color = "#6b7280";
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

      {/* Cabeçalho */}
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
            backgroundColor: "#cffafe",
            padding: "6px",
            borderRadius: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CallSplit
            sx={{
              width: "16px",
              height: "16px",
              color: "#1FBADC",
            }}
          />
        </div>
        <Typography
          sx={{
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "-0.025em",
          }}
        >
          Randomizador
        </Typography>
      </div>

      {/* Opções de probabilidade */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Primeira opção */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            padding: "8px 10px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f5f9";
            e.target.style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f8fafc";
            e.target.style.borderColor = "#e2e8f0";
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            flex: 1 
          }}>
            <CallSplit sx={{ color: "#1FBADC", width: "14px", height: "14px" }} />
            <Typography
              sx={{
                fontSize: "11px",
                color: "#475569",
                fontWeight: "600",
                lineHeight: "1.2",
              }}
            >
              {data.percent}%
            </Typography>
          </div>
          
          {/* Handle de saída para primeira opção */}
          <Handle
            type="source"
            position="right"
            id="a"
            style={{
              background: "linear-gradient(135deg, #1FBADC 0%, #0891b2 100%)",
              width: "12px",
              height: "12px",
              top: "50%",
              right: "-6px",
              cursor: "pointer",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-50%)",
            }}
            isConnectable={isConnectable}
          />
        </div>

        {/* Segunda opção */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            padding: "8px 10px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f5f9";
            e.target.style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f8fafc";
            e.target.style.borderColor = "#e2e8f0";
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            flex: 1 
          }}>
            <CallSplit sx={{ color: "#1FBADC", width: "14px", height: "14px" }} />
            <Typography
              sx={{
                fontSize: "11px",
                color: "#475569",
                fontWeight: "600",
                lineHeight: "1.2",
              }}
            >
              {100 - data.percent}%
            </Typography>
          </div>
          
          {/* Handle de saída para segunda opção */}
          <Handle
            type="source"
            position="right"
            id="b"
            style={{
              background: "linear-gradient(135deg, #1FBADC 0%, #0891b2 100%)",
              width: "12px",
              height: "12px",
              top: "50%",
              right: "-6px",
              cursor: "pointer",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-50%)",
            }}
            isConnectable={isConnectable}
          />
        </div>
      </div>
    </div>
  );
});