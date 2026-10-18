export const MOCK_USERS = {
  arnav: {
    id: "arnav",
    name: "Arnav Dutta",
    role: "Student",
    details: "3rd Year, CSE",
    points: 2400,
    avatar: "https://ui-avatars.com/api/?name=Arnav+Dutta&background=7A1A22&color=fff&bold=true",
    badge: "Elite Contributor",
    badgeDesc: "Top contributor on GITA Campus Connect",
    progress: 92
  },
  codingClub: {
    id: "codingClub",
    name: "GITA Developers Guild",
    role: "Official Club",
    details: "Technical Society, GITA",
    points: 5000,
    avatar: "https://ui-avatars.com/api/?name=Developers+Guild&background=1E293B&color=fff&bold=true",
    badge: "Tech Society",
    badgeDesc: "Official Coding Community of GITA",
    progress: 100
  },
  placementCell: {
    id: "placementCell",
    name: "GITA Training & Placement Cell",
    role: "Administration",
    details: "Training & Placement Cell, GITA",
    points: 9999,
    avatar: "https://ui-avatars.com/api/?name=Placement+Cell&background=7A1A22&color=fff&bold=true",
    badge: "Placement Directorate",
    badgeDesc: "Official Placement Portal",
    progress: 100
  }
};

export const INITIAL_NOTICES = [
  {
    id: "n1",
    type: "URGENT",
    title: "Mid-Term Schedule Revised",
    content: "All 3rd-year students please note the revised schedule for Digital Signal Processing. The exam has been moved from Monday morning to Wednesday afternoon (02:00 PM - 05:00 PM). Room assignments remain unchanged. Make sure to bring your college ID and lab records.",
    time: "2h ago",
    color: "#e11d48",
    attachment: "Notice_MidTerm_v2.pdf",
    views: 312
  },
  {
    id: "n2",
    type: "IMPORTANT",
    title: "Hackathon Registration",
    content: "Register your teams for 'CodeQuest 2024' before this Friday. Total prize pool is $5k! The hackathon starts next Saturday and runs for 36 hours. Open to all branches. Mentorship sessions on cloud APIs and devops will be provided.",
    time: "5h ago",
    color: "#d97706",
    attachment: "CodeQuest_Guidelines_2024.docx",
    views: 540
  },
  {
    id: "n3",
    type: "GENERAL",
    title: "New Library Resources",
    content: "IEEE access is now restored for all students via institutional login credentials. Over 500 new e-books and journals on artificial intelligence, robotics, and advanced aerodynamics have been added to the physical library and digital portal.",
    time: "1d ago",
    color: "#475569",
    attachment: "IEEE_Access_FAQ.pdf",
    views: 189
  }
];

export const INITIAL_EVENTS = [
  {
    id: "e1",
    month: "OCT",
    day: "24",
    title: "Annual Sports Meet",
    location: "Main Stadium",
    time: "09:00 AM",
    description: "Annual track & field events, football finals, and prize distribution. Chief guest: Olympian P. T. Usha."
  },
  {
    id: "e2",
    month: "OCT",
    day: "27",
    title: "Tech Talk: AI Trends",
    location: "Seminar Hall 2",
    time: "02:30 PM",
    description: "An expert talk on Generative AI and agentic coding workflows by lead researchers from Google DeepMind."
  },
  {
    id: "e3",
    month: "NOV",
    day: "05",
    title: "Vasant Cultural Auditions",
    location: "Main Auditorium",
    time: "10:00 AM",
    description: "Auditions for music, dance, and dramatics clubs for the upcoming inter-college spring festival."
  }
];

