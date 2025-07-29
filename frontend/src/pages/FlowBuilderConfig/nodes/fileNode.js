import {
  ArrowForwardIos,
  ContentCopy,
  Delete,
  CloudUpload,
  AttachFile,
} from "@mui/icons-material";
import React, { memo } from "react";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Handle } from "react-flow-renderer";
import { Typography } from "@material-ui/core";

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
        position="left"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            e.target.style.backgroundColor = "#6366f1";
            e.target.style.borderColor = "#6366f1";
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
          paddingRight: "60px", // Espaço para os botões
        }}
      >
        <div
          style={{
            backgroundColor: "#ede9fe",
            padding: "8px",
            borderRadius: "8px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloudUpload
            sx={{
              width: "18px",
              height: "18px",
              color: "#8b5cf6",
            }}
          />
        </div>
        <Typography
          sx={{
            color: "#1e293b",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Arquivo
        </Typography>
      </div>

      {/* Conteúdo principal */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: data.file ? "8px" : "0",
          }}
        >
          <div
            style={{
              backgroundColor: "#8b5cf6",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AttachFile
              sx={{
                width: "12px",
                height: "12px",
                color: "#ffffff",
              }}
            />
          </div>
          <Typography
            sx={{
              fontSize: "13px",
              color: "#374151",
              fontWeight: "600",
              lineHeight: "1.3",
            }}
          >
            {data.label || "Enviar Arquivo"}
          </Typography>
        </div>

        {data.file && (
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "8px 10px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              marginTop: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                color: "#6b7280",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              Arquivo Selecionado
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#1f2937",
                fontWeight: "600",
                wordBreak: "break-all",
                lineHeight: "1.3",
              }}
            >
              {data.file.name}
            </Typography>
          </div>
        )}
      </div>

      {/* Badge de status */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: data.file ? "#10b981" : "#f59e0b",
          color: "#ffffff",
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "10px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        }}
      >
        {data.file ? "Arquivo Carregado" : "Pendente"}
      </div>

      {/* Handle de saída */}
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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