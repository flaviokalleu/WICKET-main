import React, { useContext } from "react";
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd
} from "react-flow-renderer";

import "./css/buttonedge.css";
import { Delete } from "@mui/icons-material";

const onEdgeClick = (evt, id) => {
  evt.stopPropagation();
  //removeEdgeList(id);
};

export default function removeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });

  const foreignObjectSize = 40;

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: "#00d4aa",
          strokeWidth: 3,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <body>
          <button
            className="edgebutton"
            onClick={event => onEdgeClick(event, id)}
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
              border: "1px solid #333333",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #ff4757 0%, #ff3742 100%)";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)";
              e.target.style.transform = "scale(1)";
            }}
          >
            <Delete sx={{ width: "14px", height: "14px", color: "#ffffff" }} />
          </button>
        </body>
      </foreignObject>
    </>
  );
}