export const INITIAL_POSTS = [
  {
    id: "p1",
    user: {
      id: "codingClub",
      name: "GITA Developers Guild",
      avatar: "https://ui-avatars.com/api/?name=Developers+Guild&background=1E293B&color=fff&bold=true",
      details: "Official Technical Society • GITA",
      role: "club"
    },
    time: "2h ago",
    content: "Registrations are now live for 'CodeQuest 2026' Hackathon! 🚀 Open to all engineering branches (CSE, IT, ECE, EE, ME, Civil). 36 hours of software and IoT development with mentorship from industry alumni. Form your teams in the Communities tab!",
    image: null,
    likes: 142,
    comments: [
      {
        id: "c1_1",
        userName: "Arnav Dutta",
        userAvatar: "https://ui-avatars.com/api/?name=Arnav+Dutta&background=7A1A22&color=fff&bold=true",
        text: "Excited for this! Looking for 2 teammates proficient in React and FastAPI. Connect with me in the CSE community!",
        time: "1h ago"
      }
    ],
    liked: false,
    bookmarked: false,
    tag: "Event"
  },
  {
    id: "p2",
    user: {
      id: "placementCell",
      name: "GITA Training & Placement Cell",
      avatar: "https://ui-avatars.com/api/?name=Placement+Cell&background=7A1A22&color=fff&bold=true",
      details: "Placement Directorate • GITA Autonomous",
      role: "admin"
    },
    time: "5h ago",
    content: "Placement Briefing: Upcoming on-campus recruitment assessments for 3rd and 4th-year students (TCS Digital, HighRadius, Infosys). Ensure your resume and aggregate SGPA/CGPA records are verified in your profile dashboard.",
    image: null,
    likes: 215,
    comments: [],
    liked: false,
    bookmarked: true,
    tag: "Internship"
  },
  {
    id: "p3",
    user: {
      id: "examCell",
      name: "Controller of Examinations",
      avatar: "https://ui-avatars.com/api/?name=Exam+Cell&background=0F172A&color=fff&bold=true",
      details: "Academic Registry • GITA Autonomous",
      role: "admin"
    },
    time: "1d ago",
    content: "Autonomous Mid-Term Examination question paper formats and seating plans are published. Mandatory 75% attendance rule is strictly enforced for admit card eligibility. Track your current attendance in the Resources tab.",
    image: null,
    likes: 189,
    comments: [],
    liked: true,
    bookmarked: false,
    tag: "ExamPrep"
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "GITA-2026-101",
    title: "Unhygienic plate washing in Canteen",
    category: "Canteen",
    urgency: "High",
    date: "2026-06-20",
    status: "Pending", // Pending -> Assigned -> In Progress -> Resolved
    description: "The plates in the main canteen are not being cleaned properly. Grease and food residues are visible on several steel plates during lunch hours.",
    assignedDept: "Canteen Inspection Team",
    lastUpdated: "Complaint registered and queued for verification."
  },
  {
    id: "GITA-2026-102",
    title: "Lab 3 router network package drops",
    category: "IT & Network",
    urgency: "Medium",
    date: "2026-06-18",
    status: "Assigned",
    description: "During practical classes in Lab 3, students are facing continuous packet drops and DNS resolution issues. It slows down cloning Git repositories.",
    assignedDept: "IT Operations Department",
    lastUpdated: "Assigned to Network Specialist Verma on June 20th."
  },
  {
    id: "GITA-2026-103",
    title: "Leaking ceiling in Room 204 Block C",
    category: "Infrastructure",
    urgency: "High",
    date: "2026-06-19",
    status: "In Progress",
    description: "Water is continuously dripping from the center ceiling panel of Room 204 in Block C during rains, making the front bench unusable and risking projector damage.",
    assignedDept: "Estate Maintenance Team",
    lastUpdated: "Scaffolding set up. Seepage repair scheduled for Monday morning."
  },
  {
    id: "GITA-2026-104",
    title: "Broken window latch in Hostel A Room 311",
    category: "Hostel & Facilities",
    urgency: "Low",
    date: "2026-06-16",
    status: "Resolved",
    description: "The window latch in room 311 of Hostel A is broken, causing the window to swing and bang loudly during high winds.",
    assignedDept: "Hostel Warden Office",
    lastUpdated: "Resolved on June 18th. New brass latch installed and tested."
  }
];

export const INITIAL_RESOURCES = [
  {
    id: "res1",
    category: "Academic Link",
    name: "Library Portal",
    url: "https://library.gita.edu",
    description: "Online catalog search, renew books, access online journals and databases."
  },
  {
    id: "res2",
    category: "Student Service",
    name: "My Attendance Tracker",
    description: "Simulate and calculate your class attendance. Make sure you stay above the 75% cutoff!",
    interactive: true,
    type: "attendance"
  },
  {
    id: "res3",
    category: "Academic File",
    name: "End-Semester Syllabus (2024-25)",
    file: "GITA_ECE_CSE_Syllabus_2024.pdf",
    size: "4.2 MB",
    description: "Complete course syllabus, credits details and recommended text references."
  },
  {
    id: "res4",
    category: "Student Service",
    name: "Fee Payment Gateway",
    url: "https://payment.gita.edu",
    description: "Pay tuition, hostel, exam fees online. Secure receipts and check dues."
  },
  {
    id: "res5",
    category: "Academic File",
    name: "Compiler Design PYQs (2021-2023)",
    file: "CompilerDesign_PYQs.zip",
    size: "18.5 MB",
    description: "Previous year question papers with model answers for mid-term and end-term."
  }
];

