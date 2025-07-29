import { ContentCopy, Delete, Image, Visibility } from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";

export default memo(({ data, isConnectable, id }) => {
  const link = process.env.REACT_APP_BACKEND_URL === 'https://localhost:8090' 
    ? 'https://localhost:8090' 
    : process.env.REACT_APP_BACKEND_URL;

  const storageItems = useNodeStorage();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #333333",
        minWidth: "220px",
        maxWidth: "260px",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 35px rgba(250, 112, 154, 0.2)";
        e.currentTarget.style.borderColor = "#fa709a";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
        e.currentTarget.style.borderColor = "#333333";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {/* Handle de entrada */}
      <Handle
        type="target"
        position="left"
        style={{
          background: "linear-gradient(135deg, #fa709a 0%, #4facfe 100%)",
          width: "14px",
          height: "14px",
          top: "24px",
          left: "-7px",
          cursor: "pointer",
          border: "3px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 4px 15px rgba(250, 112, 154, 0.3)",
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
            backgroundColor: "#fef3c7",
            padding: "8px",
            borderRadius: "8px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            sx={{
              width: "18px",
              height: "18px",
              color: "#f59e0b",
            }}
          />
        </div>
        <div
          style={{
            color: "#1e293b",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Imagem
        </div>
      </div>

      {/* Container da imagem */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          {data.url ? (
            <>
              <img
                src={`${link}/public/${data.url}`}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "120px",
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "500",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Image sx={{ width: "24px", height: "24px" }} />
                <span>Erro ao carregar imagem</span>
              </div>
              {/* Overlay com informações */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Visibility
                  sx={{
                    width: "14px",
                    height: "14px",
                    color: "#ffffff",
                  }}
                />
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "500",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  Visualização
                </span>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "120px",
                backgroundColor: "#f9fafb",
                color: "#6b7280",
                fontSize: "12px",
                fontWeight: "500",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Image sx={{ width: "32px", height: "32px" }} />
              <span>Nenhuma imagem selecionada</span>
            </div>
          )}
        </div>
      </div>

      {/* Badge de status */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: data.url ? "#10b981" : "#6b7280",
          color: "#ffffff",
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "10px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        }}
      >
        {data.url ? "Imagem Carregada" : "Sem Imagem"}
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