
const topic = (name, why, practice) => ({ name, why, practice });

const semester = (number, title, goal, prerequisites, topics, project, resources) => ({
  semester: number,
  title,
  goal,
  prerequisites,
  topics,
  project,
  resources
});

const foundations = [
  semester(1, "Programming & Engineering Foundations",
    "Learn how programs work and develop a consistent study routine.",
    "No programming experience required.",
    [
      topic("Programming fundamentals", "Variables, data types, input/output and operators are the building blocks of every program.", "Write small programs for unit conversion, marks calculation and simple menus."),
      topic("Conditions and loops", "They let programs make decisions and repeat work.", "Build a number guessing game and a multiplication table generator."),
      topic("Functions and debugging", "Functions organise code; debugging helps you understand and fix errors.", "Break a calculator into functions and fix deliberately introduced bugs."),
      topic("Mathematics and logical reasoning", "Algebra, discrete thinking and logical reasoning support later CS subjects.", "Practise logic puzzles, sets, relations and basic algebra."),
      topic("Git and GitHub basics", "Version control records changes and lets you collaborate safely.", "Create a repository, commit a small program and write a README.")
    ],
    "Programming Starter Pack: five small programs with explanations and a GitHub README.",
    [
      { label: "Python tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Git handbook", url: "https://guides.github.com/introduction/git-handbook/" },
      { label: "Khan Academy maths", url: "https://www.khanacademy.org/math" }
    ]
  ),
  semester(2, "Data Structures, Web Basics & Teamwork",
    "Become comfortable with core programming concepts and build your first visible projects.",
    "Semester 1 programming fundamentals.",
    [
      topic("Arrays, strings and basic searching", "These are common building blocks in applications and coding interviews.", "Find the largest number, reverse a string and search a list."),
      topic("Objects, classes and OOP introduction", "Object-oriented programming groups related data and behaviour.", "Model a student, bank account or library book."),
      topic("HTML and CSS", "These create the structure and visual layout of web pages.", "Build a personal profile page with a responsive layout."),
      topic("SQL introduction", "Databases store structured information that applications need.", "Create tables and practise SELECT, INSERT, UPDATE and DELETE."),
      topic("Communication and documentation", "Engineers need to explain decisions and collaborate clearly.", "Write a README and present your project in three minutes.")
    ],
    "Student Portfolio v1: profile page, a small program and a simple database design.",
    [
      { label: "MDN web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
      { label: "SQLBolt", url: "https://sqlbolt.com/" },
      { label: "GitHub Skills", url: "https://skills.github.com/" }
    ]
  ),
  semester(3, "Data Structures & Computer Science Core",
    "Learn how to choose data structures and reason about program efficiency.",
    "Arrays, strings, functions and basic programming.",
    [
      topic("Linked lists, stacks and queues", "These structures organise data for different access patterns.", "Implement a stack, a queue and a browser-history simulation."),
      topic("Hash maps and sets", "They support efficient lookup and duplicate detection.", "Count word frequencies and find duplicates in a dataset."),
      topic("Searching, sorting and complexity", "Big-O notation helps compare algorithms as input grows.", "Implement binary search and compare sorting approaches."),
      topic("Object-oriented programming", "Encapsulation, inheritance and polymorphism help structure larger applications.", "Design a small library or course-registration system."),
      topic("Discrete mathematics", "Logic, sets, relations and graphs support algorithms and databases.", "Solve truth-table, set-operation and graph-traversal exercises.")
    ],
    "DSA Practice Tracker: implement core structures and document time complexity.",
    [
      { label: "VisuAlgo", url: "https://visualgo.net/en" },
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "OpenDSA", url: "https://opendsa-server.cs.vt.edu/" }
    ]
  ),
  semester(4, "Databases, Systems & Software Development",
    "Understand how applications communicate with databases and the operating system.",
    "Programming, OOP, basic SQL and data structures.",
    [
      topic("DBMS and relational design", "Good database design reduces duplication and protects data integrity.", "Draw an ER diagram and normalise a small college database."),
      topic("Operating system fundamentals", "Processes, memory, files and concurrency explain how programs run.", "Write notes and small demonstrations of process and memory concepts."),
      topic("Computer networks and HTTP", "Networks and HTTP explain how browsers, servers and APIs communicate.", "Inspect browser requests and explain DNS, TCP and HTTP at a high level."),
      topic("Software engineering and testing", "Requirements, modular design and testing make projects more reliable.", "Write user stories and test cases for a small app."),
      topic("REST APIs and JSON", "APIs allow the frontend and backend to exchange data.", "Create a simple API client and handle loading and error states.")
    ],
    "College Resource Portal: a database-backed design with a clear UI, API plan and tests.",
    [
      { label: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
      { label: "MDN HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
    ]
  )
];

const specializations = {
  "Frontend Developer": [
    semester(5, "Frontend Engineering I", "Turn interface designs into accessible, responsive React applications.", "HTML, CSS, JavaScript, Git and basic APIs.", [
      topic("Modern JavaScript", "Modules, promises and async/await support real-world applications.", "Fetch data from a public API and handle loading and errors."),
      topic("React components and hooks", "Reusable components and state help build interactive interfaces.", "Build a searchable, filterable React table."),
      topic("Routing and forms", "Routing creates multiple views; validation helps prevent incorrect submissions.", "Build signup, profile and protected-page flows."),
      topic("Responsive and accessible UI", "Accessible interfaces work better for users with different needs and devices.", "Add keyboard navigation, labels and mobile layouts.")
    ], "Student Opportunity Dashboard with filters, profile pages and API data.", [
      { label: "React Learn", url: "https://react.dev/learn" },
      { label: "MDN accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" }
    ]),
    semester(6, "Frontend Engineering II", "Improve performance, quality and maintainability.", "React, routing, forms and REST APIs.", [
      topic("State management and architecture", "Shared state prevents inconsistent information across pages.", "Refactor a multi-page app into reusable components."),
      topic("Frontend testing", "Tests catch regressions before users encounter them.", "Test validation, filtering and important component behaviour."),
      topic("Performance and browser tools", "Performance work improves responsiveness and user experience.", "Measure a page and improve unnecessary renders or large assets."),
      topic("Authentication and secure UI", "The UI should handle sessions and permissions without exposing secrets.", "Create clear login states and protected routes; never store passwords in localStorage.")
    ], "Polished React application with tests, responsive design and deployment.", [
      { label: "Vitest", url: "https://vitest.dev/guide/" },
      { label: "web.dev performance", url: "https://web.dev/learn/performance/" }
    ]),
    semester(7, "Advanced Frontend & Internship Readiness", "Develop production-style habits and prepare for frontend internships.", "A deployed React project and basic testing.", [
      topic("TypeScript fundamentals", "Types help catch mistakes and document data contracts.", "Convert a small component and API model to TypeScript."),
      topic("Design systems", "Reusable tokens and components make a product consistent.", "Create buttons, forms, cards and theme tokens."),
      topic("Build and deployment workflows", "Build checks and deployment make releases repeatable.", "Deploy your project and document the steps."),
      topic("Interview DSA and browser fundamentals", "Frontend interviews test programming and browser knowledge.", "Practise arrays, strings, closures, event loop and DOM questions.")
    ], "Frontend portfolio with two projects, a case study and a deployed live demo.", [
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "Vite guide", url: "https://vite.dev/guide/" }
    ]),
    semester(8, "Frontend Placements & Capstone", "Prepare to explain, demonstrate and maintain your work.", "Portfolio, React fundamentals and interview practice.", [
      topic("Capstone quality", "A complete project should solve a clear problem and be easy to run.", "Add setup instructions, screenshots, validation and meaningful error states."),
      topic("Frontend interview revision", "Interviewers may ask JavaScript, React, CSS and browser questions.", "Explain hooks, rendering, HTTP, responsive design and accessibility aloud."),
      topic("Mock interviews", "Practice improves clarity and confidence under time pressure.", "Complete timed coding and project walkthrough sessions."),
      topic("Applications and networking", "Targeted applications make it easier to show relevant evidence.", "Tailor your resume and apply to suitable internships and entry-level roles.")
    ], "Final capstone, portfolio walkthrough, resume and placement application tracker.", [
      { label: "Frontend Mentor", url: "https://www.frontendmentor.io/" },
      { label: "GitHub Skills", url: "https://skills.github.com/" }
    ])
  ],
  "Backend Developer": [
    semester(5, "Backend Foundations", "Build server-side applications and understand API design.", "Programming, OOP, SQL, HTTP and Git.", [
      topic("Node.js or Java backend basics", "A backend receives requests and applies application rules.", "Build a small server with health and product endpoints."),
      topic("REST API design", "Consistent endpoints make systems easier to use and maintain.", "Design CRUD endpoints with status codes and JSON responses."),
      topic("Validation and error handling", "Validation protects data quality; clear errors simplify debugging.", "Reject invalid input and return consistent error messages."),
      topic("Relational databases", "Applications use queries and relationships to store reliable data.", "Build tables, joins and constraints for a student portal.")
    ], "Task Management API with CRUD operations and validation.", [
      { label: "Node.js docs", url: "https://nodejs.org/en/learn" },
      { label: "Express guide", url: "https://expressjs.com/en/guide/routing.html" }
    ]),
    semester(6, "Backend Databases & Security", "Build reliable services with authentication and testing.", "A working API and SQL basics.", [
      topic("Database modelling and transactions", "Constraints and transactions help preserve consistent data.", "Model orders and users and test transaction scenarios."),
      topic("Authentication and authorization", "Authentication identifies a user; authorization controls what they can do.", "Implement a safe demo login flow using a recognised library."),
      topic("API and integration testing", "Tests verify endpoint behaviour and failure cases.", "Test successful, invalid and unauthorised requests."),
      topic("Caching and background tasks", "Caching and asynchronous work can improve performance.", "Add a small cache or simulated background task.")
    ], "Secure job-board API with database relationships and automated tests.", [
      { label: "PostgreSQL docs", url: "https://www.postgresql.org/docs/current/" },
      { label: "OWASP Cheat Sheets", url: "https://cheatsheetseries.owasp.org/" }
    ]),
    semester(7, "Backend Systems & Internship Readiness", "Understand deployment, reliability and scalable design basics.", "API testing, SQL and authentication concepts.", [
      topic("Deployment and environment configuration", "Applications need repeatable deployment and safe configuration.", "Deploy a demo service and keep secrets out of source control."),
      topic("Logging and observability", "Logs and health checks help diagnose failures.", "Add structured logs and a health endpoint."),
      topic("System design fundamentals", "Design requires thinking about traffic, data and failure.", "Sketch a URL shortener or notification service."),
      topic("Backend interview practice", "Interviews often cover DSA, SQL, HTTP and API trade-offs.", "Solve DSA problems and explain one API architecture.")
    ], "Deployed API with documentation, tests, health checks and architecture diagram.", [
      { label: "Docker getting started", url: "https://docs.docker.com/get-started/" },
      { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
    ]),
    semester(8, "Backend Placements & Capstone", "Present a reliable backend and prepare for technical interviews.", "Deployed backend project and test suite.", [
      topic("Capstone hardening", "A strong project documents limitations and handles failure gracefully.", "Review validation, permissions, error handling and database constraints."),
      topic("SQL and DSA revision", "Both are common in backend hiring assessments.", "Practise joins, aggregation, indexes and timed DSA problems."),
      topic("API and system design interviews", "Interviewers want clear trade-offs, not just buzzwords.", "Explain request flow, data model, scaling limits and security."),
      topic("Applications and interview tracking", "Organised follow-up helps manage multiple applications.", "Track roles, deadlines, interview stages and lessons learned.")
    ], "Production-style capstone API, technical write-up and placement tracker.", [
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "GitHub Skills", url: "https://skills.github.com/" }
    ])
  ],
  "Full-Stack Developer": [
    semester(5, "Frontend + Backend Integration", "Connect a user interface to a real API.", "React, JavaScript, HTTP and SQL basics.", [
      topic("React application structure", "Components and routes organise the frontend.", "Build list, detail, create and edit screens."),
      topic("Backend and REST APIs", "The server validates and processes application requests.", "Create CRUD endpoints for the frontend to consume."),
      topic("Database integration", "Persistent storage keeps data after refreshes and across users.", "Connect API endpoints to a relational database."),
      topic("Forms and validation", "Client and server validation work together to protect data quality.", "Create a validated registration and profile form.")
    ], "Full-stack student task manager with persistent data.", [
      { label: "React Learn", url: "https://react.dev/learn" },
      { label: "Express guide", url: "https://expressjs.com/en/guide/" }
    ]),
    semester(6, "Full-Stack Product Development", "Add authentication, testing and a consistent user experience.", "A frontend connected to a working API.", [
      topic("Authentication and permissions", "Different users should access only the actions they are allowed to use.", "Build protected demo routes and server-side permission checks."),
      topic("Testing across the stack", "Integration tests catch issues between frontend and backend.", "Test a complete create-edit-delete workflow."),
      topic("File uploads and third-party APIs", "Real products often integrate external services and files.", "Add a safe image upload or a public API integration."),
      topic("Deployment and configuration", "Frontend and backend environments must be configured correctly.", "Deploy both parts and document environment variables.")
    ], "Full-stack opportunity board with profiles, saved jobs and application status.", [
      { label: "Playwright", url: "https://playwright.dev/docs/intro" },
      { label: "Vite guide", url: "https://vite.dev/guide/" }
    ]),
    semester(7, "Full-Stack Architecture & Internship", "Make your app easier to maintain, deploy and explain.", "Full-stack project, Git and testing basics.", [
      topic("Application architecture", "Clear boundaries make features easier to develop and debug.", "Separate UI, API routes, validation and data-access logic."),
      topic("Security and privacy", "Sensitive data must be protected on both the client and server.", "Review permissions, input validation and secret handling."),
      topic("Performance and reliability", "Efficient queries and clear error handling improve user experience.", "Measure a slow request and add appropriate indexing or pagination."),
      topic("Interview preparation", "Full-stack interviews span frontend, backend, SQL and DSA.", "Explain a request from button click through database and back.")
    ], "Deployed full-stack portfolio project with architecture and test documentation.", [
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
      { label: "Docker docs", url: "https://docs.docker.com/" }
    ]),
    semester(8, "Full-Stack Placements & Capstone", "Deliver a complete product and prepare to discuss design decisions.", "A deployed full-stack project.", [
      topic("Capstone delivery", "A finished product should be usable, documented and demonstrable.", "Polish the main user journey and write setup instructions."),
      topic("DSA and core CS revision", "Many placement processes assess coding and CS fundamentals.", "Practise DSA, DBMS, OS, networks and OOP questions."),
      topic("Project and system walkthroughs", "Clear explanations show ownership of your work.", "Prepare a five-minute demo and explain important trade-offs."),
      topic("Applications and mock interviews", "Practice and targeted applications help you prepare systematically.", "Run mock interviews and track feedback and applications.")
    ], "Complete full-stack capstone, live demo, resume and placement tracker.", [
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "GitHub Skills", url: "https://skills.github.com/" }
    ])
  ],
  "Software Engineer": [
    semester(5, "Advanced DSA & Problem Solving", "Solve problems systematically and analyse algorithm efficiency.", "Core data structures, OOP and Big-O.", [
      topic("Trees, heaps and graphs", "These structures represent hierarchies, priorities and networks.", "Implement traversals and solve graph path problems."),
      topic("Recursion and backtracking", "These techniques explore choices and break problems into smaller cases.", "Solve subsets, permutations and maze problems."),
      topic("Dynamic programming basics", "DP avoids repeating work in overlapping subproblems.", "Practise a few memoisation and tabulation problems."),
      topic("Clean code and testing", "Readable code is easier to debug and extend.", "Refactor a problem solution and write edge-case tests.")
    ], "DSA notebook with documented solutions and complexity analysis.", [
      { label: "VisuAlgo", url: "https://visualgo.net/en" },
      { label: "LeetCode", url: "https://leetcode.com/" }
    ]),
    semester(6, "Core Systems & Design", "Connect CS theory with maintainable software design.", "DSA, OOP, DBMS, OS and networking fundamentals.", [
      topic("Design patterns and SOLID basics", "Patterns describe common design solutions and trade-offs.", "Refactor a small application into clearer responsibilities."),
      topic("Operating systems and concurrency", "Processes, threads, locks and memory explain system behaviour.", "Explain race conditions and model a simple producer-consumer case."),
      topic("Networking and distributed systems basics", "Services communicate over networks and must handle failures.", "Trace an HTTP request and list possible failure points."),
      topic("Software testing and CI", "Automated checks make changes safer to merge.", "Add unit tests and a simple automated test workflow.")
    ], "Tested service or desktop application with a design diagram.", [
      { label: "GitHub Actions", url: "https://docs.github.com/en/actions" },
      { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
    ]),
    semester(7, "Engineering Practice & Internship Readiness", "Work like a team engineer and prepare for technical interviews.", "A project with tests and Git history.", [
      topic("Code review and collaboration", "Review improves correctness and spreads knowledge across a team.", "Use branches, pull requests and constructive review notes."),
      topic("System design fundamentals", "Designers consider APIs, data, scaling and failure modes.", "Sketch a notification service and discuss bottlenecks."),
      topic("Language and runtime depth", "Understanding one language deeply helps debug subtle problems.", "Study memory, collections, exceptions and concurrency in your chosen language."),
      topic("Interview practice", "Timed problem solving and communication are both important.", "Complete mock coding sessions and explain complexity.")
    ], "Team-style software project with tests, issues, reviews and documentation.", [
      { label: "GitHub Skills", url: "https://skills.github.com/" },
      { label: "Google testing blog", url: "https://testing.googleblog.com/" }
    ]),
    semester(8, "Software Engineering Placements", "Demonstrate strong fundamentals and ownership of a finished project.", "Interview practice and a documented portfolio.", [
      topic("DSA revision plan", "Repeated practice helps you recognise common problem patterns.", "Revise arrays, trees, graphs, DP and complexity."),
      topic("CS fundamentals revision", "DBMS, OS, networks and OOP are common interview topics.", "Practise concise answers with examples and diagrams."),
      topic("Behavioural interviews", "Interviewers assess teamwork, learning and decision-making.", "Prepare truthful examples of challenges, collaboration and feedback."),
      topic("Capstone and applications", "A well-explained project makes your skills concrete.", "Prepare a demo, resume, repository and targeted applications.")
    ], "Portfolio-ready capstone and placement preparation record.", [
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "GitHub Skills", url: "https://skills.github.com/" }
    ])
  ],
  "AI/ML Engineer": [
    semester(5, "Python, Data Analysis & Mathematics", "Prepare data and understand the maths behind machine learning.", "Python basics, functions, algebra and introductory statistics.", [
      topic("Python for data work", "Python is widely used for data processing and ML experiments.", "Load, clean and analyse a CSV dataset."),
      topic("NumPy and Pandas", "These libraries support array computation and tabular data handling.", "Handle missing values and group data by category."),
      topic("Probability, statistics and linear algebra", "These concepts explain uncertainty, vectors and model behaviour.", "Calculate summary statistics and explore vectors and matrices."),
      topic("Visualisation and data storytelling", "Charts reveal patterns and communicate findings.", "Build charts and write three evidence-based observations.")
    ], "Exploratory Data Analysis report with reproducible code and charts.", [
      { label: "Pandas getting started", url: "https://pandas.pydata.org/docs/getting_started/" },
      { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" }
    ]),
    semester(6, "Machine Learning Fundamentals", "Train, evaluate and compare basic predictive models.", "Python data analysis, statistics and algebra.", [
      topic("Supervised learning", "Regression and classification learn from labelled examples.", "Train a small model on a public dataset."),
      topic("Unsupervised learning", "Clustering can reveal groups when labels are unavailable.", "Cluster a dataset and explain the limits of the result."),
      topic("Evaluation and data leakage", "Poor evaluation can make a model appear better than it is.", "Use train/test splits and suitable evaluation metrics."),
      topic("Feature engineering and pipelines", "Consistent preprocessing improves reproducibility.", "Build a pipeline and compare a baseline with an improved model.")
    ], "End-to-end prediction project with a clear evaluation report.", [
      { label: "scikit-learn tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html" },
      { label: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" }
    ]),
    semester(7, "Deep Learning & Applied AI", "Explore neural networks and build a reproducible AI project.", "Machine learning fundamentals and Python.", [
      topic("Neural network fundamentals", "Layers and learned weights model complex patterns.", "Train a small neural network and compare its performance."),
      topic("Computer vision or NLP", "Specialisations process images or human language.", "Choose one area and build a small supervised project."),
      topic("Experiment tracking and reproducibility", "Saved settings and results make experiments easier to compare.", "Record data splits, model settings and evaluation results."),
      topic("Model serving and responsible AI", "A model needs an interface, monitoring and checks for limitations.", "Expose a demo prediction endpoint and document risks.")
    ], "AI demo with reproducible training, evaluation, interface and limitations.", [
      { label: "PyTorch tutorials", url: "https://pytorch.org/tutorials/" },
      { label: "Hugging Face course", url: "https://huggingface.co/learn" }
    ]),
    semester(8, "AI/ML Capstone & Placements", "Explain the complete ML workflow and prepare for technical roles.", "A model project with evaluation and documentation.", [
      topic("Capstone and model evaluation", "A credible AI project explains data quality, metrics and limitations.", "Compare a baseline, document errors and avoid unsupported claims."),
      topic("ML interview fundamentals", "Interviews may cover statistics, algorithms and model trade-offs.", "Explain overfitting, regularisation, precision, recall and data leakage."),
      topic("Python and coding interview practice", "Coding is still important for many ML engineering roles.", "Practise Python data structures and timed programming questions."),
      topic("Portfolio and applications", "A clear project story helps others assess your contribution.", "Publish notebooks or code, a concise report and a demo where feasible.")
    ], "Well-documented AI/ML capstone, model card or limitations section, resume and placement tracker.", [
      { label: "Kaggle", url: "https://www.kaggle.com/" },
      { label: "LeetCode", url: "https://leetcode.com/" }
    ])
  ],
  "Data Analyst / Data Scientist": [
    semester(5, "Data Analytics Foundations", "Turn raw data into reliable summaries and useful questions.", "SQL basics, programming and introductory statistics.", [
      topic("Advanced SQL", "Joins, grouping and window functions answer business questions.", "Analyse sample sales or student-performance tables."),
      topic("Excel or spreadsheet analysis", "Spreadsheets are common tools for quick analysis and reporting.", "Use formulas, pivots and data validation on a sample dataset."),
      topic("Python with Pandas", "Dataframes help clean and transform datasets efficiently.", "Clean a messy CSV and document each transformation."),
      topic("Statistics and visualisation", "Summaries and charts help explain patterns and uncertainty.", "Build a chart-based report with clear conclusions.")
    ], "Data analysis report answering a real question with SQL, Python and charts.", [
      { label: "SQLBolt", url: "https://sqlbolt.com/" },
      { label: "Pandas tutorials", url: "https://pandas.pydata.org/docs/getting_started/" }
    ]),
    semester(6, "Dashboards & Statistical Thinking", "Create trustworthy dashboards and test data-driven hypotheses.", "SQL, spreadsheets, Python and descriptive statistics.", [
      topic("Dashboard design", "Dashboards help people monitor key measures and trends.", "Build an interactive dashboard with filters and documented metrics."),
      topic("Exploratory data analysis", "EDA checks distributions, missing values and unusual observations.", "Write an EDA report before choosing a model."),
      topic("Hypothesis testing basics", "Statistical tests help evaluate claims while accounting for uncertainty.", "Run a simple test and explain assumptions and limitations."),
      topic("Data quality and communication", "Incorrect or ambiguous data can lead to misleading decisions.", "Create validation checks and a short non-technical summary.")
    ], "Interactive business dashboard with an explanation of key findings.", [
      { label: "Tableau free training", url: "https://www.tableau.com/learn/training" },
      { label: "Microsoft Learn Power BI", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/" }
    ]),
    semester(7, "Predictive Analytics & Internship Readiness", "Use statistics and ML appropriately to support decisions.", "EDA, SQL, Python and basic statistics.", [
      topic("Regression and classification", "Models can estimate values or classify outcomes when suitable data exists.", "Build and evaluate a baseline predictive model."),
      topic("Experiment design and metrics", "Good metrics connect analysis to the actual question.", "Choose metrics and explain false positives and false negatives."),
      topic("Data pipelines and reproducibility", "Repeatable workflows reduce manual mistakes.", "Automate a small cleaning and reporting workflow."),
      topic("Business case communication", "Stakeholders need conclusions, evidence and limitations.", "Present a five-minute analysis with actionable recommendations.")
    ], "Portfolio case study combining data cleaning, analysis, visualisation and recommendations.", [
      { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
      { label: "scikit-learn tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html" }
    ]),
    semester(8, "Analytics & Data Science Placements", "Show sound analytical judgement and explain your work clearly.", "A dashboard and a reproducible analysis project.", [
      topic("SQL interview revision", "SQL tests whether you can retrieve and summarise data accurately.", "Practise joins, subqueries, grouping and window functions."),
      topic("Statistics and ML revision", "Interviews assess whether you understand assumptions and metrics.", "Explain sampling, confidence intervals, overfitting and evaluation."),
      topic("Portfolio walkthrough", "A strong case study connects a question to evidence and decisions.", "Prepare one dashboard and one analysis story with limitations."),
      topic("Applications and mock interviews", "Practise both technical tasks and stakeholder-style questions.", "Track applications and complete timed SQL and case exercises.")
    ], "Two portfolio case studies, a dashboard demo, resume and placement tracker.", [
      { label: "LeetCode database problems", url: "https://leetcode.com/problemset/database/" },
      { label: "Kaggle", url: "https://www.kaggle.com/" }
    ])
  ],
  "Cybersecurity Engineer": [
    semester(5, "Security & Networking Foundations", "Understand systems and networks before studying how to defend them.", "Operating systems, networking and programming basics.", [
      topic("Networking in depth", "Ports, DNS, HTTP, routing and TLS explain how systems communicate.", "Diagram a browser request and inspect your own lab traffic."),
      topic("Linux and command line", "Security engineers use command-line tools to inspect and administer systems.", "Practise files, permissions, processes and logs in a safe lab."),
      topic("Security principles", "Least privilege, defence in depth and threat modelling guide secure design.", "Threat-model a fictional student portal."),
      topic("Python automation", "Scripts can automate repetitive defensive tasks.", "Parse a sample log file and summarise events.")
    ], "Safe security lab notes and a defensive log-analysis script.", [
      { label: "OverTheWire Bandit", url: "https://overthewire.org/wargames/bandit/" },
      { label: "Cisco Skills for All", url: "https://skillsforall.com/" }
    ]),
    semester(6, "Secure Development & Defensive Testing", "Identify common weaknesses and learn how to reduce risk in authorised environments.", "Networking, Linux and basic programming.", [
      topic("Web security concepts", "Understanding common flaws helps developers build safer applications.", "Study a deliberately vulnerable training app in its local lab only."),
      topic("Identity and access control", "Permissions and identity controls restrict access to resources.", "Design a role-permission matrix for a demo application."),
      topic("Secure coding and dependency hygiene", "Validation, safe configuration and updates reduce avoidable risks.", "Review a demo app for unsafe input handling and exposed secrets."),
      topic("Logs and incident fundamentals", "Logs help defenders detect and investigate suspicious events.", "Analyse provided sample logs and write a simple incident timeline.")
    ], "Security review report for your own demo app, including fixes and retesting.", [
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
      { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" }
    ]),
    semester(7, "Defensive Security & Internship Readiness", "Practise detection, risk assessment and secure system administration.", "Security fundamentals and a safe practice lab.", [
      topic("Threat modelling and risk", "Risk assessment prioritises realistic threats and mitigations.", "Create a threat model for a fictional web service."),
      topic("Vulnerability management", "Defenders prioritise fixes based on impact and exposure.", "Review a sample report and write a remediation plan."),
      topic("Monitoring and incident response", "A structured response helps teams investigate and recover.", "Use sample logs to create a detection rule and incident report."),
      topic("Cloud and application security basics", "Cloud permissions and configurations affect the security of deployed services.", "Review a sandbox configuration checklist and least-privilege policy.")
    ], "Defensive security portfolio with a threat model, log analysis and remediation report.", [
      { label: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
      { label: "OWASP Cheat Sheets", url: "https://cheatsheetseries.owasp.org/" }
    ]),
    semester(8, "Cybersecurity Placements & Capstone", "Demonstrate safe methodology, technical reasoning and clear reporting.", "Security lab experience and a documented defensive project.", [
      topic("Security fundamentals revision", "Interviews may cover networking, Linux, web security and access control.", "Explain common risks and mitigations using simple diagrams."),
      topic("Incident and scenario interviews", "Structured investigation is more useful than guessing.", "Walk through a fictional alert from triage to remediation."),
      topic("Ethics and authorised testing", "Security testing must have clear permission and scope.", "Write a scope, rules of engagement and responsible disclosure example."),
      topic("Portfolio and applications", "Clear evidence of safe, documented work demonstrates judgement.", "Publish sanitised lab reports and defensive projects without secrets or private data.")
    ], "Ethical security capstone with scope, evidence, remediation and lessons learned.", [
      { label: "NIST NICE Framework", url: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center" },
      { label: "TryHackMe learning paths", url: "https://tryhackme.com/paths" }
    ])
  ]
};

const roleDescriptions = {
  "Frontend Developer": {
    icon: "≡ƒÄ¿",
    summary: "Build the pages and interactive interfaces people use.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Accessibility"],
    fit: "You enjoy visual problem-solving, user experience and building things people can interact with."
  },
  "Backend Developer": {
    icon: "ΓÜÖ∩╕Å",
    summary: "Build APIs, application logic, databases and reliable services.",
    skills: ["Programming", "APIs", "SQL", "Authentication", "Testing"],
    fit: "You enjoy logic, data, system behaviour and solving problems behind the interface."
  },
  "Full-Stack Developer": {
    icon: "≡ƒöù",
    summary: "Connect the frontend, backend and database into a complete product.",
    skills: ["React", "Backend", "SQL", "APIs", "Deployment"],
    fit: "You like understanding how a complete application works from screen to database."
  },
  "Software Engineer": {
    icon: "≡ƒÆ╗",
    summary: "Design, implement, test and maintain software systems.",
    skills: ["DSA", "OOP", "Testing", "Core CS", "Design"],
    fit: "You enjoy problem-solving, clean code and understanding how software systems fit together."
  },
  "AI/ML Engineer": {
    icon: "≡ƒñû",
    summary: "Prepare data, train models and build useful AI-powered systems.",
    skills: ["Python", "Statistics", "Data", "Machine Learning", "Evaluation"],
    fit: "You enjoy maths, experimentation, data and learning how models make predictions."
  },
  "Data Analyst / Data Scientist": {
    icon: "≡ƒôè",
    summary: "Use data, statistics and visualisation to answer practical questions.",
    skills: ["SQL", "Python", "Statistics", "Visualisation", "Communication"],
    fit: "You enjoy finding patterns, asking questions and explaining evidence clearly."
  },
  "Cybersecurity Engineer": {
    icon: "≡ƒ¢í∩╕Å",
    summary: "Help protect applications, systems and information from security risks.",
    skills: ["Networking", "Linux", "Security", "Monitoring", "Risk"],
    fit: "You enjoy investigating how systems work and improving their safety and reliability."
  }
};

const placementChecklist = [
  { id: "resume", title: "Resume and LinkedIn", detail: "Write a clear one-page resume and update your professional profile." },
  { id: "projects", title: "Portfolio and GitHub", detail: "Pin your best projects, add READMEs and check that setup instructions work." },
  { id: "dsa", title: "Coding practice", detail: "Practise arrays, strings, hashing, trees and other role-relevant interview topics." },
  { id: "core", title: "Core subject revision", detail: "Revise OOP, DBMS, operating systems and networks where relevant to your target role." },
  { id: "aptitude", title: "Aptitude and communication", detail: "Practise quantitative reasoning, explaining solutions and behavioural examples." },
  { id: "mock", title: "Mock interviews", detail: "Run timed technical and HR practice sessions; record feedback and improve." },
  { id: "apply", title: "Applications tracker", detail: "Track company, role, application date, next step and follow-up." }
];

export const roadmapData = {
  foundations,
  specializations,
  roleDescriptions,
  placementChecklist
};
