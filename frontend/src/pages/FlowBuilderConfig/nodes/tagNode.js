import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { Add, Remove, LocalOffer } from "@mui/icons-material";

const TagNode = ({ data }) => {
  const isAdd = data.action === "add";
  
  return (
    <div 
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        minWidth: "180px",
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
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f0f4ff",
            padding: "6px",
            borderRadius: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LocalOffer
            sx={{
              width: "16px",
              height: "16px",
              color: "#6366f1",
            }}
          />
        </div>
        <span
          style={{
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "-0.025em",
          }}
        >
          Tag
        </span>
      </div>

      {/* Conteúdo principal */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Ação */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: isAdd ? "#dcfce7" : "#fef2f2",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isAdd ? (
              <Add
                sx={{
                  width: "14px",
                  height: "14px",
                  color: "#16a34a",
                }}
              />
            ) : (
              <Remove
                sx={{
                  width: "14px",
                  height: "14px",
                  color: "#dc2626",
                }}
              />
            )}
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "#475569",
              fontWeight: "500",
            }}
          >
            {isAdd ? "Adicionar" : "Remover"} tag
          </span>
        </div>

        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "#64748b",
              fontWeight: "400",
            }}
          >
            Tag:
          </span>
          <div
            style={{
              backgroundColor: isAdd ? "#16a34a" : "#dc2626",
              color: "#ffffff",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "500",
              maxWidth: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.tag || "(tag)"}
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

export default TagNode;