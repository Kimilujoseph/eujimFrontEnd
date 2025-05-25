// Job seeker statistics
export const mockJobSeekerStats = {
  registered: "1,245",
  employers: "892",
  applications: "1,032",
  profileCompletion: "93%",
};

// Job postings data for line chart - updated to show only job-related data
export const mockJobPostingsData = [
  {
    id: "Tech Jobs",
    color: "hsl(210, 70%, 50%)",
    data: [
      { x: "Jan", y: 120 },
      { x: "Feb", y: 145 },
      { x: "Mar", y: 168 },
      { x: "Apr", y: 192 },
      { x: "May", y: 210 },
      { x: "Jun", y: 235 },
    ],
  },
  {
    id: "Healthcare Jobs",
    color: "hsl(120, 70%, 50%)",
    data: [
      { x: "Jan", y: 85 },
      { x: "Feb", y: 92 },
      { x: "Mar", y: 108 },
      { x: "Apr", y: 124 },
      { x: "May", y: 142 },
      { x: "Jun", y: 158 },
    ],
  },
  {
    id: "Finance Jobs",
    color: "hsl(30, 70%, 50%)",
    data: [
      { x: "Jan", y: 65 },
      { x: "Feb", y: 78 },
      { x: "Mar", y: 82 },
      { x: "Apr", y: 95 },
      { x: "May", y: 110 },
      { x: "Jun", y: 125 },
    ],
  },
];

// Recent recruiter activity
export const mockRecruiterActivity = [
  {
    id: 1,
    recruiter: "TechCorp Inc.",
    action: "Posted 3 new jobs",
    date: "2023-06-15",
    industry: "Technology",
  },
  {
    id: 2,
    recruiter: "HealthPlus",
    action: "Viewed 12 profiles",
    date: "2023-06-14",
    industry: "Healthcare",
  },
  {
    id: 3,
    recruiter: "FinanceGlobal",
    action: "Posted Senior Analyst",
    date: "2023-06-14",
    industry: "Finance",
  },
  {
    id: 4,
    recruiter: "EduFuture",
    action: "Contacted 5 candidates",
    date: "2023-06-13",
    industry: "Education",
  },
  {
    id: 5,
    recruiter: "ShopMall",
    action: "Updated company profile",
    date: "2023-06-12",
    industry: "Retail",
  },
  {
    id: 6,
    recruiter: "DataSystems",
    action: "Posted Data Engineer",
    date: "2023-06-12",
    industry: "Technology",
  },
  {
    id: 7,
    recruiter: "MediCare Group",
    action: "Viewed Nurse profiles",
    date: "2023-06-11",
    industry: "Healthcare",
  },
];

// Certification data for bar chart - updated with professional certifications
export const mockCertificationData = [
  {
    certification: "AWS Certified",
    count: 187,
    color: "hsl(30, 70%, 50%)",
  },
  {
    certification: "PMP",
    count: 132,
    color: "hsl(60, 70%, 50%)",
  },
  {
    certification: "Google Cloud",
    count: 98,
    color: "hsl(90, 70%, 50%)",
  },
  {
    certification: "Microsoft Certified",
    count: 87,
    color: "hsl(120, 70%, 50%)",
  },
  {
    certification: "Cisco Certified",
    count: 76,
    color: "hsl(150, 70%, 50%)",
  },
  {
    certification: "Salesforce Certified",
    count: 65,
    color: "hsl(180, 70%, 50%)",
  },
  {
    certification: "CompTIA",
    count: 58,
    color: "hsl(210, 70%, 50%)",
  },
  {
    certification: "Oracle Certified",
    count: 42,
    color: "hsl(240, 70%, 50%)",
  },
];

// Employer admission stats
export const mockAdmissionStats = {
  approved: 748,
  total: 892,
  approvalRate: 84,
};
