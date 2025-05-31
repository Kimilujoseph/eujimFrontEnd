export const generateMockJobSeekerData = () => {
  return {
    profileCompleteness: 85,
    applicationsSent: 12,
    applicatioinsIncrease: 20,
    applicationsViewed: 8,
    interviewsScheduled: 3,
    interviewsIncrease: 50,
    applicationsRejected: 2,
    offersReceived: 1,
    profileViews: 24,
    profileViewsIncrease: 15,
    skills: [
      { name: "JavaScript", level: "Professional", progress: 90 },
      { name: "React", level: "Professional", progress: 85 },
      { name: "Node.js", level: "Intermediate", progress: 70 },
      { name: "UI/UX Design", level: "Intermediate", progress: 65 },
      { name: "Project Management", level: "Beginner", progress: 40 },
    ],
    certifications: [
      {
        name: "Full Stack Developer Certification",
        issuer: "Tech Academy",
        date: "2023-05-15",
      },
      {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2022-11-10",
      },
      {
        name: "Agile Scrum Master",
        issuer: "Scrum Alliance",
        date: "2022-08-22",
      },
    ],
    education: [
      {
        degree: "BSc Computer Science",
        institution: "University of Technology",
        fieldOfStudy: "Software Engineering",
        startYear: 2019,
        endYear: 2023,
      },
      {
        degree: "MSc Artificial Intelligence",
        institution: "Tech Institute",
        fieldOfStudy: "Machine Learning",
        startYear: 2023,
        endYear: null, // Present
      },
    ],
    recentActivities: [
      {
        company: "TechCorp",
        action: "Viewed your profile",
        date: "2 hours ago",
      },
      {
        company: "DevSolutions",
        action: "Invited for interview",
        date: "1 day ago",
      },
      {
        company: "WebCraft",
        action: "Application reviewed",
        date: "3 days ago",
      },
      {
        company: "DataSystems",
        action: "Rejected application",
        date: "5 days ago",
      },
      {
        company: "CloudNine",
        action: "Application submitted",
        date: "1 week ago",
      },
    ],
    recommendedJobs: [
      {
        title: "Frontend Developer",
        company: "Tech Innovations Inc.",
        location: "Remote",
        skills: ["React", "JavaScript", "CSS", "TypeScript"],
      },
      {
        title: "Full Stack Engineer",
        company: "Digital Solutions",
        location: "New York, NY",
        skills: ["Node.js", "React", "MongoDB", "AWS"],
      },
      {
        title: "UI/UX Designer",
        company: "Creative Minds",
        location: "San Francisco, CA",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      },
    ],
  };
};

export const exportToCSV = (data) => {
  // Implementation for CSV export
  console.log("Exporting job seeker data to CSV", data);
  alert("Exporting job seeker data to CSV");
};

export const exportToPDF = (data) => {
  // Implementation for PDF export
  console.log("Exporting job seeker data to PDF", data);
  alert("Exporting job seeker data to PDF");
};
