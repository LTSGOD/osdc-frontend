import React from "react";

interface NodeData {
  id: number;
  x: number;
  y: number;
  pieType: string; // Type of pie chart segment
}

const CoordinationShardView: React.FC = () => {
  // Node positions based on Figma design (scaled to percentage-based layout)
  const nodes: NodeData[] = [
    { id: 1, x: 529, y: 105, pieType: "full-pie" },
    { id: 2, x: 663, y: 130, pieType: "quarter" },
    { id: 3, x: 717, y: 293, pieType: "full-pie" },
    { id: 4, x: 663, y: 456, pieType: "half-pie" },
    { id: 5, x: 529, y: 478, pieType: "right-half" },
    { id: 6, x: 395, y: 456, pieType: "full-pie" },
    { id: 7, x: 341, y: 292, pieType: "right-half" },
    { id: 8, x: 395, y: 129, pieType: "half-pie" },
    { id: 9, x: 607, y: 0, pieType: "small-wedge" },
    { id: 10, x: 823, y: 214, pieType: "half-pie" },
    { id: 11, x: 823, y: 372, pieType: "right-half" },
    { id: 12, x: 607, y: 584, pieType: "full-pie" },
    { id: 13, x: 451, y: 584, pieType: "wedge-down" },
    { id: 14, x: 237, y: 374, pieType: "right-half" },
    { id: 15, x: 237, y: 214, pieType: "small-wedge" },
    { id: 16, x: 451, y: 0, pieType: "half-pie-simple" },
    { id: 17, x: 824, y: 69, pieType: "right-half" },
    { id: 18, x: 931, y: 136, pieType: "full-pie" },
    { id: 19, x: 931, y: 450, pieType: "quarter" },
    { id: 20, x: 823, y: 517, pieType: "quarter-simple" },
    { id: 21, x: 235, y: 517, pieType: "full-pie" },
    { id: 22, x: 127, y: 450, pieType: "wedge-down-2" },
    { id: 23, x: 126, y: 135, pieType: "small-wedge" },
    { id: 24, x: 235, y: 68, pieType: "wedge-down" },
    { id: 25, x: 1058, y: 33, pieType: "half-pie" },
    { id: 26, x: 1058, y: 214, pieType: "right-half" },
    { id: 27, x: 1058, y: 372, pieType: "half-pie" },
    { id: 28, x: 1058, y: 551, pieType: "wedge-down" },
    { id: 29, x: 0, y: 551, pieType: "wedge-down" },
    { id: 30, x: 0, y: 374, pieType: "small-wedge" },
    { id: 31, x: 0, y: 214, pieType: "quarter" },
    { id: 32, x: 0, y: 33, pieType: "full-pie" },
  ];

  // Connection lines (simplified from Figma)
  const connections = [
    // Top left cluster
    { x1: 107, y1: 102, x2: 237, y2: 180 },
    { x1: 237, y1: 180, x2: 0, y2: 37 },
    { x1: 107, y1: 102, x2: 0, y2: 182 },
    
    // Top right cluster
    { x1: 970, y1: 389, x2: 1313, y2: 651 },
    { x1: 970, y1: 389, x2: 1186, y2: 547 },
    { x1: 1186, y1: 547, x2: 970, y2: 471 },
    
    // Bottom cluster
    { x1: 705, y1: 470, x2: 1076, y2: 470 },
    { x1: 705, y1: 470, x2: 784, y2: 555 },
    { x1: 784, y1: 555, x2: 705, y2: 683 },
    
    // Center connections
    { x1: 381, y1: 97, x2: 861, y2: 615 },
    { x1: 381, y1: 97, x2: 651, y2: 558 },
    { x1: 651, y1: 558, x2: 491, y2: 474 },
    
    // Left side
    { x1: 253, y1: 127, x2: 489, y2: 649 },
    { x1: 253, y1: 127, x2: 127, y2: 233 },
    { x1: 127, y1: 233, x2: 253, y2: 313 },
  ];

  // Render SVG pie segments for each node type
  const renderPieSegment = (type: string) => {
    const fillColor = "#989FAF";
    
    switch (type) {
      case "full-pie":
        return (
          <svg width="60" height="60" viewBox="0 0 48 48" style={{ position: "absolute", left: "-6px", top: "-6px" }}>
            <path d="M54 24C54 40.5685 40.5685 54 24 54C7.43146 54 -6 40.5685 -6 24C-6 12.5335 0.433016 2.56956 9.88683 -2.47968L24 24V-6C40.5685 -6 54 7.43146 54 24Z" fill={fillColor}/>
          </svg>
        );
      case "quarter":
        return (
          <svg width="30" height="30" viewBox="0 0 24 24" style={{ position: "absolute", right: "-6px", top: "-6px" }}>
            <path d="M0 -6.07617C16.5685 -6.07617 30 7.35529 30 23.9238H0V-6.07617Z" fill={fillColor}/>
          </svg>
        );
      case "half-pie":
        return (
          <svg width="60" height="60" viewBox="0 0 48 48" style={{ position: "absolute", left: "-6px", top: "-6px" }}>
            <path d="M54 24C54 40.5685 40.5685 54 24 54C7.43146 54 -6 40.5685 -6 24H24V-6C40.5685 -6 54 7.43146 54 24Z" fill={fillColor}/>
          </svg>
        );
      case "right-half":
        return (
          <svg width="30" height="60" viewBox="0 0 24 48" style={{ position: "absolute", right: "-6px", top: "-6px" }}>
            <path d="M30 24C30 40.5685 16.5685 54 0 54V-6C16.5685 -6 30 7.43146 30 24Z" fill={fillColor}/>
          </svg>
        );
      case "small-wedge":
        return (
          <svg width="20" height="30" viewBox="0 0 20 24" style={{ position: "absolute", right: "4px", top: "-6px" }}>
            <path d="M0 -6V24L19.9605 1.6036C14.6576 -3.12578 7.66448 -6 0 -6Z" fill={fillColor}/>
          </svg>
        );
      case "wedge-down":
        return (
          <svg width="30" height="56" viewBox="0 0 24 48" style={{ position: "absolute", right: "-6px", top: "-6px" }}>
            <path d="M0 -6C16.5685 -6 30 7.43146 30 24C30 35.0616 24.0133 44.7249 15.1033 49.9265L0 24V-6Z" fill={fillColor}/>
          </svg>
        );
      case "wedge-down-2":
        return (
          <svg width="24" height="45" viewBox="0 0 24 45" style={{ position: "absolute", right: "0px", top: "0px" }}>
            <path d="M0 0C13.2245 0 23.945 10.7205 23.945 23.945C23.945 32.774 19.1666 40.4869 12.0549 44.6387L0 23.945V0Z" fill={fillColor}/>
          </svg>
        );
      case "half-pie-simple":
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: "absolute", left: "0", top: "0" }}>
            <path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24H24V0C37.2548 0 48 10.7452 48 24Z" fill={fillColor}/>
          </svg>
        );
      case "quarter-simple":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: "absolute", right: "0", top: "0" }}>
            <path d="M0 0C13.2128 0 23.9238 10.7111 23.9238 23.9238H0V0Z" fill={fillColor}/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      position: "relative", 
      backgroundColor: "#E8E8E8",
      overflow: "hidden"
    }}>
      {/* Container with fixed aspect ratio */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "1106px",
        height: "632px",
      }}>
        
        {/* Connection Lines */}
        <svg 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%",
            pointerEvents: "none",
            zIndex: 1
          }}
          viewBox="0 0 1106 632"
        >
          {connections.map((conn, idx) => (
            <line 
              key={idx}
              x1={conn.x1} 
              y1={conn.y1} 
              x2={conn.x2} 
              y2={conn.y2}
              stroke="rgba(0, 0, 0, 0.25)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: "48px",
              height: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "1000px",
              backgroundColor: "#000",
              zIndex: 5,
            }}
          >
            {renderPieSegment(node.pieType)}
            <div style={{
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "24px",
              fontWeight: "700",
              lineHeight: "24px",
              position: "relative",
              zIndex: 10,
            }}>
              {node.id}
            </div>
          </div>
        ))}

        {/* Central Coordination Shard */}
        <div style={{
          position: "absolute",
          left: "467px",
          top: "199px",
          width: "205px",
          height: "210px",
          zIndex: 10,
        }}>
          <svg width="206" height="211" viewBox="0 0 206 211" fill="none">
            <path d="M193.834 166.054C185.197 183.713 172.147 198.928 155.904 210.276L87.6951 115.839L87.6951 4.57764e-05C107.619 4.49055e-05 127.217 4.97104 144.656 14.4479C162.095 23.9248 176.805 37.5978 187.409 54.1875C198.013 70.7773 204.164 89.7416 205.288 109.306C206.412 128.87 202.471 148.395 193.834 166.054Z" fill="white"/>
            <circle cx="87.35" cy="117.166" r="86.85" fill="white" stroke="#16171A" strokeWidth="1"/>
          </svg>
          
          {/* Coordination Shard Text */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#16171A",
            fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            lineHeight: "28px",
          }}>
            <div>Coordination</div>
            <div>Shard</div>
          </div>
        </div>

        {/* Snapshot 1 (Pink/Magenta) - selective local snapshot */}
        <svg 
          style={{ position: "absolute", left: "611px", top: "89px", zIndex: 15 }}
          width="20" 
          height="20" 
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="10" fill="#FF00FF"/>
        </svg>

        {/* Snapshot 2 (Blue) - global snapshot */}
        <svg 
          style={{ position: "absolute", left: "443px", top: "405px", zIndex: 15 }}
          width="20" 
          height="20" 
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="10" fill="#0000FF"/>
        </svg>
      </div>

      {/* Legend - Top Right */}
      <div style={{
        position: "absolute",
        top: "0",
        right: "0",
        width: "293px",
        height: "84px",
        padding: "16px 24px",
        backgroundColor: "#FFF",
        border: "1px solid #000",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill="#FF00FF"/>
          </svg>
          <span style={{
            color: "#000",
            fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "20px",
          }}>
            selective local snapshot
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill="#0000FF"/>
          </svg>
          <span style={{
            color: "#000",
            fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "20px",
          }}>
            global snapshot
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoordinationShardView;
