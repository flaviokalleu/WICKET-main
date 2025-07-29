import { ArrowForwardIos, RocketLaunch } from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";

export default memo(({ data, isConnectable }) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #333333",
        minWidth: "220px",
        maxWidth: "280px",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 212, 170, 0.2)";
        e.currentTarget.style.borderColor = "#00d4aa";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
        e.currentTarget.style.borderColor = "#333333";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
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
            background: "linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)",
            padding: "10px",
            borderRadius: "12px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(0, 212, 170, 0.3)",
          }}
        >
          <RocketLaunch
            sx={{
              width: "20px",
              height: "20px",
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
          Início do Fluxo
        </div>
      </div>

      {/* Conteúdo descritivo */}
      <div
        style={{
          backgroundColor: "#0f0f0f",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #333333",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            color: "#a0a0a0",
            fontSize: "13px",
            lineHeight: "1.5",
            fontWeight: "500",
          }}
        >
          🚀 Este bloco marca o início do seu fluxo automatizado
        </div>
      </div>

      {/* Badge de status */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)",
          color: "#ffffff",
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        Ponto de Partida
      </div>

      {/* Handle de saída */}
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)",
          width: "16px",
          height: "16px",
          top: "50%",
          right: "-8px",
          cursor: "pointer",
          border: "3px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 4px 15px rgba(0, 212, 170, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        isConnectable={isConnectable}
      />

      {/* Estilos de animação inline */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
});