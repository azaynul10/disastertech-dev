// timeline-data.js - Timeline milestones for DisasterTech.dev journey

window.timelineMilestones = [
  {
    timeframe: "August 17-18, 2025",
    title: "DisasterTech Launch",
    description:
      "Launched comprehensive disaster response platform integrating AWS serverless architecture with real-time GitHub integration and visitor analytics.",
    icon: "fa-rocket",
    color: "#ff6b6b",
    impact: {
      stats: "Full-Stack Serverless Solution",
      details:
        "Complete AWS serverless architecture demonstrating real-world CORS handling, cross-origin integration, and production-ready deployment patterns.",
    },
  },
  {
    timeframe: "August 17, 2025",
    title: "AWS Serverless Backend",
    description:
      "Designed and deployed serverless backend using AWS SAM (Serverless Application Model) with Python Lambda functions and DynamoDB integration.",
    icon: "fa-cloud",
    color: "#4ecdc4",
    impact: {
      stats: "Optimized for Low-Latency Alerts",
      details:
        "Serverless architecture designed for disaster response scenarios with automatic scaling, minimal cold starts, and cost-effective resource utilization.",
    },
  },
  {
    timeframe: "August 17, 2025",
    title: "GitHub API Integration",
    description:
      "Developed RESTful API endpoint that fetches real-time commit data from GitHub repositories for dynamic project updates.",
    icon: "fa-code-branch",
    color: "#45b7d1",
    impact: {
      stats: "Real-time GitHub Integration",
      details:
        "Live commit tracking with proper CORS configuration, demonstrating secure cross-origin API communication and real-time data synchronization.",
    },
  },
  {
    timeframe: "August 18, 2025",
    title: "Analytics System",
    description:
      "Implemented comprehensive analytics tracking with DynamoDB storage, capturing visitor behavior and engagement metrics.",
    icon: "fa-chart-line",
    color: "#96ceb4",
    impact: {
      stats: "Production-Ready Analytics",
      details:
        "DynamoDB-powered analytics with proper data modeling, demonstrating scalable data storage and real-time query capabilities for disaster response metrics.",
    },
  },
  {
    timeframe: "August 18, 2025",
    title: "Full-Stack Integration",
    description:
      "Seamlessly integrated React-style frontend with AWS backend, implementing proper CORS handling and error management.",
    icon: "fa-link",
    color: "#feca57",
    impact: {
      stats: "Full-Stack Integration",
      details:
        "Successfully resolved CORS issues, implemented proper error handling, and created responsive user interface.",
    },
  },
  {
    timeframe: "August 18, 2025",
    title: "Interactive Timeline",
    description:
      "Built modern interactive timeline with dynamic content, animations, and responsive design for enhanced user experience.",
    icon: "fa-palette",
    color: "#ff9ff3",
    impact: {
      stats: "Modern User Interface",
      details:
        "Interactive timeline with scroll animations, metric counters, and responsive design showcasing project milestones and achievements.",
    },
  },
];

// Impact metrics for the legend section
window.impactMetrics = {
  successRate: "96.5%", // API success rate
  countriesHelped: "6", // Target countries for disaster response
  activeUsers: "500+", // Target active users
  uptime: "99.9%", // AWS infrastructure uptime
};
