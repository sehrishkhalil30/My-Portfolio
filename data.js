/* ===== YAHAN SE APNA CONTENT BADLEIN. Baqi files ko chherne ki zaroorat nahi. ===== */
window.DATA = {
  name: "Sehrish Khalil",
  photo: "photo.png",            /* apni photo ka naam. File isi folder mein rakhein. Khali chhorein to initials dikhte hain */
  resume: "Sehrish_Khalil_CV.pdf", /* CV ki PDF. Khali chhorein to button chhup jata hai */
  status: "Open to opportunities",
  badges: ["Java", "Python", "Web Development", "Generative AI"],
  bigText: "PORTFOLIO",
  testimonials: [],     /* Asli logon ke quotes hi likhein, jaise { q: "Quote", n: "Naam", r: "Teacher" }. Khali ho to section chhupa rehta hai */
  roles: ["Computer Science undergraduate", "Software development and programming", "Web developer", "Generative AI learner"],
  bio: "I am a Computer Science undergraduate at Sukkur IBA University with a strong foundation in programming, data structures and software development. I have hands-on experience with Java, Python, C++ and web technologies including HTML, CSS, JavaScript and MongoDB. I build academic and practical projects with a focus on problem solving, functionality and user experience, and I am keen to apply my skills in real-world development environments.",
  facts: [
    ["Education", "Bachelor of Computer Science, Sukkur IBA University (2024 to present)"],
    ["Societies", "Executive of the Education Society and the Computer Science Society; member of the Tech Club"],
    ["School", "Intermediate (A grade) and Matriculation (A1 grade), BISEH"],
    ["Location", "Tando Allahyar, Sindh, Pakistan"],
    ["Languages", "English, Urdu, Sindhi, Siraiki"]
  ],
  stats: [[5, "Semester", "th"], [4, "Projects", ""], [11, "Certificates", ""], [7, "Programming languages", ""]],
  services: [
    { t: "Software development", d: "Java, Python and C++ applications built with object oriented design, data structures and algorithms." },
    { t: "Web development", d: "Websites and web apps with HTML, CSS, JavaScript and MongoDB, with a focus on user experience." },
    { t: "Generative AI", d: "Prompt engineering and AI tools, backed by Google AI certificates and an introduction to machine learning." }
  ],
  timeline: [
    { y: "School", t: "Matriculation and Intermediate", d: "Passed Matriculation with an A1 grade and Intermediate with an A grade, both from BISEH." },
    { y: "2023", t: "Social Media Marketing Manager (Intern)", d: "Worked as an intern at Erudite Coaching Center from April to June 2023." },
    { y: "2024", t: "Started Bachelor of Computer Science", d: "Began my degree at Sukkur IBA University and built a strong foundation in programming and data structures." },
    { y: "Campus", t: "Societies, Tech Club and competitions", d: "Executive of the Education Society and the Computer Science Society, active member of the Tech Club, part of the organizing team of a hackathon, and a participant in WPCC (WordPress Campus Connect) and IYMC." },
    { y: "Nov 2026", t: "Google AI certificates", d: "Completed Google AI Essentials and the Google AI Professional Certificate on Coursera." },
    { y: "Next", t: "Real-world development", d: "I want to apply my skills in real development environments and keep growing as a software engineer." }
  ],
  /* Skills CV se hain. Level dikhane ke liye kisi skill mein l: 80 jaisa number add karein. Number na ho to sirf naam dikhta hai */
  skills: [
    { n: "Java", g: "Programming" }, { n: "C++", g: "Programming" }, { n: "C", g: "Programming" }, { n: "Python", g: "Programming" },
    { n: "HTML", g: "Programming" }, { n: "CSS", g: "Programming" }, { n: "JavaScript", g: "Programming" },
    { n: "MySQL", g: "Database" }, { n: "MongoDB", g: "Database" },
    { n: "Figma", g: "Tools and Design" }, { n: "Canva", g: "Tools and Design" }, { n: "MS Office", g: "Tools and Design" },
    { n: "Generative AI", g: "Concepts" }, { n: "Data Structures and Algorithms", g: "Concepts" }, { n: "OOP", g: "Concepts" },
    { n: "Communication", g: "Soft skills" }, { n: "Leadership", g: "Soft skills" }, { n: "Team Management", g: "Soft skills" }
  ],
  projects: [
    { t: "Hotel Management System", d: "A Java and SQL application for managing a hotel.", more: "An academic and practical software project built with Java and a SQL database.", img: "", tags: ["Java", "SQL"], url: "https://github.com/sehrishkhalil30" },
    { t: "Flight Route Optimization System", d: "Finds efficient flight routes using graphs and Dijkstra's algorithm.", more: "Built with data structures and algorithms: graph data structures and Dijkstra's shortest path algorithm.", img: "", tags: ["DSA", "Graphs"], url: "https://github.com/sehrishkhalil30" },
    { t: "AI Shopping Assistant", d: "A shopping assistant built with Python and AI.", more: "A Python project that brings AI into the shopping experience.", img: "", tags: ["Python", "AI"], url: "https://github.com/sehrishkhalil30" },
    { t: "S&S SkillHub", d: "A web project built with HTML, CSS, JavaScript and MongoDB.", more: "The front end is written in HTML, CSS and JavaScript, with MongoDB as the database.", img: "", tags: ["Web", "MongoDB"], url: "https://github.com/sehrishkhalil30" }
  ],
  /* Image certs/ folder mein rakhein aur img: "certs/name.jpg" likhein. link: verify ka link */
  certs: [
    { t: "Google AI Professional Certificate", by: "Google on Coursera", date: "Nov 2026", img: "certs/google-ai.jpg", link: "https://coursera.org/verify/professional-cert/TIYBRYGXR3JS",
      note: "Seven courses: AI Fundamentals, AI for Brainstorming and Planning, AI for Research and Insights, AI for Writing and Communicating, AI for Content Creation, AI for Data Analysis and AI for App Building." },
    { t: "Google AI Essentials", by: "Google on Coursera", date: "Nov 2026", img: "certs/google-ai-essentials.jpg", link: "https://coursera.org/verify/specialization/2VXTBLPOVPD9",
      note: "Five courses: Introduction to AI, Maximize Productivity With AI Tools, Discover the Art of Prompting, Use AI Responsibly and Stay Ahead of the AI Curve." },
    { t: "Generative AI for Beginners", by: "Simplilearn", date: "", img: "", link: "", note: "Course certificate in generative AI." },
    { t: "Prompt Engineering", by: "Coursera", date: "", img: "", link: "", note: "Course certificate in prompt engineering." },
    { t: "AI for All", by: "Coursera", date: "", img: "", link: "", note: "Course certificate in the basics of AI." },
    { t: "AI Content Generation", by: "", date: "", img: "", link: "", note: "Course certificate in AI content generation." },
    { t: "Introduction to Machine Learning", by: "Kaggle", date: "", img: "", link: "", note: "Kaggle Learn course certificate." },
    { t: "Kaggle Community Member", by: "Kaggle", date: "", img: "", link: "https://kaggle.com/sehrishkhalil", note: "Active member of the Kaggle community." },
    { t: "WPCC Programming Competition", by: "WPCC, Sukkur IBA University", date: "", img: "", link: "", note: "Participation in WPCC (WordPress Campus Connect)." },
    { t: "Tech Club Participation", by: "Tech Club", date: "", img: "", link: "", note: "Active member of the Tech Club and part of the hackathon organizing team." },
    { t: "Internship at Erudite Coaching Center", by: "Erudite Coaching Center", date: "2023", img: "", link: "", note: "Social Media Marketing Manager (Intern), April to June 2023." }
  ],
  github: "https://github.com/sehrishkhalil30",
  kaggle: "https://kaggle.com/sehrishkhalil",
  linkedin: "https://www.linkedin.com/in/sehrish-khalil-63a3463a2",
  email: "sehrishkhalil30@gmail.com",
  formKey: ""        /* Web3Forms access key (web3forms.com). Jab tak khali hai, form visitor ka email app kholta hai */
};
