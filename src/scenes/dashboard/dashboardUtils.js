// Mock data generator
export const generateMockData = () => {
  // Base counts
  const totalJobSeekers = Math.floor(Math.random() * 2000) + 1000;
  const activeEmployers = Math.floor(totalJobSeekers * 0.7);
  const totalInterviews = Math.floor(totalJobSeekers * 0.8);

  // Hiring funnel
  const hiringFunnel = {
    shortlisted: Math.floor(totalJobSeekers * 0.35),
    interviewed: Math.floor(totalJobSeekers * 0.25),
    hired: Math.floor(totalJobSeekers * 0.08),
    rejected: Math.floor(totalJobSeekers * 0.12),
  };

  // Certifications
  const certifications = [
    "AWS Certified",
    "PMP",
    "Google Cloud",
    "Microsoft Certified",
    "Cisco Certified",
    "Salesforce",
    "Oracle Certified",
    "CompTIA",
  ];
  const topCertifications = certifications
    .map((cert) => ({
      certification: cert,
      count: Math.floor(Math.random() * 200) + 50,
    }))
    .sort((a, b) => b.count - a.count);

  // Recent activities
  const companies = [
    "TechCorp",
    "HealthPlus",
    "FinanceGlobal",
    "EduFuture",
    "ShopMall",
  ];
  const actions = ["Interviewed", "Shortlisted", "Hired", "Rejected"];
  const recentActivities = Array(5)
    .fill()
    .map((_, i) => ({
      company: companies[i % companies.length],
      action: actions[i % actions.length],
      candidate: `Candidate ${Math.floor(Math.random() * 1000)}`,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }));

  // Alerts
  const alerts = {
    pendingVerifications: Math.floor(Math.random() * 30) + 5,
    incompleteProfiles: Math.floor(totalJobSeekers * 0.15),
    suspendedAccounts: Math.floor(Math.random() * 10) + 1,
  };

  return {
    totalJobSeekers,
    activeEmployers,
    totalInterviews,
    profileCompleteness: Math.floor(Math.random() * 20) + 80, // 80-100%
    hiringFunnel,
    topCertifications,
    recentActivities,
    alerts,
  };
};

// Export functions
export const exportToCSV = (data) => {
  // Candidate Skill Inventory
  const certCSV = [
    "Certification,Count",
    ...data.topCertifications.map((c) => `"${c.certification}",${c.count}`),
  ].join("\n");

  // Employer Activity Log
  const activityCSV = [
    "Company,Action,Candidate,Date",
    ...data.recentActivities.map(
      (a) => `"${a.company}","${a.action}","${a.candidate}",${a.date}`
    ),
  ].join("\n");

  // Recruitment Pipeline
  const funnelCSV = [
    "Stage,Count",
    `Shortlisted,${data.hiringFunnel.shortlisted}`,
    `Interviewed,${data.hiringFunnel.interviewed}`,
    `Hired,${data.hiringFunnel.hired}`,
    `Rejected,${data.hiringFunnel.rejected}`,
  ].join("\n");

  // Create download links
  const download = (content, fileName) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  download(certCSV, "candidate_certifications.csv");
  download(activityCSV, "employer_activities.csv");
  download(funnelCSV, "recruitment_funnel.csv");

  console.log("CSV exports generated");
};

export const exportToPDF = (data) => {
  // In a real implementation, you would use a library like jsPDF
  console.log("PDF export would include:", {
    summary: {
      totalGraduates: data.totalJobSeekers,
      activeEmployers: data.activeEmployers,
      hireRate:
        ((data.hiringFunnel.hired / data.totalJobSeekers) * 100).toFixed(1) +
        "%",
    },
    topCertifications: data.topCertifications.slice(0, 5),
    recentHires: data.recentActivities.filter((a) => a.action === "Hired"),
  });

  alert("PDF generation would be implemented with a library like jsPDF");
};
