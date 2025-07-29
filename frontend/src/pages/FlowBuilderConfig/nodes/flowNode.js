import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { 
  AccountTree,
  ContentCopy,
  Delete 
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useNodeStorage } from "../../../stores/useNodeStorage";

const FlowNode = memo(({ data, isConnectable, id }) => {
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
          background: "linear-gradient(135deg, #512da8 0%, #4527a0 100%)",
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
            e.target.style.backgroundColor = "#512da8";
            e.target.style.borderColor = "#512da8";
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
            backgroundColor: "#ede7f6",
            padding: "6px",
            borderRadius: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccountTree
            sx={{
              width: "16px",
              height: "16px",
              color: "#512da8",
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
          Trocar Fluxo
        </Typography>
      </div>

      {/* Informação do fluxo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 10px",
          backgroundColor: "#f8fafc",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          marginBottom: "6px",
          transition: "all 0.2s ease",
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
          justifyContent: "center",
          minWidth: "20px" 
        }}>
          <AccountTree sx={{ color: "#512da8", width: "14px", height: "14px" }} />
        </div>
        <div style={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "10px",
              color: "#64748b",
              fontWeight: "500",
              lineHeight: "1.2",
              marginBottom: "2px",
            }}
          >
            Novo fluxo:
          </Typography>
          <Typography
            sx={{
              fontSize: "11px",
              color: "#475569",
              fontWeight: "600",
              lineHeight: "1.2",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.flow || "(fluxo)"}
          </Typography>
        </div>
      </div>

      {/* Handle de saída */}
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "linear-gradient(135deg, #512da8 0%, #4527a0 100%)",
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

export default FlowNode;