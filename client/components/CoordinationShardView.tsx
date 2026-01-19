import React from "react";

interface NodeData {
  id: number;
  x: number;
  y: number;
  pieType: string;
  duration?: string;
  delay?: string;
}

const ShardNode: React.FC<{ node: NodeData }> = ({ node }) => {
  const renderPieSegment = (type: string) => {
    const fillColor = "#989FAF";

    // Different pie types from Figma
    const pieTypes: Record<string, JSX.Element> = {
      "full-pie": (
        <path
          d="M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30C0 18.5335 6.43302 8.56956 15.8868 3.52032L30 30V0C46.5685 0 60 13.4315 60 30Z"
          fill={fillColor}
        />
      ),
      quarter: (
        <path d="M0 0C16.5685 0 30 13.4315 30 30H0V0Z" fill={fillColor} />
      ),
      "half-pie": (
        <path
          d="M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30H30V0C46.5685 0 60 13.4315 60 30Z"
          fill={fillColor}
        />
      ),
      "right-half": (
        <path
          d="M30 30C30 46.5685 16.5685 60 0 60V0C16.5685 0 30 13.4315 30 30Z"
          fill={fillColor}
        />
      ),
      "small-wedge": (
        <path
          d="M0 0V30L19.9605 7.6036C14.6576 2.87422 7.66448 0 0 0Z"
          fill={fillColor}
        />
      ),
      "wedge-down": (
        <path
          d="M0 0C16.5685 0 30 13.4315 30 30C30 41.0616 24.0133 50.7249 15.1033 55.9265L0 30V0Z"
          fill={fillColor}
        />
      ),
    };

    return (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        style={{
          position: "absolute",
          left: "-6px",
          top: "-6px",
          overflow: "visible",
        }}
      >
        {pieTypes[type] || pieTypes["full-pie"]}
      </svg>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: "48px",
        height: "48px",
        overflow: "visible",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "48px",
          height: "48px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          borderRadius: "1000px",
          backgroundColor: "#000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="pie-fill-animation"
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            animationDuration: node.duration || "2s",
            animationDelay: node.delay || "0s",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "48px",
              height: "48px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {renderPieSegment(node.pieType)}
          </div>
        </div>
        <div
          style={{
            alignSelf: "stretch",
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "24px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {node.id}
        </div>
      </div>
    </div>
  );
};

const CoordinationShardView: React.FC = () => {
  const nodes: NodeData[] = React.useMemo(() => {
    const rawNodes = [
      { id: 1, x: 759, y: 164, pieType: "full-pie" },
      { id: 2, x: 913, y: 190, pieType: "quarter" },
      { id: 3, x: 967, y: 352.5, pieType: "full-pie" },
      { id: 4, x: 913, y: 516, pieType: "half-pie" },
      { id: 5, x: 759, y: 538, pieType: "right-half" },
      { id: 6, x: 605, y: 516, pieType: "full-pie" },
      { id: 7, x: 511, y: 352.17, pieType: "right-half" },
      { id: 8, x: 605, y: 189, pieType: "half-pie" },
      { id: 9, x: 837, y: 60, pieType: "small-wedge" },
      { id: 10, x: 1103, y: 274, pieType: "half-pie" },
      { id: 11, x: 1103, y: 432, pieType: "right-half" },
      { id: 12, x: 837, y: 644, pieType: "full-pie" },
      { id: 13, x: 681, y: 644, pieType: "wedge-down" },
      { id: 14, x: 417, y: 434, pieType: "right-half" },
      { id: 15, x: 417, y: 274, pieType: "small-wedge" },
      { id: 16, x: 681, y: 60, pieType: "half-pie" },
      { id: 17, x: 1104, y: 129, pieType: "right-half" },
      { id: 18, x: 1261, y: 196, pieType: "full-pie" },     
      { id: 19, x: 1261, y: 510, pieType: "quarter" },
      { id: 20, x: 1103, y: 577, pieType: "quarter" },
      { id: 21, x: 415, y: 577, pieType: "full-pie" },
      { id: 22, x: 257, y: 510, pieType: "wedge-down" },
      { id: 23, x: 256, y: 195, pieType: "small-wedge" },
      { id: 24, x: 415, y: 128, pieType: "wedge-down" },
      { id: 25, x: 1388, y: 93, pieType: "half-pie" },
      { id: 26, x: 1448, y: 274, pieType: "right-half" },
      { id: 27, x: 1448, y: 432, pieType: "half-pie" },
      { id: 28, x: 1338, y: 611, pieType: "wedge-down" },
      { id: 29, x: 130, y: 611, pieType: "wedge-down" },
      { id: 30, x: 70, y: 434, pieType: "small-wedge" },
      { id: 31, x: 70, y: 274, pieType: "quarter" },
      { id: 32, x: 130, y: 93, pieType: "full-pie" },
    ];

    return rawNodes.map((node) => ({
      ...node,
      duration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
      delay: `${(Math.random() * 2).toFixed(2)}s`,
    }));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#E8E8E8",
        border: "1px solid #000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1565px",
          height: "734px",
        }}
      >
        {/* Connection Lines Layer - Spider Web */}
        <svg
          style={{
            position: "absolute",
            left: "-121px",
            top: "-230px",
            width: "1871px",
            height: "1212px",
          }}
          viewBox="0 0 1871 1212"
          fill="none"
        >
          {/* Inner octagon ring */}
          <path
            d="M749.5 443.5L903.5 418L1058.5 444.5L1112 606L1058 770L904 792.5L750 770L695.5 607L749.5 443.5Z"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Middle octagon ring */}
          <path
            d="M982 314L825.5 313.5L560 382L562 528V686.5L560 831L826 898H982L1248 831V686.5V528L1249 383.5L982 314Z"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Inner connecting lines */}
          <path
            d="M750 771.5L560.5 830.5L696.5 605.5L560.5 690M560.5 529L750 442.5L560.5 381.5M827.5 312.5L903.5 417.5L982 313.5L1059.5 442.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Outer ring bottom */}
          <path
            d="M401 606.5L402 764L591 963.807L905 1059.73L1217.37 963.807L1406 764.5L1406.5 608"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Outer ring top */}
          <path
            d="M401 607.233V449.733L591 249.925L905 154L1217.37 249.925L1405.5 449.5L1406.5 605.733"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - right bottom */}
          <path
            d="M904.5 1211.75L1126 1211.99L1411.47 1075.5L1533 865L1594.5 685V606.25"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - right top */}
          <path
            d="M904.5 0.240723L1126 -0.00012207L1411.47 136.491L1533 346.991L1593 528.5L1594.5 605.741"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - left bottom */}
          <path
            d="M904.5 1211.75L683 1211.99L397.532 1075.5L275 865L214.5 685V606.25"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - left top */}
          <path
            d="M904.5 0.240723L683 -0.00012207L397.532 136.491L275 347L214.5 526.991V605.741"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Right side inner connections */}
          <path
            d="M1058 444.5L1249 383.5L1112.5 605.5L1249 529M1249 686.5L1058 769.5L982 898L904.5 793.5M826.5 898.5L750 769.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Right side outer connections */}
          <path
            d="M1249.5 380.5L1405.5 449.5L1249.5 686L1406 764.5L1248 831L1170.5 1042.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Diagonal connection */}
          <path
            d="M982 897.5L1191 1017.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer connections */}
          <path
            d="M1533 865L1727.5 1082M1593 686L1870.5 652.5L1593 528M1533 347L1788 250M275 347L51.5 414.5L215 528M215 688L0 771L275.5 865.5L73 1082"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Complex web connections */}
          <path
            d="M856.5 1038.5L822 899M593 969L562.5 829.5L402.5 764M402.5 764L215 528M402.5 764L215 688.5M402.5 764L374 1123M562.5 687.5L400.5 449M400.5 449L562.5 528.5M400.5 449L560 382L590.5 250.5M400.5 449L275 347L590.5 250.5M909.5 168.5L981 315L1218.5 250.5L1396 110.5M590.5 250.5L831.5 316M1535.5 871.5L1406 764L1592.5 686M1592.5 528.5L1406 450.5L1533 347"
            stroke="black"
            strokeOpacity="0.25"
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <ShardNode key={node.id} node={node} />
        ))}

        {/* Central Coordination Shard */}
        <svg
          style={{
            position: "absolute",
            left: "696px",
            top: "258px",
            width: "205px",
            height: "210px",
          }}
          fill="none"
        >
          <path
            d="M193.834 166.054C185.197 183.713 172.147 198.928 155.904 210.276L87.6953 115.839L87.6953 4.57764e-05C107.619 4.49055e-05 127.218 4.97104 144.656 14.4479C162.095 23.9248 176.805 37.5978 187.409 54.1875C198.013 70.7773 204.164 89.7416 205.288 109.306C206.412 128.87 202.471 148.395 193.834 166.054Z"
            fill="white"
          />
          <circle
            cx="87.3501"
            cy="117.113"
            r="86.8501"
            fill="white"
            stroke="#16171A"
          />
          <text
            fill="#16171A"
            xmlSpace="preserve"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="24"
            fontWeight="bold"
            letterSpacing="-0.02em"
          >
            <tspan x="14.1448" y="117.174">
              Coordination{" "}
            </tspan>
            <tspan x="54.1077" y="145.174">
              Shard
            </tspan>
          </text>
        </svg>

        {/* Snapshot 1 (Pink/Magenta) */}
        <svg
          style={{ position: "absolute", left: "771px", top: "89px" }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="10" cy="10" r="10" fill="#FF00FF" />
        </svg>

        {/* Snapshot 2 (Blue) */}
        <svg
          style={{ position: "absolute", left: "603px", top: "405px" }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="10" cy="10" r="10" fill="#0000FF" />
        </svg>
      </div>

      {/* Legend - Top Right */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          padding: "16px",
          backgroundColor: "#E9E9EA",
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "293px",
          height: "84px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#FF00FF" />
          </svg>
          <span
            style={{
              color: "#000",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "20px",
              whiteSpace: "nowrap",
            }}
          >
            selective local snapshot
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#0000FF" />
          </svg>
          <span
            style={{
              color: "#000",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "20px",
              whiteSpace: "nowrap",
            }}
          >
            global snapshot
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoordinationShardView;
