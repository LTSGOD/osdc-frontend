import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import fs from "fs";
import path from "path";
import readline from "readline";

export function setupWebSocket(server: Server) {
  // Use noServer mode to avoid conflict with Vite HMR or other listeners
  const wss = new WebSocketServer({ noServer: true });

  console.log("WebSocket server configured at /ws/logs");

  server.on("upgrade", (request, socket, head) => {
    const pathname = request.url;
    
    if (pathname === "/ws/logs") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected to WebSocket");
    
    // --- DEBUG: Dummy Data Generator (Random Log Simulation) ---
    const debugInterval = setInterval(() => {
        // Generate random parameters
        const shards = [0, 1, 2, 3, 4, 5, 6, 7];
        const nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const randomShard = shards[Math.floor(Math.random() * shards.length)];
        const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
        const toNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        // Format timestamp like the log file: "YYYY/MM/DD HH:mm:ss.SSSSSS"
        const now = new Date();
        const dateStr = now.toISOString().replace("T", " ").replace("Z", "") + "000"; // roughly matching format
        // Or strictly matching "2025/08/28 ..." if needed, but using real time is better for live testing.
        // Actually, let's just use ISO string lightly modified to look like valid log timestamp
        // The client expects: YYYY/MM/DD ...
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0') + "000";
        const timeStr = `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}.${ms}`;

        const dummyLog = {
            timestamp: timeStr,
            shard: randomShard,
            from_node: fromNode,
            to_node: toNode,
            message_type: "prepare",
            category: "vote_message",
            blockheight: 1025 + Math.floor(Math.random() * 100),
            line: 18065 + Math.floor(Math.random() * 1000)
        };

        const payload = {
            type: "batch",
            data: [JSON.stringify(dummyLog)] // Client expects array of strings
        };

        // console.log("[WS Debug] Sending Simulated Log:", dummyLog);
        ws.send(JSON.stringify(payload));
    }, 10); // Send every 10ms (High Load Test)

    // Send initial status
    ws.send(JSON.stringify({ type: "status", message: "Connected to log stream" }));

    const logPath = path.join(process.cwd(), "logs", "log.json");
    
    if (!fs.existsSync(logPath)) {
        ws.send(JSON.stringify({ type: "error", message: "Log file not found" }));
        return;
    }

    console.log("Streaming logs from:", logPath);
    streamLogs(ws, logPath);

    ws.on("close", () => {
      console.log("Client disconnected");
      clearInterval(debugInterval); // Clean up debug timer
    });
  });
}

function streamLogs(ws: WebSocket, filePath: string) {
    const fileStream = fs.createReadStream(filePath);
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let batch: string[] = [];
    const BATCH_SIZE = 100;
    let sending = false;
    let paused = false;
    
    // Handle backpressure roughly by pausing/resuming based on buffered amount?
    // WS doesn't have built-in stream pipe easily for text lines as JSON objects.
    // We'll read line by line and send batches.
    
    rl.on('line', (line) => {
        if (!line.trim()) return;
        batch.push(line);

        if (batch.length >= BATCH_SIZE) {
            sendBatch();
        }
    });

    rl.on('close', () => {
        if (batch.length > 0) {
            sendBatch();
        }
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "complete" }));
        }
    });

    function sendBatch() {
        if (ws.readyState === WebSocket.OPEN) {
            // Check buffered amount to avoid flooding
            if (ws.bufferedAmount > 1024 * 1024) { // 1MB buffer
                // Simple flow control: pause reading if buffer is full
                // readline doesn't expose easy pause/resume based on sync consumer
                // But we can just send. If client can't keep up, we might need a better strategy.
                // For now, allow it to fill.
            }
            
            // console.log(`[WS] Sending batch of ${batch.length} items`);
            ws.send(JSON.stringify({ type: "batch", data: batch }));
            batch = [];
        } else {
            rl.close();
            fileStream.destroy();
        }
    }
}
