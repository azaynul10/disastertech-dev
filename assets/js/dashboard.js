// AWS Infrastructure Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeDashboard();
  updateLastUpdatedTime();

  // Update dashboard every 5 minutes (for demo purposes)
  setInterval(updateDashboardData, 300000);
});

function initializeDashboard() {
  createCostChart();
  createUtilizationChart();
  createHealthChart();
  animateMetrics();
}

function createCostChart() {
  const ctx = document.getElementById("cost-chart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["S3 Storage", "CloudFront", "Lambda", "DynamoDB", "Free Tier"],
      datasets: [
        {
          data: [0.45, 0.23, 0.12, 0.08, 4.12],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#00cc66",
          ],
          borderColor: "#1a1f2e",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.2,
      resizeDelay: 200,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#fff",
            font: {
              size: 10,
            },
            padding: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": $" + context.parsed.toFixed(2);
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        duration: 2000,
      },
    },
  });
}

function createUtilizationChart() {
  const ctx = document.getElementById("utilization-chart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["S3", "CloudFront", "Lambda", "DynamoDB"],
      datasets: [
        {
          label: "Usage %",
          data: [15, 23, 8, 12],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.2,
      resizeDelay: 200,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: "#fff",
            callback: function (value) {
              return value + "%";
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
    },
  });
}

function createHealthChart() {
  const ctx = document.getElementById("health-chart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "6h ago",
        "5h ago",
        "4h ago",
        "3h ago",
        "2h ago",
        "1h ago",
        "Now",
      ],
      datasets: [
        {
          label: "Response Time (ms)",
          data: [120, 135, 145, 142, 138, 145, 145],
          borderColor: "#00cc66",
          backgroundColor: "rgba(0, 204, 102, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.4,
      resizeDelay: 200,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 100,
          max: 200,
          ticks: {
            color: "#fff",
            callback: function (value) {
              return value + "ms";
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
    },
  });
}

function animateMetrics() {
  // Animate cost values
  animateValue("monthly-cost", 0, 5.0, 2000, "$");
  animateValue("free-tier-usage", 0, 15, 2000, "%");

  // Animate resource values
  setTimeout(() => {
    updateResourceMetrics();
  }, 1000);

  // Animate health metrics
  setTimeout(() => {
    updateHealthMetrics();
  }, 1500);
}

function animateValue(elementId, start, end, duration, suffix = "") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startTime = performance.now();
  const isDecimal = end % 1 !== 0;

  function updateValue(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = start + (end - start) * easeOutQuart(progress);

    if (isDecimal) {
      element.textContent =
        (suffix === "$" ? "$" : "") +
        current.toFixed(2) +
        (suffix !== "$" ? suffix : "");
    } else {
      element.textContent =
        (suffix === "$" ? "$" : "") +
        Math.floor(current) +
        (suffix !== "$" ? suffix : "");
    }

    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  }

  requestAnimationFrame(updateValue);
}

function easeOutQuart(t) {
  return 1 - --t * t * t * t;
}

function updateResourceMetrics() {
  const s3Element = document.getElementById("s3-usage");
  const cloudFrontElement = document.getElementById("cloudfront-usage");
  const lambdaElement = document.getElementById("lambda-usage");

  if (s3Element) s3Element.textContent = "2.3 GB";
  if (cloudFrontElement) cloudFrontElement.textContent = "45 GB";
  if (lambdaElement) lambdaElement.textContent = "1,247";
}

function updateHealthMetrics() {
  const lastDeployment = document.getElementById("last-deployment");
  if (lastDeployment) {
    const now = new Date();
    const deployTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    lastDeployment.textContent = getTimeAgo(deployTime);
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return Math.floor(diffInSeconds / 60) + " minutes ago";
  if (diffInSeconds < 86400)
    return Math.floor(diffInSeconds / 3600) + " hours ago";
  return Math.floor(diffInSeconds / 86400) + " days ago";
}

function updateLastUpdatedTime() {
  const element = document.getElementById("last-updated");
  if (element) {
    element.textContent = new Date().toLocaleTimeString();
  }
}

function updateDashboardData() {
  // Simulate real-time updates
  updateLastUpdatedTime();

  // Add small random variations to metrics
  const variations = {
    "s3-usage": ["2.3 GB", "2.4 GB", "2.2 GB"],
    "cloudfront-usage": ["45 GB", "47 GB", "44 GB"],
    "lambda-usage": ["1,247", "1,251", "1,243"],
  };

  Object.keys(variations).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      const values = variations[id];
      element.textContent = values[Math.floor(Math.random() * values.length)];
    }
  });
}

// Initialize dashboard when About section becomes visible
function initializeDashboardOnScroll() {
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(initializeDashboard, 500);
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(aboutSection);
}

// Call initialization on scroll
document.addEventListener("DOMContentLoaded", initializeDashboardOnScroll);

