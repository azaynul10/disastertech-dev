// Disaster Response Simulator – enhanced interactions
function initSimulator() {
  const canvas = document.getElementById("sim-canvas");
  if (!canvas) return; // Simulator section may not be on this page yet

  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("start-sim");
  const resetBtn = document.getElementById("reset-sim");
  const successSpan = document.getElementById("success-rate");
  const areasSpan = document.getElementById("areas-count");
  const logDiv = document.getElementById("sim-log");
  const apiBase = "https://9l5b7yhwsk.execute-api.us-east-1.amazonaws.com/Prod";

  let simulationInterval = null;
  let areas = [];
  const disasterTypes = ["Earthquake", "Flood", "Wildfire", "Hurricane"];
  const ALERT_RADIUS = 15;

  // Ensure the canvas backing store matches CSS size
  function resizeCanvas() {
    const targetWidth = Math.min(canvas.parentElement.clientWidth - 32, 800);
    const height = Math.round(targetWidth * 0.5); // 2:1 aspect (800x400)
    canvas.width = targetWidth;
    canvas.height = height;
  }

  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    drawMap();
  });

  // Load world map SVG (local for reliability)
  const mapImg = new Image();
  mapImg.crossOrigin = "anonymous";
  mapImg.src = "images/world-map.svg";
  mapImg.onload = () => drawMap();
  mapImg.onerror = () => {
    // Fallback to simple background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mapImg.complete && mapImg.naturalWidth) {
      ctx.drawImage(mapImg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    areas.forEach((a) => drawAlert(a.x, a.y, a.color));
  }

  function drawAlert(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, ALERT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = color || "#ff4d4d";
    ctx.fill();
    ctx.shadowColor = color || "#ff4d4d";
    ctx.shadowBlur = 10;
    ctx.shadowBlur = 0;
  }

  function startSimulation() {
    if (simulationInterval) clearInterval(simulationInterval);
    areas = [];
    drawMap();
    logDiv.innerHTML = "Simulation started: Detecting disasters...<br>";
    let count = 0;
    const maxAreas = 6;
    areasSpan.textContent = "0";
    successSpan.textContent = "0%";

    const r = ALERT_RADIUS;
    simulationInterval = setInterval(() => {
      if (count < maxAreas) {
        const x = r + Math.random() * (canvas.width - 2 * r);
        const y = r + Math.random() * (canvas.height - 2 * r);
        const type =
          disasterTypes[Math.floor(Math.random() * disasterTypes.length)];
        const success = (90 + Math.random() * 9).toFixed(1); // 90-99%
        const point = { x, y, color: "#ff4d4d", type, success };
        areas.push(point);
        drawAlert(x, y, point.color);
        logDiv.innerHTML += `${type} in Area ${
          count + 1
        } coordinated (Success: ${success}%)<br>`;
        count++;
        areasSpan.textContent = String(count);
        const prev = parseFloat(successSpan.textContent) || 0;
        successSpan.textContent =
          ((prev * (count - 1) + parseFloat(success)) / count).toFixed(1) + "%";
      } else {
        clearInterval(simulationInterval);
        simulationInterval = null;
        logDiv.innerHTML +=
          "Simulation complete: Global response optimized!<br>";
        logToAnalytics(areas.length);
      }
    }, 800);
  }

  // Hover tooltip via title + cursor change
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hovered = false;
    for (let i = 0; i < areas.length; i++) {
      if (Math.hypot(x - areas[i].x, y - areas[i].y) < ALERT_RADIUS) {
        canvas.title = `${areas[i].type} | Success: ${areas[i].success}%`;
        hovered = true;
        break;
      }
    }
    if (!hovered) canvas.title = "";
    canvas.style.cursor = hovered ? "pointer" : "default";
  });

  function resetSimulation() {
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = null;
    areas = [];
    drawMap();
    successSpan.textContent = "0%";
    areasSpan.textContent = "0";
    logDiv.innerHTML = "";
  }

  async function logToAnalytics(count) {
    try {
      await fetch(`${apiBase}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          user_agent: "Simulator",
          page: "/simulator",
          simulated_areas: count,
        }),
      });
    } catch (err) {
      console.error("Analytics log error:", err);
    }
  }

  startBtn?.addEventListener("click", startSimulation);
  resetBtn?.addEventListener("click", resetSimulation);

  // Initial draw
  drawMap();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSimulator);
} else {
  initSimulator();
}
