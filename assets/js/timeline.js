// assets/js/timeline.js - Interactive features for DisasterTech.dev timeline

// Access timeline data from global scope (will be set by timeline-data.js)
const timelineMilestones = window.timelineMilestones || [];

document.addEventListener("DOMContentLoaded", () => {
  const timelineItemsContainer = document.getElementById("timeline-items");
  if (!timelineItemsContainer) {
    console.error("Timeline items container not found!");
    return;
  }

  // Dynamically generate timeline items from data
  timelineMilestones.forEach((milestone, index) => {
    const item = document.createElement("div");
    item.classList.add("timeline-item");
    item.style.setProperty("--order", index); // For staggered animation delay
    item.style.setProperty("--item-color", milestone.color); // Custom color var

    item.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-icon"><i class="fas ${milestone.icon}"></i></div>
          <div class="timeline-date">${milestone.timeframe}</div>
          <h4 class="timeline-title">${milestone.title}</h4>
          <p class="timeline-description">${milestone.description}</p>
          <div class="impact-details" style="display: none;">
            <p><strong>Impact Stats:</strong> ${milestone.impact.stats}</p>
            <p>${milestone.impact.details}</p>
            <div class="progress-container">
              <div class="progress-bar" style="width: 0%; background: ${milestone.color};" data-width="96.5%">96.5%</div>
            </div>
          </div>
        </div>
      `;

    // Add hover/click interaction to reveal details
    const content = item.querySelector(".timeline-content");
    const details = item.querySelector(".impact-details");
    content.addEventListener("click", () => {
      const isHidden = details.style.display === "none";
      details.style.display = isHidden ? "block" : "none";
      details.style.opacity = isHidden ? "1" : "0";

      // Animate progress bar when details are shown
      if (isHidden) {
        const progressBar = details.querySelector(".progress-bar");
        if (progressBar) {
          setTimeout(() => {
            const targetWidth = progressBar.getAttribute("data-width");
            progressBar.style.width = targetWidth;
          }, 100);
        }
      }
    });

    timelineItemsContainer.appendChild(item);
  });

  // Scroll animation observer (fade-in on view)
  const observerOptions = {
    root: null,
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: "0px",
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target); // One-time animation
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".timeline-item")
    .forEach((item) => observer.observe(item));

  // Animate metric counters on view
  const metricNumbers = document.querySelectorAll(".metric-number");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  metricNumbers.forEach((num) => countObserver.observe(num));

  function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    let current = 0;
    const increment = target > 10 ? target / 50 : target / 20; // Adjust speed
    const isDecimal = target % 1 !== 0;

    function update() {
      current += increment;
      if (current >= target) {
        element.textContent = isDecimal ? target.toFixed(1) : target;
        return;
      }
      element.textContent = isDecimal
        ? current.toFixed(1)
        : Math.floor(current);
      requestAnimationFrame(update);
    }
    update();
  }

  // Smooth scroll to timeline on load or nav click (optional enhancement)
  const workSection = document.getElementById("work");
  if (workSection) {
    workSection.scrollIntoView({ behavior: "smooth" }); // Example: Auto-scroll to timeline
  }

  // Error handling: Log if data import fails
  if (timelineMilestones.length === 0) {
    console.warn("No timeline data loaded—check timeline-data.js");
  }

  // Step 5: Integrate GitHub Activity - Fetch commits from Day 2 backend and add as dynamic milestone
  async function addGitHubUpdates() {
    try {
      const API_BASE =
        "https://9l5b7yhwsk.execute-api.us-east-1.amazonaws.com/Prod";
      const response = await fetch(`${API_BASE}/github`);
      if (!response.ok) throw new Error("GitHub fetch failed");
      const data = await response.json();
      const commits = data.commits.slice(0, 3); // Take top 3 recent commits

      const githubMilestone = {
        id: timelineMilestones.length + 1,
        timeframe: "Recent",
        title: "Latest GitHub Updates",
        description: "Real-time project activity from repository commits.",
        impact: {
          stats: `${commits.length} recent changes`,
          details: commits.map((commit) => `- ${commit}`).join("<br>"),
        },
        icon: "fa-github",
        color: "#00cc66",
      };

      // Generate and append the new item
      const item = document.createElement("div");
      item.classList.add("timeline-item");
      item.style.setProperty("--order", githubMilestone.id);
      item.style.setProperty("--item-color", githubMilestone.color);

      item.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-icon"><i class="fab ${githubMilestone.icon}"></i></div>
          <div class="timeline-date">${githubMilestone.timeframe}</div>
          <h4 class="timeline-title">${githubMilestone.title}</h4>
          <p class="timeline-description">${githubMilestone.description}</p>
          <div class="impact-details" style="display: none;">
            <p><strong>Impact Stats:</strong> ${githubMilestone.impact.stats}</p>
            <p>${githubMilestone.impact.details}</p>
            <div class="progress-container">
              <div class="progress-bar" style="width: 0%; background: ${githubMilestone.color};" data-width="100%">100%</div>
            </div>
          </div>
        </div>
      `;

      // Add click to reveal
      const content = item.querySelector(".timeline-content");
      const details = item.querySelector(".impact-details");
      content.addEventListener("click", () => {
        const isHidden = details.style.display === "none";
        details.style.display = isHidden ? "block" : "none";
        details.style.opacity = isHidden ? "1" : "0";

        // Animate progress bar when details are shown
        if (isHidden) {
          const progressBar = details.querySelector(".progress-bar");
          if (progressBar) {
            setTimeout(() => {
              const targetWidth = progressBar.getAttribute("data-width");
              progressBar.style.width = targetWidth;
            }, 100);
          }
        }
      });

      timelineItemsContainer.appendChild(item);
      observer.observe(item); // Animate on scroll
    } catch (error) {
      console.error("GitHub integration error:", error);
    }
  }

  // Call the function after generating static items
  addGitHubUpdates();
});
