import WorldMap from "@/components/WorldMap";
import Dashboard from "@/components/Dashboard";
import TPSChart from "@/components/charts/TPSChart";
import LatencyChart from "@/components/charts/LatencyChart";
import { useState, useEffect } from "react";

export default function Index() {
  const [metrics, setMetrics] = useState({
    totalTPS: 0,
    avgSingleShardTPS: 0,
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

  useEffect(() => {
    let currentTotalTx = 0;
    let currentBlockHeight = 0;
    let timeIndex = 0;

    const interval = setInterval(() => {
      currentBlockHeight += 1;
      const now = new Date();
      const timeStr = (timeIndex++).toString();
      const timestamp = now.toISOString().split("T")[1].slice(0, -1);

      // Random generation logic
      const randomTotalTPS = Math.floor(Math.random() * 3000) + 2000; // 2000-5000
      const randomSingleShardTPS = Math.floor(
        randomTotalTPS * (0.3 + Math.random() * 0.1),
      );
      const randomLatency = parseFloat((Math.random() * 0.5 + 0.3).toFixed(6));
      const randomLeaderTime = (Math.random() * 10).toFixed(2);
      const randomCommitteeTime = (Math.random() * 5 + 5).toFixed(2);

      currentTotalTx += randomTotalTPS;

      setMetrics({
        totalTPS: randomTotalTPS,
        avgSingleShardTPS: randomSingleShardTPS,
        avgCrossShardLatency: randomLatency,
        totalTransactions: currentTotalTx,
        leaderChangeTime: randomLeaderTime,
        committeeChangeTime: randomCommitteeTime,
        blockHeight: currentBlockHeight,
      });

      // Update Charts
      setTpsData((prev) => {
        const newData = [...prev, { time: timeStr, value: randomTotalTPS }];
        return newData.slice(-50); // Keep last 50 points
      });

      setLatencyData((prev) => {
        const newData = [...prev, { time: timeStr, value: randomLatency }];
        return newData.slice(-50); // Keep last 50 points
      });

      // Update Logs
      const dummyLog = `[DEBUG] ${timestamp} replica.go:109: [1] received a block from ${Math.floor(Math.random() * 4)}, Round is ${currentBlockHeight}`;
      setLogs((prev) => {
        const newLogs = [...prev, dummyLog];
        return newLogs.slice(-20); // Keep last 20 logs
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dashboard
      metrics={{
        totalTPS: metrics.totalTPS.toLocaleString(),
        avgSingleShardTPS: metrics.avgSingleShardTPS.toLocaleString(),
        avgLatency: metrics.avgCrossShardLatency.toFixed(6),
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
      {activeTab === 1 && <WorldMap showShardNumbers={true} />}
      {activeTab === 2 && (
        <div className="flex items-center justify-center h-full text-2xl text-gray-400 font-bold">
          Screen 2
        </div>
      )}
      {activeTab === 3 && <WorldMap showShardNumbers={false} />}
    </Dashboard>
  );
}