export const INITIAL_COMMUNITIES = {
  departments: [
    {
      id: "cse",
      name: "Computer Science & Engineering",
      code: "CSE",
      members: 1450,
      recentActivity: "Syllabus updated today",
      description: "Department of Computer Science & Engineering focuses on software engineering, database systems, computer systems, and computational theory.",
      announcements: [
        { id: "cse_a1", title: "Minor Project Submissions", content: "Submit your pre-final project synopsis by this Friday to the departmental portal. Hardcopies are not required.", date: "2026-06-20", author: "HOD CSE" },
        { id: "cse_a2", title: "Guest Lecture: Quantum Computing", content: "Join us for an online webinar by Dr. A. Sen on June 25th at 3 PM. Registration link is on GITA Connect.", date: "2026-06-18", author: "Dept Coordinator" }
      ],
      discussions: [
        { id: "cse_d1", author: "CSE Guild Mentor", content: "Can anyone share resources for learning Operating Systems concepts? Especially CPU scheduling algorithms.", replies: 4, date: "1h ago" },
        { id: "cse_d2", author: "Academic Coordinator", content: "Has anyone started working on the Compiler Design assignment? Struggling with the parser generator part.", replies: 2, date: "3h ago" }
      ],
      events: [
        { id: "cse_e1", title: "WebDev Hackathon 2026", date: "June 28", time: "10:00 AM", location: "Lab 4", desc: "Build a responsive web application in 8 hours. Prizes for best UI and functionality!" }
      ],
      achievements: [
        { id: "cse_ac1", title: "95% Placements in 2025 batch", desc: "Over 400 students placed in top MNCs including Google, Amazon, and TCS from the CSE graduating batch." }
      ]
    },
    {
      id: "csit",
      name: "Computer Science & Information Technology",
      code: "CS & IT",
      members: 920,
      recentActivity: "Lab scheduling announcement",
      description: "Department of Computer Science & IT blends core computational frameworks with database management, web applications, and network infrastructure.",
      announcements: [
        { id: "csit_a1", title: "End-Semester Lab Audits", content: "IT Lab 2 audits start tomorrow. Ensure all project files are checked in and ready.", date: "2026-06-21", author: "Lab In-charge" }
      ],
      discussions: [
        { id: "csit_d1", author: "IT Student Lead", content: "Which DBMS should we use for our project? MongoDB or PostgreSQL?", replies: 6, date: "5h ago" }
      ],
      events: [
        { id: "csit_e1", title: "Database Schema Sprint", date: "July 02", time: "02:00 PM", location: "IT Lab 3", desc: "A practical challenge in normalizing databases and solving queries." }
      ],
      achievements: [
        { id: "csit_ac1", title: "Smart India Hackathon Finalists", desc: "Two student groups advanced to the national finals in smart city solutions." }
      ]
    },
    {
      id: "aiml",
      name: "Artificial Intelligence & Machine Learning",
      code: "AI & ML",
      members: 680,
      recentActivity: "Model training GPU guidelines",
      description: "Department of AI & ML focuses on deep learning, neural networks, computer vision, data analytics, and generative intelligence.",
      announcements: [
        { id: "aiml_a1", title: "AI GPU Server Access Credentials", content: "Register teams for model training on the departmental H100 cluster. Access tokens will be shared via email.", date: "2026-06-19", author: "AI Lab Head" }
      ],
      discussions: [
        { id: "aiml_d1", author: "AI Research Mentor", content: "Fine-tuning llama models on 16GB RAM is failing. Any optimization tips like LoRA configurations?", replies: 8, date: "30m ago" }
      ],
      events: [
        { id: "aiml_e1", title: "Kaggle Prediction League", date: "July 05", time: "09:00 AM", location: "AI Seminar Hall", desc: "Compete to build the most accurate predictive model using our dataset." }
      ],
      achievements: [
        { id: "aiml_ac1", title: "ICML Paper Acceptance", desc: "A joint research project by 4th-year students was accepted at ICML workshop." }
      ]
    },
    {
      id: "mca",
      name: "Computer Applications (MCA)",
      code: "Computer Applications (MCA)",
      members: 450,
      recentActivity: "Android workshop registration",
      description: "Master of Computer Applications department emphasizes core software development methodologies, systems management, and application suites.",
      announcements: [
        { id: "mca_a1", title: "MCA Placement Drive Pre-evaluation", content: "Pre-assessment test for upcoming tech placement drive will happen on Saturday at 10 AM.", date: "2026-06-20", author: "Placement Cell" }
      ],
      discussions: [
        { id: "mca_d1", author: "Mobile Dev Coordinator", content: "Who has the Android Studio setup file for the lab? Need it for homework.", replies: 3, date: "4h ago" }
      ],
      events: [
        { id: "mca_e1", title: "Android App Design Workshop", date: "June 30", time: "11:00 AM", location: "Lab 1", desc: "Hands-on experience building mobile apps from scratch using Kotlin." }
      ],
      achievements: [
        { id: "mca_ac1", title: "GITA Startup Grant Winner", desc: "An app built by MCA students for local transport logistics secured a college seed funding grant." }
      ]
    },
    {
      id: "mba",
      name: "Business Administration (MBA)",
      code: "MBA",
      members: 380,
      recentActivity: "Business Case study schedule",
      description: "Department of MBA builds leadership competency, marketing strategies, corporate finance management, and entrepreneurial vision.",
      announcements: [
        { id: "mba_a1", title: "Case Study Challenge Guidelines", content: "Case studies on logistics strategy have been published. Group assignments are posted in the HOD portal.", date: "2026-06-21", author: "Prof. Das" }
      ],
      discussions: [
        { id: "mba_d1", author: "Entrepreneurship Mentor", content: "Struggling with marketing strategy analysis for the startup case. Any advice?", replies: 2, date: "6h ago" }
      ],
      events: [
        { id: "mba_e1", title: "Mock Pitch and Venture Capital Meet", date: "July 08", time: "10:00 AM", location: "MBA Auditorium", desc: "Pitch your business model to mock investors and receive feedback." }
      ],
      achievements: [
        { id: "mba_ac1", title: "B-Plan National Competition Runner-up", desc: "GITA MBA team won 2nd prize at the national level B-Plan competition in IIT Kharagpur." }
      ]
    },
    {
      id: "ee",
      name: "Electrical Engineering",
      code: "EE",
      members: 510,
      recentActivity: "Control Systems Lab schedule",
      description: "Department of Electrical Engineering studies power systems, circuit theory, control instrumentation, and electric machinery.",
      announcements: [
        { id: "ee_a1", title: "Electrical Lab Safety Guidelines", content: "Please read safety rules before using high voltage machines. Closed shoes are mandatory.", date: "2026-06-19", author: "Lab Superintendent" }
      ],
      discussions: [
        { id: "ee_d1", author: "EE Technical Representative", content: "Can someone help explain the transient response of second-order RL circuits?", replies: 1, date: "1d ago" }
      ],
      events: [
        { id: "ee_e1", title: "Simulink Power Grid Challenge", date: "July 01", time: "02:30 PM", location: "Simulation Lab", desc: "Model a resilient power grid and evaluate stability against simulated load drops." }
      ],
      achievements: [
        { id: "ee_ac1", title: "Best Green Energy Project Award", desc: "GITA solar tracking project by EE seniors won the state-level innovation award." }
      ]
    },
    {
      id: "eee",
      name: "Electrical & Electronics Engineering",
      code: "EEE",
      members: 490,
      recentActivity: "Embedded Systems lab updates",
      description: "Department of EEE bridges power grids and electrical systems with digital electronics, VLSI design, and microprocessors.",
      announcements: [
        { id: "eee_a1", title: "VLSI Kits Collection", content: "Students can collect their custom VLSI hardware design kits from Lab 5 starting tomorrow.", date: "2026-06-20", author: "VLSI Coordinator" }
      ],
      discussions: [
        { id: "eee_d1", author: "VLSI Society Lead", content: "Stuck in writing assembly code for 8086 interrupt vectoring. Anyone free to help?", replies: 5, date: "2h ago" }
      ],
      events: [
        { id: "eee_e1", title: "Arduino & IoT Boot Camp", date: "June 27", time: "09:30 AM", location: "IoT Lab", desc: "Build home automation sensors and configure them to send telemetry data to a cloud dashboard." }
      ],
      achievements: [
        { id: "eee_ac1", title: "Patent Filed for Smart Meter", desc: "A patented high-accuracy energy audit smart meter developed by students and faculty." }
      ]
    },
    {
      id: "mech",
      name: "Mechanical Engineering",
      code: "Mechanical Engineering",
      members: 580,
      recentActivity: "CAD modeling competition list",
      description: "Department of Mechanical Engineering covers thermodynamics, structural mechanics, fluid dynamics, CAD, and automated manufacturing.",
      announcements: [
        { id: "mech_a1", title: "CAD Modeling Challenge", content: "Submit your SolidWorks designs for the drone chassis by Monday. Files must be in STL format.", date: "2026-06-18", author: "Dr. Tripathy" }
      ],
      discussions: [
        { id: "mech_d1", author: "SAE Racing Lead", content: "Which simulation parameters are best for aerodynamics drag evaluation in ANSYS?", replies: 3, date: "1d ago" }
      ],
      events: [
        { id: "mech_e1", title: "Formula Student Design Review", date: "July 04", time: "11:00 AM", location: "Automobile Lab", desc: "Review of GITA racing car design, structural testing, and aero dynamics specs." }
      ],
      achievements: [
        { id: "mech_ac1", title: "Off-Road buggy 3rd in National SAE", desc: "The college buggy team placed 3rd nationally in performance and endurance." }
      ]
    },
    {
      id: "civil",
      name: "Civil Engineering",
      code: "Civil Engineering",
      members: 420,
      recentActivity: "Structural model showcase",
      description: "Department of Civil Engineering covers structural analysis, soil mechanics, concrete technology, transportation, and green infrastructure.",
      announcements: [
        { id: "civil_a1", title: "Surveying Field Work", content: "Attendance is compulsory for tomorrow's structural leveling field work at the outer campus.", date: "2026-06-21", author: "Field Coordinator" }
      ],
      discussions: [
        { id: "civil_d1", author: "Civil Projects Mentor", content: "What is the concrete strength testing ratio standard we should follow for our lab report?", replies: 2, date: "4h ago" }
      ],
      events: [
        { id: "civil_e1", title: "Bridge Design Competition", date: "June 29", time: "01:00 PM", location: "Civil Drafting Hall", desc: "Design a bridge model using balsa wood. Models will be load-tested to structural collapse." }
      ],
      achievements: [
        { id: "civil_ac1", title: "Green Campus Infrastructure Grant", desc: "The civil engineering survey team secured an infrastructure grant for rainwater harvesting." }
      ]
    }
  ],
  clubs: [
    {
      id: "language",
      name: "Language Club",
      members: 310,
      recentActivity: "Debate workshop schedule",
      description: "Language Club encourages public speaking, creative writing, literary debates, poetry, and linguistic skills across campuses.",
      announcements: [
        { id: "lang_a1", title: "Annual Debate Registrations", content: "Registrations are open for GITA Verbal Duel 2026. Topics include AI Ethics and Global Economics.", date: "2026-06-20", author: "Club President" }
      ],
      discussions: [
        { id: "lang_d1", author: "Debate Society Lead", content: "Are there any writing workshops scheduled for this month? I want to practice essay writing.", replies: 2, date: "1d ago" }
      ],
      events: [
        { id: "lang_e1", title: "Inter-college English Debate", date: "July 03", time: "10:00 AM", location: "Seminar Hall 1", desc: "A debating competition involving top colleges in the state." }
      ],
      achievements: [
        { id: "lang_ac1", title: "First Prize in State Youth Parliament", desc: "Language club delegates won the Best Parliamentarian trophy at the state youth meet." }
      ]
    },
    {
      id: "dance",
      name: "Dance Club",
      members: 280,
      recentActivity: "Auditions for Vasant Fest",
      description: "Dance Club celebrates rhythm, choreography, contemporary, classical, folk, and street dance styles across campus events.",
      announcements: [
        { id: "dance_a1", title: "Vasant Fest Dance Auditions", content: "Group and solo auditions will take place this Thursday at the central amphitheater.", date: "2026-06-21", author: "Dance Secretary" }
      ],
      discussions: [
        { id: "dance_d1", author: "Choreography Coordinator", content: "Should we prepare a hip-hop routine or classical fusion for the upcoming cultural fest?", replies: 7, date: "4h ago" }
      ],
      events: [
        { id: "dance_e1", title: "Street Dance Face-off", date: "June 28", time: "05:00 PM", location: "Open Air Theater", desc: "An open street dance battle with energetic musical beats." }
      ],
      achievements: [
        { id: "dance_ac1", title: "Gold Medal at Zonal CultFest", desc: "GITA dance team won gold in the group choreo category at the Zonal Fest." }
      ]
    },
    {
      id: "music",
      name: "Music Club",
      members: 340,
      recentActivity: "Acoustic jam registrations",
      description: "Music Club provides a space for guitarists, singers, drummers, and violinists to jam, perform, and create melodies.",
      announcements: [
        { id: "music_a1", title: "Acoustic Jam Night", content: "Sign up if you want to perform solo or in a duet. Instruments will be provided.", date: "2026-06-20", author: "Music Coordinator" }
      ],
      discussions: [
        { id: "music_d1", author: "Music Club Secretary", content: "Looking for a bassist for our college rock band. Let me know if anyone is interested!", replies: 4, date: "3h ago" }
      ],
      events: [
        { id: "music_e1", title: "Symphony Jam Sessions", date: "July 01", time: "04:30 PM", location: "Music Room", desc: "A casual jamming session open for all vocalists and instrument players." }
      ],
      achievements: [
        { id: "music_ac1", title: "Best College Band Award", desc: "Our band 'The GITA Rhythm' secured 1st prize at the inter-university band clash." }
      ]
    },
    {
      id: "drama",
      name: "Drama Club",
      members: 240,
      recentActivity: "Nukkad Natak script reading",
      description: "Drama Club focuses on theater, script writing, street plays (Nukkad Natak), stage plays, monologue performances, and acting workshops.",
      announcements: [
        { id: "drama_a1", title: "Nukkad Natak Script Auditions", content: "Script readings for our next social awareness play will happen this evening at the old lawns.", date: "2026-06-21", author: "Drama Director" }
      ],
      discussions: [
        { id: "drama_d1", author: "Theater Director", content: "Who has experience with stage lighting? We need a lighting designer for the play.", replies: 1, date: "2d ago" }
      ],
      events: [
        { id: "drama_e1", title: "Stage Play: The Silent Voice", date: "July 06", time: "06:30 PM", location: "Main Auditorium", desc: "A dramatic presentation focusing on environmental degradation and climate action." }
      ],
      achievements: [
        { id: "drama_ac1", title: "Best Direction Award at State Dramatics", desc: "Our street play won the Best Social Message and Best Direction award." }
      ]
    },
    {
      id: "sports",
      name: "Sports Club",
      members: 550,
      recentActivity: "Football tournament brackets",
      description: "Sports Club manages campus tournaments, coaching, athletic schedules, and university sports representation.",
      announcements: [
        { id: "sports_a1", title: "Annual Football Tournament Draw", content: "Team list and match brackets have been drawn. Check the sports board near the stadium.", date: "2026-06-20", author: "Sports Secretary" }
      ],
      discussions: [
        { id: "sports_d1", author: "Sports Secretary", content: "Is the basketball court open tonight for practice? The finals are this week.", replies: 4, date: "1h ago" }
      ],
      events: [
        { id: "sports_e1", title: "Annual Sports Meet Finals", date: "June 24", time: "09:00 AM", location: "Stadium", desc: "Track events, 100m sprint, football finals, and cup presentation." }
      ],
      achievements: [
        { id: "sports_ac1", title: "Basketball Zonal Gold Winners", desc: "GITA basketball varsity team beat the state champions to win the zonal gold." }
      ]
    },
    {
      id: "coding",
      name: "Coding Club",
      members: 850,
      recentActivity: "Upcoming Club",
      description: "Focuses on competitive programming, data structures, open-source projects, and technical coding workshops.",
      isUpcoming: true,
      announcements: [], discussions: [], events: [], achievements: []
    },
    {
      id: "robotics",
      name: "Robotics Club",
      members: 410,
      recentActivity: "Upcoming Club",
      description: "Studies micro-controllers, IoT sensors, drone engineering, structural design, and machine automation.",
      isUpcoming: true,
      announcements: [], discussions: [], events: [], achievements: []
    },
    {
      id: "photography",
      name: "Photography Club",
      members: 330,
      recentActivity: "Upcoming Club",
      description: "Focuses on shutter mechanics, lightning, editing tools, digital art, videography, and visual storytelling.",
      isUpcoming: true,
      announcements: [], discussions: [], events: [], achievements: []
    },
    {
      id: "entrepreneurship",
      name: "Entrepreneurship Club",
      members: 290,
      recentActivity: "Upcoming Club",
      description: "Fosters ideas validation, venture design, pitch presentation, business plans, and connection to seed funds.",
      isUpcoming: true,
      announcements: [], discussions: [], events: [], achievements: []
    }
  ]
};

