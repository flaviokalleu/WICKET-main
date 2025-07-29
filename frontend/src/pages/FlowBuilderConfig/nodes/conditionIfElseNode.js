import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { AccountTree, CheckCircle, Cancel } from "@mui/icons-material";

const ConditionIfElseNode = ({ data }) => {
  return (
    <div 
      style={{
        backgroundColor: "#ffffff",
        padding: "18px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        minWidth: "240px",
        maxWidth: "280px",
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
        position={Position.Left} 
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "12px",
          height: "12px",
          left: "-6px",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }} 
      />
      
      {/* Cabeçalho com ícone */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: "8px",
            borderRadius: "8px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccountTree
            sx={{
              width: "18px",
              height: "18px",
              color: "#f59e0b",
            }}
          />
        </div>
        <span
          style={{
            color: "#1e293b",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Condição IF/Else
        </span>
      </div>

      {/* Seção da condição */}
      <div
        style={{
          backgroundColor: "#fffbeb",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #fed7aa",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#92400e",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "6px",
          }}
        >
          Condição
        </div>
        <div
          style={{
            color: "#451a03",
            fontSize: "13px",
            fontWeight: "500",
            lineHeight: "1.4",
            wordBreak: "break-word",
          }}
        >
          Se <span style={{ 
            backgroundColor: "#f59e0b", 
            color: "#ffffff", 
            padding: "2px 6px", 
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            {data.conditionText || "(condição)"}
          </span>
        </div>
      </div>

      {/* Seções IF e ELSE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* IF - Verdadeiro */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #bbf7d0",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <CheckCircle
            sx={{
              width: "16px",
              height: "16px",
              color: "#16a34a",
              marginTop: "1px",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#166534",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              IF (Verdadeiro)
            </div>
            <div
              style={{
                color: "#14532d",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "1.3",
                wordBreak: "break-word",
              }}
            >
              {data.ifLabel || "(ação se verdadeiro)"}
            </div>
          </div>
        </div>

        {/* ELSE - Falso */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <Cancel
            sx={{
              width: "16px",
              height: "16px",
              color: "#dc2626",
              marginTop: "1px",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#991b1b",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              ELSE (Falso)
            </div>
            <div
              style={{
                color: "#7f1d1d",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "1.3",
                wordBreak: "break-word",
              }}
            >
              {data.elseLabel || "(ação se falso)"}
            </div>
          </div>
        </div>
      </div>

      {/* Handle de saída */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "12px",
          height: "12px",
          right: "-6px",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }} 
      />
    </div>
  );
};

export default ConditionIfElseNode;