import WorldMap from "@/components/WorldMap";
import Dashboard from "@/components/Dashboard";
import TPSChart from "@/components/charts/TPSChart";
import LatencyChart from "@/components/charts/LatencyChart";
import CoordinationShardView from "@/components/CoordinationShardView";
import { useState, useEffect } from "react";

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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (timeSeriesData.length === 0) return;

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= timeSeriesData.length) {
        currentIndex = 0; // Loop back to start
      }

      const currentData = timeSeriesData[currentIndex];
      const timeStr = currentData.second.toString();
       // Use the timestamp from data if preferred, or just current time
      const timestamp = new Date(currentData.timestamp).toLocaleTimeString();

      const randomLeaderTime = "00.00";
      const randomCommitteeTime = "00.00";

      // Mapping as requested
      const totalTPS = currentData.tps;
      const singleShardTPS = currentData.avgSingleShardTPS;
      const singleShardLatency = currentData.avgLocalLatency;
      const crossShardLatency = currentData.avgCrossLatency ?? 0;
      const cumulativeTx = currentData.cumulativeTx;

      setMetrics({
        totalTPS: totalTPS,
        avgSingleShardTPS: singleShardTPS,
        avgSingleShardLatency: singleShardLatency,
        avgCrossShardLatency: crossShardLatency,
        totalTransactions: cumulativeTx,       // Mapped to cumulativeTx
        leaderChangeTime: randomLeaderTime,
        committeeChangeTime: randomCommitteeTime,
        blockHeight: currentData.second, // Using 'second' as block height proxy
      });

      // Update Charts
      setTpsData((prev) => {
        const newData = [
          ...prev,
          { time: timeStr, value: currentData.tps },
        ];
        return newData.slice(-50);
      });

      setLatencyData((prev) => {
        const newData = [
          ...prev,
          { time: timeStr, value: currentData.transactionConfirmationTime },
        ];
        return newData.slice(-50);
      });

      // Update Logs - Placeholder
      const dummyLog = `[DEBUG] ${timestamp} replica.go:109: [1] received a block from ${Math.floor(Math.random() * 4)}, Round is ${currentData.second}`;
      setLogs((prev) => {
        const newLogs = [...prev, dummyLog];
        return newLogs.slice(-20);
      });

      currentIndex++;
    }, 1000);

    return () => clearInterval(interval);
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
      {activeTab === 1 && <WorldMap showShardNumbers={true} activeTab={1} />}
      {activeTab === 2 && <CoordinationShardView />}
      {activeTab === 3 && <WorldMap showShardNumbers={false} activeTab={3} />}
    </Dashboard>
  );
}
