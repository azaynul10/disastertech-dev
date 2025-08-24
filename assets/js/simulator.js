// Disaster Response Simulator – enhanced interactions with mobile responsiveness
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
  let ALERT_RADIUS = 15; // Will be adjusted based on screen size

  // Enhanced responsive canvas sizing
  function resizeCanvas() {
    const canvas = document.getElementById("sim-canvas");
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || window.innerHeight * 0.3;

    // Calculate responsive dimensions with aggressive mobile constraints
    let targetWidth, targetHeight;
    
    // Mobile-first approach with very strict constraints
    if (containerWidth <= 320) {
      // Very small mobile phones
      targetWidth = Math.min(containerWidth - 16, 280);
      targetHeight = Math.min(targetWidth * 0.5, 140);
      ALERT_RADIUS = 8;
    } else if (containerWidth <= 375) {
      // Small mobile phones (iPhone SE, etc.)
      targetWidth = Math.min(containerWidth - 24, 320);
      targetHeight = Math.min(targetWidth * 0.55, 160);
      ALERT_RADIUS = 10;
    } else if (containerWidth <= 480) {
      // Medium mobile phones
      targetWidth = Math.min(containerWidth - 32, 400);
      targetHeight = Math.min(targetWidth * 0.6, 200);
      ALERT_RADIUS = 12;
    } else if (containerWidth <= 768) {
      // Large mobile phones and small tablets
      targetWidth = Math.min(containerWidth - 40, 600);
      targetHeight = Math.min(targetWidth * 0.65, 300);
      ALERT_RADIUS = 14;
    } else if (containerWidth <= 1024) {
      // Tablets
      targetWidth = Math.min(containerWidth - 60, 700);
      targetHeight = Math.min(targetWidth * 0.7, 350);
      ALERT_RADIUS = 16;
    } else {
      // Desktop
      targetWidth = Math.min(containerWidth - 80, 800);
      targetHeight = Math.min(targetWidth * 0.75, 400);
      ALERT_RADIUS = 18;
    }

    // Ensure minimum viable size with strict limits
    targetWidth = Math.max(Math.min(targetWidth, containerWidth - 16), 200);
    targetHeight = Math.max(Math.min(targetHeight, containerHeight - 16), 100);

    // Set canvas dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Update CSS for responsive display with strict constraints
    canvas.style.width = targetWidth + "px";
    canvas.style.height = targetHeight + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.overflow = "hidden";

    // Redraw if we have areas
    if (areas.length > 0) {
      drawMap();
    }
  }

  // Enhanced resize handling with debouncing
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      drawMap();
    }, 150);
  }

  // Initialize and set up event listeners
  resizeCanvas();
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 500); // Wait for orientation change to complete
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

    // Responsive log message
    const isMobile = window.innerWidth <= 768;
    logDiv.innerHTML = isMobile
      ? "Simulation started...<br>"
      : "Simulation started: Detecting disasters...<br>";

    let count = 0;
    const maxAreas =
      window.innerWidth <= 480 ? 3 : window.innerWidth <= 768 ? 4 : 6; // Fewer areas on mobile
    areasSpan.textContent = "0";
    successSpan.textContent = "0%";

    const r = ALERT_RADIUS;
    const interval =
      window.innerWidth <= 480 ? 1200 : window.innerWidth <= 768 ? 1000 : 800; // Slower on mobile

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

        // Responsive log messages
        const logMessage = isMobile
          ? `${type} Area ${count + 1} (${success}%)<br>`
          : `${type} in Area ${
              count + 1
            } coordinated (Success: ${success}%)<br>`;
        logDiv.innerHTML += logMessage;

        count++;
        areasSpan.textContent = String(count);
        const prev = parseFloat(successSpan.textContent) || 0;
        successSpan.textContent =
          ((prev * (count - 1) + parseFloat(success)) / count).toFixed(1) + "%";
      } else {
        clearInterval(simulationInterval);
        simulationInterval = null;
        logDiv.innerHTML += isMobile
          ? "Complete!<br>"
          : "Simulation complete: Global response optimized!<br>";
        logToAnalytics(areas.length);
      }
    }, interval);
  }

  // Enhanced touch and mouse interactions
  function handleInteraction(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    let hovered = false;

    for (let i = 0; i < areas.length; i++) {
      if (Math.hypot(x - areas[i].x, y - areas[i].y) < ALERT_RADIUS) {
        const tooltip = `${areas[i].type} | Success: ${areas[i].success}%`;
        canvas.title = tooltip;
        hovered = true;
        break;
      }
    }

    if (!hovered) canvas.title = "";
    canvas.style.cursor = hovered ? "pointer" : "default";
  }

  // Mouse events
  canvas.addEventListener("mousemove", handleInteraction);
  canvas.addEventListener("mouseleave", () => {
    canvas.title = "";
    canvas.style.cursor = "default";
  });

  // Touch events for mobile
  canvas.addEventListener("touchstart", handleInteraction, { passive: true });
  canvas.addEventListener("touchmove", handleInteraction, { passive: true });
  canvas.addEventListener("touchend", () => {
    canvas.title = "";
    canvas.style.cursor = "default";
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
          device_type: window.innerWidth <= 768 ? "mobile" : "desktop",
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
