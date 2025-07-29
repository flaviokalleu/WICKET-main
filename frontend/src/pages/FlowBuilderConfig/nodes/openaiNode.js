import {
  ArrowForwardIos,
  ContentCopy,
  Delete,
} from "@mui/icons-material";
import React, { memo } from "react";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Handle } from "react-flow-renderer";
import { Typography } from "@mui/material";
import { SiOpenai } from "react-icons/si";

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #3ABA38",
        minWidth: "220px",
        maxWidth: "220px",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow:
          "0 1px 3px 0 rgba(58, 186, 56, 0.1), 0 1px 2px 0 rgba(58, 186, 56, 0.06)",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 4px 6px -1px rgba(58, 186, 56, 0.2), 0 2px 4px -1px rgba(58, 186, 56, 0.12)";
        e.currentTarget.style.borderColor = "#2E8E2B";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 3px 0 rgba(58, 186, 56, 0.1), 0 1px 2px 0 rgba(58, 186, 56, 0.06)";
        e.currentTarget.style.borderColor = "#3ABA38";
      }}
    >
      {/* Handle de entrada */}
      <Handle
        type="target"
        position="left"
        style={{
          background: "linear-gradient(135deg, #3ABA38 0%, #2E8E2B 100%)",
          width: "14px",
          height: "14px",
          top: "24px",
          left: "-7px",
          cursor: "pointer",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(58, 186, 56, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      >
        <ArrowForwardIos
          sx={{
            color: "#ffffff",
            width: "10px",
            height: "10px",
            marginLeft: "2.9px",
            marginBottom: "1px",
            pointerEvents: "none",
          }}
        />
      </Handle>

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
            backgroundColor: "#f0fdf4",
            border: "1px solid #3ABA38",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3ABA38";
            e.currentTarget.style.borderColor = "#2E8E2B";
            const icon = e.currentTarget.querySelector("svg");
            if (icon) icon.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f0fdf4";
            e.currentTarget.style.borderColor = "#3ABA38";
            const icon = e.currentTarget.querySelector("svg");
            if (icon) icon.style.color = "#3ABA38";
          }}
        >
          <ContentCopy
            sx={{
              width: "14px",
              height: "14px",
              color: "#3ABA38",
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
            backgroundColor: "#fef2f2",
            border: "1px solid #ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.borderColor = "#b91c1c";
            const icon = e.currentTarget.querySelector("svg");
            if (icon) icon.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fef2f2";
            e.currentTarget.style.borderColor = "#ef4444";
            const icon = e.currentTarget.querySelector("svg");
            if (icon) icon.style.color = "#ef4444";
          }}
        >
          <Delete
            sx={{
              width: "14px",
              height: "14px",
              color: "#ef4444",
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
          paddingRight: "60px", // Espaço para botões
        }}
      >
        <div
          style={{
            backgroundColor: "#d1fae5",
            padding: "6px",
            borderRadius: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SiOpenai
            style={{
              width: "18px",
              height: "18px",
              color: "#3ABA38",
            }}
          />
        </div>
        <Typography
          sx={{
            color: "#166534",
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "-0.025em",
          }}
        >
          OpenAI
        </Typography>
      </div>

      {/* Conteúdo principal */}
      <div
        style={{
          color: "#232323",
          fontSize: "12px",
          width: "100%",
          backgroundColor: "#f6f6f6",
          borderRadius: "8px",
          padding: "12px",
          border: "1px solid #e0e0e0",
          minHeight: "60px",
          userSelect: "none",
        }}
      >
        {/* Exemplo de conteúdo; pode ajustar conforme necessidade */}
        <Typography
          sx={{
            fontWeight: 500,
            color: "#3ABA38",
          }}
        >
          {data?.content || "Este é o conteúdo do nó OpenAI."}
        </Typography>
      </div>

      {/* Handle de saída */}
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "linear-gradient(135deg, #3ABA38 0%, #2E8E2B 100%)",
          width: "14px",
          height: "14px",
          top: "50%",
          right: "-7px",
          cursor: "pointer",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(58, 186, 56, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(-50%)",
        }}
        isConnectable={isConnectable}
      >
        <ArrowForwardIos
          sx={{
            color: "#ffffff",
            width: "10px",
            height: "10px",
            marginLeft: "2.9px",
            marginBottom: "1px",
            pointerEvents: "none",
          }}
        />
      </Handle>
    </div>
  );
});