export const INITIAL_ANONYMOUS_COMPLAINTS = [
  {
    id: "ANON-001",
    title: "Canteen food quality has deteriorated",
    category: "Canteen",
    description: "The quality of lunch served has fallen significantly over the past two weeks. Servings are also cold.",
    status: "In Review", // Submitted -> In Review -> Action Taken
    upvotes: 42,
    department: "Canteen Management",
    date: "2026-06-18"
  },
  {
    id: "ANON-002",
    title: "Transport bus delayed constantly on Route 4",
    category: "Transportation",
    description: "Bus number 12 on Route 4 is consistently 15-20 minutes late, causing students to miss the first lecture.",
    status: "Action Taken",
    upvotes: 18,
    department: "Transport Division",
    date: "2026-06-15"
  },
  {
    id: "ANON-003",
    title: "Water dispenser not cooling in block A",
    category: "Infrastructure",
    description: "The water dispenser on the second floor of Block A is dispensing warm water. Needs filter change and coolant repair.",
    status: "Submitted",
    upvotes: 29,
    department: "Facilities and Maintenance Office",
    date: "2026-06-19"
  }
];

export const INITIAL_COMMITTEE_DECISIONS = [
  {
    id: "DEC-001",
    title: "Reduce tuition fees by 90%",
    category: "Administration",
    date: "2026-06-10",
    decision: "Not Feasible",
    justification: "A 90% tuition fee reduction is not feasible as tuition fees cover essential operational expenses, including faculty salaries, research laboratory licensing, digital IEEE access subscriptions, and campus infrastructure maintenance. We offer tailored scholarship programs for students facing financial hardships."
  },
  {
    id: "DEC-002",
    title: "Convert library into gaming lounge",
    category: "Library",
    date: "2026-06-05",
    decision: "Not Feasible",
    justification: "The central library is designated as an academic zone for quiet study, reference research, and digital learning. Converting it into a gaming lounge violates GITA's academic charter. The student recreation center in Block D remains fully open with gaming consoles and indoor sports."
  },
  {
    id: "DEC-003",
    title: "Remove attendance requirements",
    category: "Academic",
    date: "2026-05-28",
    decision: "Not Feasible",
    justification: "GITA is an autonomous college affiliated with BPUT and follows university regulations. The 75% attendance rule is mandatory under academic guidelines to ensure student participation in labs, evaluations, and interactive classroom learning. Medical exemptions can be claimed via appropriate certificates."
  }
];

