import WorldMap, { WorldMapHandle } from "@/components/WorldMap";
import Dashboard from "@/components/Dashboard";
import TPSChart from "@/components/charts/TPSChart";
import LatencyChart from "@/components/charts/LatencyChart";
import CoordinationShardView from "@/components/CoordinationShardView";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  second: number;
  timestamp: string;
  tps: number;
  avgSingleShardTPS: number;
  cumulativeTx: number;
  events: number;
  activeShards: number;
  avgLocalLatency: number;
  avgCrossLatency: number | null;
  transactionConfirmationTime: number;
}

export default function Index() {
  const [metrics, setMetrics] = useState({
    totalTPS: 0,
    avgSingleShardTPS: 0,
    avgSingleShardLatency: 0,
    avgCrossShardLatency: 0,
    totalTransactions: 0,
    leaderChangeTime: "00.00",
    committeeChangeTime: "00.00",
    blockHeight: 0,
  });

  const [tpsData, setTpsData] = useState<{ time: string; value: number }[]>([]);
  const [latencyData, setLatencyData] = useState<
    { time: string; value: number }[]
  >([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [timeSeriesData, setTimeSeriesData] = useState<LogEntry[]>([]);
  
  // Use ref for raw logs to avoid re-rendering and memory issues with large datasets
  const rawLogsRef = useRef<{ timestamp: number; text: string }[]>([]);
  const mainLogsRef = useRef<string[]>([]); // Store full main logs
  const mainLogCursorRef = useRef(0);       // Track current position in main logs
  const worldMapRef = useRef<WorldMapHandle>(null);

  useEffect(() => {
    // Fetch raw logs for display (main.4134.log)
    fetch("/api/raw-logs")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").filter((l) => l.trim() !== "");
        // Store all lines in ref for streaming playback
        mainLogsRef.current = lines;
      })
      .catch((err) => console.error("Failed to load raw logs:", err));

    // Fetch metrics data (Keep existing logic for charts)
    fetch("/api/logs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: LogEntry[]) => {
        if (Array.isArray(data)) {
          setTimeSeriesData(data);
        }
      })
      .catch((err) => console.error("Failed to load logs:", err));

    // WebSocket connection for log.json (Animation Data)
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = window.location.host; // Use current host (works with Vite proxy setup)
    const wsUrl = `${protocol}//${wsHost}/ws/logs`;
    
    console.log("Connecting to WebSocket at:", wsUrl);
    const ws = new WebSocket(wsUrl);
    
    // Buffer for WS messages
    let buffer: { timestamp: number; text: string }[] = [];
    const flushInterval = setInterval(() => {
        if (buffer.length > 0) {
            // Sort buffer to ensure local order
            buffer.sort((a, b) => a.timestamp - b.timestamp);
            
            // Push to main ref
            for (let i = 0; i < buffer.length; i++) {
                rawLogsRef.current.push(buffer[i]);
            }
            // Clear reference
            buffer = [];
        }
    }, 500);

    ws.onopen = () => {
      console.log("Connected to Log WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket connection error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // console.log("WS Received:", msg); // Added for debugging
        
        if (msg.type === "complete" || msg.type === "error" || msg.type === "status") {
            // console.log("WS Message:", msg);
            return;
        }
        
        if (msg.type === 'batch' && Array.isArray(msg.data)) {
            // Processing batch
            msg.data.forEach((logStr: string) => {
                 try {
                     const logObj = JSON.parse(logStr);
                     if (logObj.timestamp) {
                         // Fix timestamp format: "YYYY/MM/DD HH:MM:SS.mmm" -> ISO
                         const dateStr = logObj.timestamp.replace(/\//g, "-").replace(" ", "T") + "Z";
                         const timestamp = new Date(dateStr).getTime();
                         const text = logStr; // Use the raw string from server
                         buffer.push({ timestamp, text });
                     }
                 } catch (e) {
                     // ignore single log parse error
                 }
            });
        }
      } catch (e) {
         console.error("WS Parse Error", e);
      }
    };

    return () => {
      ws.close();
      clearInterval(flushInterval);
    };
  }, []);

  useEffect(() => {
    // Only start simulation loop if we have some data (either charts or logs)
    if (timeSeriesData.length === 0 && rawLogsRef.current.length === 0) return;

    // Configuration
    const LOG_SPEED_MULTIPLIER = 10;
    const CHART_UPDATE_INTERVAL = 1000;
    const LOG_UPDATE_INTERVAL = 100;
    
    // State for simulation
    let currentLogSimTime = 0; 
    let currentChartIndex = 0;
    
    let logCursor = 0;
    let lastLogLength = 0;
    
    // 1. Chart/Metrics Interval (Runs every 1 second)
    const chartInterval = setInterval(() => {
        if (timeSeriesData.length === 0) return;

        if (currentChartIndex >= timeSeriesData.length) {
            currentChartIndex = 0; // Loop charts
        }

        const currentData = timeSeriesData[currentChartIndex];
        const timeStr = currentData.second.toString();

        setMetrics({
          totalTPS: currentData.tps,
          avgSingleShardTPS: currentData.avgSingleShardTPS,
          avgSingleShardLatency: currentData.avgLocalLatency,
          avgCrossShardLatency: currentData.avgCrossLatency ?? 0,
          totalTransactions: currentData.cumulativeTx,
          leaderChangeTime: "00.00",
          committeeChangeTime: "00.00",
          blockHeight: currentData.second,
        });

        setTpsData((prev) => {
            const newData = [...prev, { time: timeStr, value: currentData.tps }];
            return newData.slice(-50);
        });

        setLatencyData((prev) => {
            const newData = [
                ...prev,
                { time: timeStr, value: currentData.transactionConfirmationTime },
            ];
            return newData.slice(-50);
        });

        currentChartIndex++;
    }, CHART_UPDATE_INTERVAL);

    // 2. Log Interval (Runs fast)
    const logInterval = setInterval(() => {
        // --- 1. Stream Main Logs (Visual Only) ---
        if (mainLogsRef.current.length > 0) {
            const BATCH_SIZE = 2; // Add 2 lines per tick
            const start = mainLogCursorRef.current;
            const end = Math.min(start + BATCH_SIZE, mainLogsRef.current.length);
            
            if (start < mainLogsRef.current.length) {
                const newLines = mainLogsRef.current.slice(start, end);
                setLogs(prev => [...prev, ...newLines].slice(-100)); // Keep last 100
                mainLogCursorRef.current = end;
            } else {
                 // Optional: Loop main logs?
                 // mainLogCursorRef.current = 0;
            }
        }

        // --- 2. Process Animation Logs (log.json) ---
        const allLogs = rawLogsRef.current;
        if (allLogs.length === 0) return;

        // Reset cursor if logs array changed significantly (e.g. restart) or check length
        if (allLogs.length < lastLogLength) {
             logCursor = 0;
        }
        lastLogLength = allLogs.length;

        // Initialize log time if needed
        if (currentLogSimTime === 0) {
             currentLogSimTime = allLogs[0].timestamp;
             console.log("Log simulation started at:", new Date(currentLogSimTime).toLocaleString());
        }

        // Gap Skipping Logic
        if (logCursor < allLogs.length) {
            const nextLog = allLogs[logCursor];
            // If the next log is more than 2 seconds in the future, jump gap
            if (nextLog.timestamp > currentLogSimTime + 2000) { 
                 // console.log(`[Sim] Jumping gap`);
                 currentLogSimTime = nextLog.timestamp - 100;
            }
        }

        const endTime = allLogs[allLogs.length - 1].timestamp;
        
        // If we reached the end of available logs
        if (currentLogSimTime >= endTime) {
            // Live Stream Mode: Just wait for more data, do not loop automatically if streaming
            // Unless we are explicitly in "Demo playback" mode. 
            // For now, let's stick to waiting at the edge.
        }

        // Advance log time
        const timeIncrement = LOG_UPDATE_INTERVAL * LOG_SPEED_MULTIPLIER;
        let targetTime = currentLogSimTime + timeIncrement;

        // Prevent simulation from running past the available data (Live Mode Safety)
        if (targetTime > endTime) {
             targetTime = endTime; 
             // If we are clamped, we process up to the very last log, then wait.
        }

        const newLogs: string[] = [];

        // Scan logs
        for (let i = logCursor; i < allLogs.length; i++) {
            const l = allLogs[i];
            if (l.timestamp < currentLogSimTime) {
                continue;
            }
            if (l.timestamp >= targetTime) {
                logCursor = i;
                break;
            }
            
            newLogs.push(l.text);
            if (i === allLogs.length - 1) {
                logCursor = allLogs.length;
            }
        }
        
        if (newLogs.length > 0) {
            // Trigger animations
            newLogs.forEach(logStr => {
                try {
                    const entry = JSON.parse(logStr);
                    // Pass to WorldMap
                    if (entry.shard !== undefined && entry.from_node !== undefined && entry.to_node !== undefined) {
                         worldMapRef.current?.addParticle(entry.shard, entry.from_node, entry.to_node, entry.category);
                    }
                } catch(e) {
                    // Ignore parse errors
                }
            });
        }
        
        currentLogSimTime = targetTime;

    }, LOG_UPDATE_INTERVAL);

    return () => {
        clearInterval(chartInterval);
        clearInterval(logInterval);
    };
  }, [timeSeriesData]); 

  return (
    <Dashboard
      metrics={{
        totalTPS: metrics.totalTPS.toLocaleString(),
        avgSingleShardTPS: metrics.avgSingleShardTPS.toLocaleString(),
        avgSingleShardLatency: metrics.avgSingleShardLatency.toFixed(6),
        avgCrossShardLatency: metrics.avgCrossShardLatency.toFixed(6),
        totalTx: metrics.totalTransactions.toLocaleString(),
        leaderChangeTime: metrics.leaderChangeTime,
        committeeChangeTime: metrics.committeeChangeTime,
      }}
      logs={logs}
      charts={{
        tpsChart: <TPSChart data={tpsData} />,
        latencyChart: <LatencyChart data={latencyData} />,
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 1 && <WorldMap ref={worldMapRef} showShardNumbers={true} activeTab={1} />}
      {activeTab === 2 && <CoordinationShardView />}
      {activeTab === 3 && <WorldMap ref={worldMapRef} showShardNumbers={false} activeTab={3} />}
    </Dashboard>
  );
}
