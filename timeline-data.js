// timeline-data.js - Timeline milestones for DisasterTech.dev journey

window.timelineMilestones = [
  {
    timeframe: "Day 1 - August 20, 2025",
    title: "AWS Account Setup & Security",
    description:
      "Set up AWS account with proper security practices: enabled MFA, created admin user, and configured budget alerts for cost control.",
    icon: "fa-shield-alt",
    color: "#ff6b6b",
    impact: {
      stats: "Security-First Approach",
      details:
        "Established secure foundation with multi-factor authentication, IAM best practices, and proactive cost monitoring for disaster response infrastructure.",
    },
  },
  {
    timeframe: "Day 2 - August 21, 2025",
    title: "S3 Cloud Storage Setup",
    description:
      "Created secure cloud storage with S3 buckets, learned security best practices, and uploaded initial project files to the cloud.",
    icon: "fa-database",
    color: "#4ecdc4",
    impact: {
      stats: "Secure Cloud Storage",
      details:
        "Implemented private S3 buckets with proper access controls, demonstrating secure file storage for disaster response documentation and resources.",
    },
  },
  {
    timeframe: "Day 3 - August 22, 2025",
    title: "Website Development",
    description:
      "Built comprehensive website with HTML, CSS, and JavaScript. Added personal branding, disaster response simulator, and interactive timeline.",
    icon: "fa-code",
    color: "#45b7d1",
    impact: {
      stats: "Interactive Disaster Platform",
      details:
        "Developed responsive website with disaster simulation tools, real-time analytics, and modern UI/UX for emergency response coordination.",
    },
  },
  {
    timeframe: "Day 4 - August 23, 2025",
    title: "CloudFront CDN Deployment",
    description:
      "Deployed website globally using CloudFront CDN for fast loading worldwide while maintaining S3 bucket security.",
    icon: "fa-globe",
    color: "#96ceb4",
    impact: {
      stats: "Global Accessibility",
      details:
        "Achieved worldwide reach with CloudFront CDN, ensuring fast disaster response platform access across all regions and devices.",
    },
  },
  {
    timeframe: "Day 5 - August 24, 2025",
    title: "Git & GitHub Integration",
    description:
      "Implemented modern development workflow with Git version control and GitHub integration for collaborative disaster response development.",
    icon: "fa-github",
    color: "#feca57",
    impact: {
      stats: "Version Control & Collaboration",
      details:
        "Established professional development pipeline with Git, enabling team collaboration and automated deployment for disaster response tools.",
    },
  },
  {
    timeframe: "Day 6 - August 25, 2025",
    title: "Serverless Contact System",
    description:
      "Built serverless contact form with AWS Lambda and SNS for real-time notifications and emergency communication.",
    icon: "fa-envelope",
    color: "#ff9ff3",
    impact: {
      stats: "Serverless Communication",
      details:
        "Implemented cost-effective serverless architecture for emergency communications with automatic scaling and real-time notifications.",
    },
  },
  {
    timeframe: "Day 7 - August 26, 2025",
    title: "AWS Builder Challenge Completion",
    description:
      "Completed AWS Builder Challenge #2! Built a live disaster response platform that demonstrates cloud architecture, security, and real-world application.",
    icon: "fa-trophy",
    color: "#ffd700",
    impact: {
      stats: "Challenge Success",
      details:
        "Successfully completed the AWS Builder Challenge with a production-ready disaster response platform showcasing modern cloud development practices.",
    },
  },
];

// Impact metrics for the legend section
window.impactMetrics = {
  successRate: "100%", // Challenge completion rate
  daysCompleted: "7", // Days of AWS Builder Challenge
  servicesUsed: "6+", // AWS services utilized
  uptime: "99.9%", // AWS infrastructure uptime
};