export const INITIAL_RESOLVED_COMPLAINTS = [
  {
    id: "RES-101",
    title: "WiFi router offline in Hostel Block B",
    category: "IT & Network",
    date: "2026-06-18",
    resolutionDate: "2026-06-19",
    beforeNotes: "WiFi router on the 2nd floor offline for 3 days; students unable to submit assignments.",
    afterNotes: "Replaced faulty Cisco router hardware, upgraded to 1 Gbps fiber optic drop.",
    summary: "IT Support Cell resolved the issue by upgrading the hardware and verifying stable internet coverage on the entire floor.",
    resolutionTime: "24 hours",
    department: "IT Support Cell"
  },
  {
    id: "RES-102",
    title: "Water cooler leaking in Block A",
    category: "Infrastructure",
    date: "2026-06-14",
    resolutionDate: "2026-06-15",
    beforeNotes: "Severe water leakage on the ground floor of Block A, creating a slipping hazard.",
    afterNotes: "Replaced drainage pipes, repaired faucet valves, and dried the surrounding floor area.",
    summary: "Maintenance team resolved the leak and set up slip-resistant floor mats.",
    resolutionTime: "12 hours",
    department: "Facilities and Maintenance"
  }
];

export const FREQUENTLY_REPORTED_ISSUES = [
  { id: "FREQ-001", title: "WiFi issue in Block B", category: "IT & Network", count: 24 },
  { id: "FREQ-002", title: "Water cooler malfunction", category: "Infrastructure", count: 12 },
  { id: "FREQ-003", title: "Classroom projector issue", category: "IT & Network", count: 8 }
];


