// Template padrão para todos os nós com dark theme
export const nodeBaseStyle = {
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
};

export const nodeHoverEffects = {
  onMouseEnter: (e, accentColor = "#00d4aa") => {
    e.currentTarget.style.boxShadow = `0 12px 35px ${accentColor}33`;
    e.currentTarget.style.borderColor = accentColor;
    e.currentTarget.style.transform = "translateY(-2px)";
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
    e.currentTarget.style.borderColor = "#333333";
    e.currentTarget.style.transform = "translateY(0px)";
  }
};

export const handleStyle = (color1 = "#00d4aa", color2 = "#4facfe") => ({
  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  width: "14px",
  height: "14px",
  cursor: "pointer",
  border: "3px solid #ffffff",
  borderRadius: "50%",
  boxShadow: `0 4px 15px ${color1}4D`,
});

export const iconContainerStyle = (color1 = "#00d4aa", color2 = "#4facfe") => ({
  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  padding: "8px",
  borderRadius: "8px",
  marginRight: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 4px 15px ${color1}4D`,
});

export const titleStyle = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  letterSpacing: "-0.025em",
};

export const contentStyle = {
  color: "#a0a0a0",
  fontSize: "13px",
  marginBottom: "12px",
  lineHeight: "1.4",
  backgroundColor: "#0f0f0f",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #333333",
};

export const actionButtonStyle = {
  padding: "6px",
  borderRadius: "6px",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
  border: "1px solid #333333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
};
