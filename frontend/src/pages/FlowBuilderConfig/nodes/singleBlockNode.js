import {
  AccessTime,
  ArrowForwardIos,
  ContentCopy,
  Delete,
  Image,
  LibraryBooks,
  Message,
  MicNone,
  Videocam,
  Description,
} from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Typography } from "@mui/material";

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();
  
  const getIconColor = (type) => {
    const colors = {
      message: "#6366f1",
      interval: "#f59e0b",
      img: "#10b981",
      file: "#8b5cf6",
      audio: "#ef4444",
      video: "#06b6d4"
    };
    return colors[type] || "#6b7280";
  };

  const renderContentItem = (item) => {
    const element = data.elements.find((itemLoc) => itemLoc.number === item);
    if (!element) return null;

    const getContent = () => {
      if (item.includes("message")) {
        return {
          icon: <Message sx={{ color: getIconColor("message"), width: "14px", height: "14px" }} />,
          text: element.value
        };
      }
      if (item.includes("interval")) {
        return {
          icon: <AccessTime sx={{ color: getIconColor("interval"), width: "14px", height: "14px" }} />,
          text: `${element.value} segundos`
        };
      }
      if (item.includes("img")) {
        return {
          icon: <Image sx={{ color: getIconColor("img"), width: "14px", height: "14px" }} />,
          text: element.original
        };
      }
      if (item.includes("file")) {
        return {
          icon: <Description sx={{ color: getIconColor("file"), width: "14px", height: "14px" }} />,
          text: element.original.replace(/(\.xlsx|\.docx|\.pdf|\.doc|\.xls).*/, "$1")
        };
      }
      if (item.includes("audio")) {
        return {
          icon: <MicNone sx={{ color: getIconColor("audio"), width: "14px", height: "14px" }} />,
          text: element.original
        };
      }
      if (item.includes("video")) {
        return {
          icon: <Videocam sx={{ color: getIconColor("video"), width: "14px", height: "14px" }} />,
          text: element.original
        };
      }
      return null;
    };

    const content = getContent();
    if (!content) return null;

    return (
      <div
        key={item}
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
          {content.icon}
        </div>
        <Typography
          sx={{
            fontSize: "11px",
            color: "#475569",
            fontWeight: "500",
            lineHeight: "1.2",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {content.text}
        </Typography>
      </div>
    );
  };

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
            backgroundColor: "#f0f4ff",
            padding: "6px",
            borderRadius: "6px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LibraryBooks
            sx={{
              width: "16px",
              height: "16px",
              color: "#6366f1",
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
          Conteúdo
        </Typography>
      </div>

      {/* Lista de conteúdo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "240px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "2px",
        }}
      >
        {data.seq.map(renderContentItem)}
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