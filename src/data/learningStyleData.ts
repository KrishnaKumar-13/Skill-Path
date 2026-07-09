// ─── Learning Style Data ─────────────────────────────────────────────────────
// Videos, docs, projects, and challenges — each style gets completely different content.

// ── VIDEO TUTORIALS ──────────────────────────────────────────────────────────

export interface VideoPlaylist {
  channelName: string;
  title: string;
  language: 'Telugu' | 'Hindi' | 'English';
  url: string;
  rating: number;     // out of 5
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  subscribers: string;
  description: string;
}

export const videoTutorials: Record<string, VideoPlaylist[]> = {
  python: [
    // Telugu
    { channelName: 'Naresh i Technologies', title: 'Python Full Course in Telugu', language: 'Telugu', url: 'https://www.youtube.com/@NareshIT', rating: 4.7, durationHours: 40, level: 'Beginner', subscribers: '2.5M', description: 'Complete Python from scratch in Telugu with hands-on examples.' },
    { channelName: 'Telugu Skill Hub', title: 'Python for Beginners Telugu', language: 'Telugu', url: 'https://www.youtube.com/@TeluguSkillHub', rating: 4.5, durationHours: 25, level: 'Beginner', subscribers: '450K', description: 'Clear Telugu explanations with real project demos.' },
    { channelName: 'Durgasoft', title: 'Python Advanced Telugu', language: 'Telugu', url: 'https://www.youtube.com/@DURGASOFTWARE', rating: 4.6, durationHours: 60, level: 'Intermediate', subscribers: '1.1M', description: 'Deep dive into Python including OOP, decorators, generators.' },
    // Hindi
    { channelName: 'CodeWithHarry', title: 'Python Tutorial in Hindi', language: 'Hindi', url: 'https://www.youtube.com/@CodeWithHarry', rating: 4.9, durationHours: 30, level: 'Beginner', subscribers: '7M', description: 'India\'s most popular Python course in Hindi. Fun and engaging style.' },
    { channelName: 'Apna College', title: 'Python Full Course', language: 'Hindi', url: 'https://www.youtube.com/@ApnaCollegeOfficial', rating: 4.8, durationHours: 45, level: 'Beginner', subscribers: '5M', description: 'DSA + Python + placements — all in one place.' },
    { channelName: 'Haris Bangla Tech', title: 'Python Intermediate Hindi', language: 'Hindi', url: 'https://www.youtube.com/@HarrisBanglaTech', rating: 4.4, durationHours: 20, level: 'Intermediate', subscribers: '300K', description: 'Focused on web scraping and automation projects.' },
    // English
    { channelName: 'freeCodeCamp', title: 'Python for Beginners – Full Course', language: 'English', url: 'https://www.youtube.com/@freecodecamp', rating: 4.9, durationHours: 12, level: 'Beginner', subscribers: '9M', description: 'The most-watched Python course on YouTube. Free, comprehensive.' },
    { channelName: 'Programming with Mosh', title: 'Python Tutorial – Full Course', language: 'English', url: 'https://www.youtube.com/@programmingwithmosh', rating: 4.8, durationHours: 6, level: 'Beginner', subscribers: '4M', description: 'Clean, professional teaching style. Great for absolute beginners.' },
    { channelName: 'Tech With Tim', title: 'Python Intermediate & Advanced', language: 'English', url: 'https://www.youtube.com/@TechWithTim', rating: 4.7, durationHours: 30, level: 'Intermediate', subscribers: '1.3M', description: 'Projects, games, ML, automation — great intermediate content.' },
  ],
  java: [
    { channelName: 'Naresh i Technologies', title: 'Java Full Course Telugu', language: 'Telugu', url: 'https://www.youtube.com/@NareshIT', rating: 4.7, durationHours: 60, level: 'Beginner', subscribers: '2.5M', description: 'Core Java to Spring Boot in Telugu.' },
    { channelName: 'JNTUA Online', title: 'Java OOP Telugu', language: 'Telugu', url: 'https://www.youtube.com', rating: 4.4, durationHours: 30, level: 'Beginner', subscribers: '200K', description: 'University-level Java teaching in Telugu.' },
    { channelName: 'CodeWithHarry', title: 'Java Tutorial Hindi', language: 'Hindi', url: 'https://www.youtube.com/@CodeWithHarry', rating: 4.8, durationHours: 20, level: 'Beginner', subscribers: '7M', description: 'Quick Java crash course in Hindi.' },
    { channelName: 'Apna College', title: 'Java + DSA Complete Hindi', language: 'Hindi', url: 'https://www.youtube.com/@ApnaCollegeOfficial', rating: 4.9, durationHours: 80, level: 'Beginner', subscribers: '5M', description: 'Best Java + DSA course in Hindi for placements.' },
    { channelName: 'Amigoscode', title: 'Spring Boot Full Course', language: 'English', url: 'https://www.youtube.com/@amigoscode', rating: 4.8, durationHours: 20, level: 'Intermediate', subscribers: '600K', description: 'Professional Spring Boot tutorials from production experience.' },
    { channelName: 'Telusko', title: 'Java Complete Playlist', language: 'English', url: 'https://www.youtube.com/@Telusko', rating: 4.7, durationHours: 40, level: 'Beginner', subscribers: '2M', description: 'Narendra Hirwani\'s Java course — very detailed.' },
    { channelName: 'freeCodeCamp', title: 'Java for Beginners Full Course', language: 'English', url: 'https://www.youtube.com/@freecodecamp', rating: 4.8, durationHours: 8, level: 'Beginner', subscribers: '9M', description: 'Concise Java course that covers all essentials.' },
  ],
  javascript: [
    { channelName: 'Naresh i Technologies', title: 'JavaScript Telugu Complete', language: 'Telugu', url: 'https://www.youtube.com/@NareshIT', rating: 4.6, durationHours: 45, level: 'Beginner', subscribers: '2.5M', description: 'Complete JavaScript and Node.js in Telugu.' },
    { channelName: 'CodeWithHarry', title: 'JavaScript Hindi Course', language: 'Hindi', url: 'https://www.youtube.com/@CodeWithHarry', rating: 4.9, durationHours: 35, level: 'Beginner', subscribers: '7M', description: 'Most popular JavaScript course in Hindi.' },
    { channelName: 'freeCodeCamp', title: 'JavaScript Full Course', language: 'English', url: 'https://www.youtube.com/@freecodecamp', rating: 4.9, durationHours: 8, level: 'Beginner', subscribers: '9M', description: 'Comprehensive JavaScript with DOM and async.' },
    { channelName: 'Traversy Media', title: 'JavaScript Crash Course', language: 'English', url: 'https://www.youtube.com/@TraversyMedia', rating: 4.8, durationHours: 2, level: 'Beginner', subscribers: '2M', description: 'Best quick intro to JavaScript for web devs.' },
    { channelName: 'Fireship', title: 'JavaScript in 100 Seconds + More', language: 'English', url: 'https://www.youtube.com/@Fireship', rating: 4.9, durationHours: 10, level: 'Intermediate', subscribers: '3M', description: 'High-quality, fast-paced modern JS content.' },
  ],
  cpp: [
    { channelName: 'CodeWithHarry', title: 'C++ Complete Hindi', language: 'Hindi', url: 'https://www.youtube.com/@CodeWithHarry', rating: 4.8, durationHours: 25, level: 'Beginner', subscribers: '7M', description: 'C++ from scratch in Hindi with DSA.' },
    { channelName: 'Apna College', title: 'C++ DSA Course', language: 'Hindi', url: 'https://www.youtube.com/@ApnaCollegeOfficial', rating: 4.9, durationHours: 60, level: 'Beginner', subscribers: '5M', description: 'Best C++ + DSA for placements in India.' },
    { channelName: 'freeCodeCamp', title: 'C++ Tutorial for Beginners', language: 'English', url: 'https://www.youtube.com/@freecodecamp', rating: 4.8, durationHours: 4, level: 'Beginner', subscribers: '9M', description: 'Clear C++ introduction.' },
    { channelName: 'The Cherno', title: 'C++ Series', language: 'English', url: 'https://www.youtube.com/@TheCherno', rating: 4.9, durationHours: 50, level: 'Intermediate', subscribers: '450K', description: 'Best deep-dive C++ series on YouTube. Used by game developers.' },
  ],
  dsa: [
    { channelName: 'Apna College', title: 'DSA in Java Hindi', language: 'Hindi', url: 'https://www.youtube.com/@ApnaCollegeOfficial', rating: 4.9, durationHours: 80, level: 'Beginner', subscribers: '5M', description: 'Complete DSA in Java with Hindi explanations.' },
    { channelName: 'Striver (TakeUForward)', title: 'A2Z DSA Sheet', language: 'Hindi', url: 'https://www.youtube.com/@takeUforward', rating: 5.0, durationHours: 100, level: 'Beginner', subscribers: '1.2M', description: 'The best DSA course for placements in India. Highly recommended.' },
    { channelName: 'Abdul Bari', title: 'Algorithms Course', language: 'English', url: 'https://www.youtube.com/@abdul_bari', rating: 4.9, durationHours: 40, level: 'Intermediate', subscribers: '500K', description: 'Gold standard for algorithms theory with animations.' },
    { channelName: 'NeetCode', title: 'Blind 75 / NeetCode 150', language: 'English', url: 'https://www.youtube.com/@NeetCode', rating: 5.0, durationHours: 50, level: 'Intermediate', subscribers: '600K', description: 'Best LeetCode explanation channel. Perfect for interview prep.' },
  ],
  sql: [
    { channelName: 'CodeWithHarry', title: 'SQL Hindi Tutorial', language: 'Hindi', url: 'https://www.youtube.com/@CodeWithHarry', rating: 4.7, durationHours: 10, level: 'Beginner', subscribers: '7M', description: 'SQL basics in Hindi.' },
    { channelName: 'freeCodeCamp', title: 'SQL Tutorial Full Course', language: 'English', url: 'https://www.youtube.com/@freecodecamp', rating: 4.8, durationHours: 4, level: 'Beginner', subscribers: '9M', description: 'Full SQL from SELECT to window functions.' },
    { channelName: 'Alex the Analyst', title: 'SQL Bootcamp', language: 'English', url: 'https://www.youtube.com/@AlexTheAnalyst', rating: 4.8, durationHours: 8, level: 'Beginner', subscribers: '600K', description: 'SQL for data analysts. Very practical.' },
  ],
};

// ── READING RESOURCES ─────────────────────────────────────────────────────────

export interface ReadingResource {
  title: string;
  source: string;
  url: string;
  type: 'Official Docs' | 'Tutorial Site' | 'Book' | 'Blog' | 'Reference';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  description: string;
  isFree: boolean;
  rating: number;
}

export const readingResources: Record<string, ReadingResource[]> = {
  python: [
    { title: 'Official Python Documentation', source: 'python.org', url: 'https://docs.python.org/3/tutorial/', type: 'Official Docs', level: 'All Levels', description: 'The definitive Python reference. Start with the tutorial section.', isFree: true, rating: 4.8 },
    { title: 'Real Python', source: 'realpython.com', url: 'https://realpython.com', type: 'Tutorial Site', level: 'All Levels', description: 'High-quality Python tutorials with projects. Best beginner-to-intermediate resource.', isFree: true, rating: 4.9 },
    { title: 'W3Schools Python', source: 'w3schools.com', url: 'https://www.w3schools.com/python/', type: 'Reference', level: 'Beginner', description: 'Quick syntax reference with interactive examples. Great for quick lookups.', isFree: true, rating: 4.3 },
    { title: 'GeeksforGeeks Python', source: 'geeksforgeeks.org', url: 'https://www.geeksforgeeks.org/python-programming-language/', type: 'Tutorial Site', level: 'All Levels', description: 'Detailed explanations of Python concepts with interview focus.', isFree: true, rating: 4.5 },
    { title: 'Programiz Python', source: 'programiz.com', url: 'https://www.programiz.com/python-programming', type: 'Tutorial Site', level: 'Beginner', description: 'Clean, beginner-friendly Python tutorials with examples.', isFree: true, rating: 4.6 },
    { title: 'Automate the Boring Stuff', source: 'automatetheboringstuff.com', url: 'https://automatetheboringstuff.com', type: 'Book', level: 'Beginner', description: 'Best practical Python book. Learn Python by doing real automation projects.', isFree: true, rating: 4.9 },
  ],
  java: [
    { title: 'Oracle Java Documentation', source: 'docs.oracle.com', url: 'https://docs.oracle.com/javase/tutorial/', type: 'Official Docs', level: 'All Levels', description: 'Official Java tutorials from Oracle. Comprehensive and authoritative.', isFree: true, rating: 4.5 },
    { title: 'Baeldung', source: 'baeldung.com', url: 'https://www.baeldung.com', type: 'Tutorial Site', level: 'Intermediate', description: 'Best Java/Spring Boot tutorials. Used by professional developers daily.', isFree: true, rating: 4.9 },
    { title: 'GeeksforGeeks Java', source: 'geeksforgeeks.org', url: 'https://www.geeksforgeeks.org/java/', type: 'Tutorial Site', level: 'All Levels', description: 'Java concepts with interview focus. Great for placements.', isFree: true, rating: 4.6 },
    { title: 'JavaPoint', source: 'javatpoint.com', url: 'https://www.javatpoint.com/java-tutorial', type: 'Tutorial Site', level: 'Beginner', description: 'Beginner-friendly Java tutorials with visual diagrams.', isFree: true, rating: 4.2 },
    { title: 'Effective Java (Book)', source: 'Joshua Bloch', url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/', type: 'Book', level: 'Advanced', description: 'The definitive Java best practices book. Required reading for senior Java devs.', isFree: false, rating: 5.0 },
  ],
  javascript: [
    { title: 'MDN Web Docs', source: 'developer.mozilla.org', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'Official Docs', level: 'All Levels', description: 'The authoritative JavaScript reference. Every developer bookmarks this.', isFree: true, rating: 5.0 },
    { title: 'javascript.info', source: 'javascript.info', url: 'https://javascript.info', type: 'Tutorial Site', level: 'All Levels', description: 'The best structured JavaScript tutorial. Goes from basics to advanced topics.', isFree: true, rating: 4.9 },
    { title: 'Eloquent JavaScript', source: 'eloquentjavascript.net', url: 'https://eloquentjavascript.net', type: 'Book', level: 'Intermediate', description: 'Free online book that teaches programming through JavaScript. Classic.', isFree: true, rating: 4.7 },
    { title: 'You Don\'t Know JS', source: 'GitHub', url: 'https://github.com/getify/You-Dont-Know-JS', type: 'Book', level: 'Advanced', description: 'Deep dive into JavaScript internals. Makes you truly understand the language.', isFree: true, rating: 4.9 },
  ],
  cpp: [
    { title: 'cppreference.com', source: 'cppreference.com', url: 'https://en.cppreference.com', type: 'Official Docs', level: 'All Levels', description: 'The definitive C++ reference. Used by every C++ developer.', isFree: true, rating: 4.9 },
    { title: 'LearnCpp.com', source: 'learncpp.com', url: 'https://www.learncpp.com', type: 'Tutorial Site', level: 'Beginner', description: 'Best C++ learning site. Very thorough and well-organized.', isFree: true, rating: 4.9 },
    { title: 'GeeksforGeeks C++', source: 'geeksforgeeks.org', url: 'https://www.geeksforgeeks.org/c-plus-plus/', type: 'Tutorial Site', level: 'All Levels', description: 'C++ with competitive programming focus.', isFree: true, rating: 4.5 },
  ],
  dsa: [
    { title: 'Striver\'s A2Z DSA Sheet', source: 'takeuforward.org', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', type: 'Tutorial Site', level: 'All Levels', description: '455 problems with solutions and video explanations. Best DSA sheet for placements.', isFree: true, rating: 5.0 },
    { title: 'Introduction to Algorithms (CLRS)', source: 'MIT Press', url: 'https://mitpress.mit.edu/9780262046305/', type: 'Book', level: 'Advanced', description: 'The Bible of algorithms. Used in university courses worldwide.', isFree: false, rating: 4.9 },
    { title: 'GeeksforGeeks DSA', source: 'geeksforgeeks.org', url: 'https://www.geeksforgeeks.org/data-structures/', type: 'Tutorial Site', level: 'All Levels', description: 'Comprehensive DSA articles with animated visualizations.', isFree: true, rating: 4.6 },
    { title: 'NeetCode Roadmap', source: 'neetcode.io', url: 'https://neetcode.io/roadmap', type: 'Tutorial Site', level: 'Intermediate', description: 'Curated LeetCode problems organized by topic. Best interview prep resource.', isFree: true, rating: 5.0 },
  ],
  sql: [
    { title: 'PostgreSQL Official Docs', source: 'postgresql.org', url: 'https://www.postgresql.org/docs/current/', type: 'Official Docs', level: 'All Levels', description: 'Complete PostgreSQL documentation.', isFree: true, rating: 4.7 },
    { title: 'SQLBolt', source: 'sqlbolt.com', url: 'https://sqlbolt.com', type: 'Tutorial Site', level: 'Beginner', description: 'Interactive SQL lessons in the browser. Best way to start learning SQL.', isFree: true, rating: 4.9 },
    { title: 'Mode SQL Tutorial', source: 'mode.com', url: 'https://mode.com/sql-tutorial/', type: 'Tutorial Site', level: 'Intermediate', description: 'SQL for data analysts. Real-world queries on real data.', isFree: true, rating: 4.7 },
  ],
};

// ── PROJECT IDEAS ─────────────────────────────────────────────────────────────

export interface ProjectIdea {
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  estimatedHours: number;
  techStack: string[];
  githubExample?: string;
  why: string;
}

export const projectIdeas: Record<string, ProjectIdea[]> = {
  python: [
    { name: 'Calculator', description: 'Command-line calculator with basic math operations.', difficulty: 'Beginner', skills: ['Variables', 'Functions', 'User input'], estimatedHours: 2, techStack: ['Python'], why: 'Teaches basic I/O and functions.' },
    { name: 'To-Do App', description: 'CLI task manager that saves tasks to a file.', difficulty: 'Beginner', skills: ['File I/O', 'Lists', 'Functions'], estimatedHours: 4, techStack: ['Python'], githubExample: 'https://github.com/search?q=python+todo+cli', why: 'Teaches persistence and data management.' },
    { name: 'Weather App', description: 'Fetch and display weather using OpenWeatherMap API.', difficulty: 'Beginner', skills: ['requests', 'JSON', 'APIs'], estimatedHours: 6, techStack: ['Python', 'requests', 'API'], githubExample: 'https://github.com/search?q=python+weather+app', why: 'Teaches API integration — essential skill.' },
    { name: 'Web Scraper', description: 'Scrape job listings or news from a website.', difficulty: 'Intermediate', skills: ['BeautifulSoup', 'requests', 'Data parsing'], estimatedHours: 8, techStack: ['Python', 'BeautifulSoup', 'requests'], githubExample: 'https://github.com/search?q=python+web+scraper', why: 'Real-world data collection skill.' },
    { name: 'Expense Tracker', description: 'Web app to track income and expenses with charts.', difficulty: 'Intermediate', skills: ['Flask', 'SQLite', 'matplotlib', 'HTML/CSS'], estimatedHours: 20, techStack: ['Python', 'Flask', 'SQLite', 'Chart.js'], githubExample: 'https://github.com/search?q=python+flask+expense+tracker', why: 'Full-stack mini project — impressive for portfolio.' },
    { name: 'Chat App', description: 'Real-time chat using WebSockets.', difficulty: 'Intermediate', skills: ['Socket.io', 'Flask-SocketIO', 'Async'], estimatedHours: 25, techStack: ['Python', 'Flask', 'WebSocket', 'JavaScript'], githubExample: 'https://github.com/search?q=python+flask+chat+app', why: 'Demonstrates real-time programming.' },
    { name: 'ML Price Predictor', description: 'Predict house prices using scikit-learn.', difficulty: 'Advanced', skills: ['pandas', 'scikit-learn', 'Data preprocessing', 'Regression'], estimatedHours: 30, techStack: ['Python', 'scikit-learn', 'pandas', 'Streamlit'], githubExample: 'https://github.com/search?q=python+house+price+prediction', why: 'Shows ML engineering skills — in high demand.' },
    { name: 'LeetCode Clone', description: 'Code execution platform with problem sets.', difficulty: 'Advanced', skills: ['FastAPI', 'Docker', 'Code sandboxing', 'PostgreSQL'], estimatedHours: 80, techStack: ['Python', 'FastAPI', 'Docker', 'React', 'PostgreSQL'], githubExample: 'https://github.com/search?q=python+online+judge', why: 'Capstone project — shows full-stack + DevOps skills.' },
  ],
  java: [
    { name: 'Student Grade Manager', description: 'OOP app to manage student grades.', difficulty: 'Beginner', skills: ['Classes', 'ArrayList', 'File I/O'], estimatedHours: 6, techStack: ['Java'], why: 'Classic OOP practice project.' },
    { name: 'Bank Account System', description: 'Console banking with deposits, withdrawals, transfers.', difficulty: 'Beginner', skills: ['OOP', 'Inheritance', 'Exceptions'], estimatedHours: 10, techStack: ['Java'], githubExample: 'https://github.com/search?q=java+bank+account+system', why: 'Models real-world business logic.' },
    { name: 'Library Management', description: 'CRUD for books, members, and borrowing.', difficulty: 'Intermediate', skills: ['Java Collections', 'File I/O', 'OOP design'], estimatedHours: 20, techStack: ['Java', 'MySQL', 'JDBC'], githubExample: 'https://github.com/search?q=java+library+management+system', why: 'Good for demonstrating full CRUD operations.' },
    { name: 'REST API with Spring Boot', description: 'Employee management REST API.', difficulty: 'Intermediate', skills: ['Spring Boot', 'JPA', 'REST', 'PostgreSQL'], estimatedHours: 25, techStack: ['Spring Boot', 'PostgreSQL', 'JPA'], githubExample: 'https://github.com/search?q=spring+boot+employee+rest+api', why: 'Standard interview project for Java developers.' },
    { name: 'E-commerce Backend', description: 'Full backend with auth, products, orders, and payments.', difficulty: 'Advanced', skills: ['Spring Security', 'JWT', 'Stripe API', 'Microservices'], estimatedHours: 80, techStack: ['Spring Boot', 'PostgreSQL', 'Redis', 'Docker'], githubExample: 'https://github.com/search?q=spring+boot+ecommerce+backend', why: 'Production-level portfolio project.' },
  ],
  javascript: [
    { name: 'Interactive Quiz', description: 'Multiple choice quiz with score tracking.', difficulty: 'Beginner', skills: ['DOM manipulation', 'Events', 'Arrays'], estimatedHours: 6, techStack: ['HTML', 'CSS', 'JavaScript'], githubExample: 'https://github.com/search?q=javascript+quiz+app', why: 'Fun, shareable project that shows DOM skills.' },
    { name: 'Todo App with LocalStorage', description: 'Task app that persists between sessions.', difficulty: 'Beginner', skills: ['localStorage', 'DOM', 'JSON'], estimatedHours: 8, techStack: ['HTML', 'CSS', 'JavaScript'], githubExample: 'https://github.com/search?q=javascript+todo+localstorage', why: 'Classic project every JS developer builds.' },
    { name: 'Weather Dashboard', description: 'Live weather with charts and 5-day forecast.', difficulty: 'Intermediate', skills: ['fetch API', 'async/await', 'Chart.js'], estimatedHours: 15, techStack: ['JavaScript', 'OpenWeatherMap API', 'Chart.js'], githubExample: 'https://github.com/search?q=javascript+weather+dashboard', why: 'API + visualization — very employer-friendly.' },
    { name: 'React Task Manager', description: 'Full React app with state management.', difficulty: 'Intermediate', skills: ['React', 'useState', 'useEffect', 'CSS modules'], estimatedHours: 20, techStack: ['React', 'Vite', 'TypeScript'], githubExample: 'https://github.com/search?q=react+task+manager', why: 'Standard React project for internship portfolios.' },
    { name: 'Full-Stack Social App', description: 'Mini Twitter clone with auth, posts, likes.', difficulty: 'Advanced', skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'], estimatedHours: 60, techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'], githubExample: 'https://github.com/search?q=mern+social+media+clone', why: 'MERN stack project — top of portfolio.' },
  ],
  cpp: [
    { name: 'Linked List Implementation', description: 'Build a doubly linked list from scratch.', difficulty: 'Beginner', skills: ['Pointers', 'Structs', 'Memory management'], estimatedHours: 8, techStack: ['C++'], githubExample: 'https://github.com/search?q=cpp+linked+list', why: 'Core CS skill — asked in every interview.' },
    { name: 'Student Grade System', description: 'OOP system with sorting and search.', difficulty: 'Beginner', skills: ['Classes', 'Vectors', 'Sorting'], estimatedHours: 10, techStack: ['C++', 'STL'], why: 'Classic OOP practice.' },
    { name: 'Mini Compiler / Parser', description: 'Expression evaluator that parses math expressions.', difficulty: 'Advanced', skills: ['Parsing', 'Stacks', 'Recursion', 'Grammars'], estimatedHours: 40, techStack: ['C++'], githubExample: 'https://github.com/search?q=cpp+expression+parser', why: 'Shows compiler knowledge — impressive for tech companies.' },
  ],
  dsa: [
    { name: '30 LeetCode Easy Problems', description: 'Solve 30 easy problems across arrays, strings, and math.', difficulty: 'Beginner', skills: ['Arrays', 'Strings', 'Math'], estimatedHours: 15, techStack: ['Any language'], githubExample: 'https://leetcode.com/problemset/?difficulty=EASY', why: 'Builds problem-solving confidence.' },
    { name: 'Implement Core Data Structures', description: 'Stack, Queue, Linked List, BST, Heap from scratch.', difficulty: 'Intermediate', skills: ['Data structures', 'Pointers', 'OOP'], estimatedHours: 25, techStack: ['Java/C++/Python'], githubExample: 'https://github.com/search?q=data+structures+implementation', why: 'Fundamental skill for every software engineer.' },
    { name: 'Blind 75 LeetCode', description: 'Solve the famous Blind 75 problem set.', difficulty: 'Advanced', skills: ['DP', 'Graphs', 'Trees', 'Backtracking'], estimatedHours: 60, techStack: ['Any language'], githubExample: 'https://neetcode.io/practice', why: 'The industry-standard interview preparation set.' },
  ],
  sql: [
    { name: 'Library Database', description: 'Design and query a library database.', difficulty: 'Beginner', skills: ['CREATE TABLE', 'SELECT', 'JOIN', 'WHERE'], estimatedHours: 5, techStack: ['PostgreSQL'], why: 'Perfect relational database practice.' },
    { name: 'Sales Analysis Dashboard', description: 'Analyze e-commerce data with complex queries.', difficulty: 'Intermediate', skills: ['Window functions', 'CTEs', 'GROUP BY', 'HAVING'], estimatedHours: 12, techStack: ['PostgreSQL', 'Excel/Tableau'], githubExample: 'https://github.com/search?q=sql+sales+analysis', why: 'Data analyst portfolio project.' },
  ],
};

// ── CODING CHALLENGES ─────────────────────────────────────────────────────────

export interface CodingPlatform {
  name: string;
  description: string;
  url: string;
  focus: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  problemCount: string;
  isFree: boolean;
  rating: number;
  bestFor: string;
  emoji: string;
}

export const codingPlatforms: Record<string, CodingPlatform[]> = {
  dsa: [
    { name: 'LeetCode', description: 'The most popular interview prep platform. Used by FAANG engineers.', url: 'https://leetcode.com', focus: 'Algorithms & Data Structures', difficulty: 'All Levels', problemCount: '3000+', isFree: true, rating: 4.9, bestFor: 'FAANG interview preparation', emoji: '🧩' },
    { name: 'HackerRank', description: 'Beginner-friendly with domain-specific tracks.', url: 'https://www.hackerrank.com', focus: 'Multiple domains', difficulty: 'Beginner', problemCount: '2000+', isFree: true, rating: 4.5, bestFor: 'Getting started with competitive programming', emoji: '🎯' },
    { name: 'Codeforces', description: 'Real competitive programming contests with global rankings.', url: 'https://codeforces.com', focus: 'Competitive programming', difficulty: 'Intermediate', problemCount: '8000+', isFree: true, rating: 4.8, bestFor: 'Competitive programming & CP ratings', emoji: '⚡' },
    { name: 'CodeChef', description: 'Indian competitive programming platform with monthly contests.', url: 'https://www.codechef.com', focus: 'Competitive programming', difficulty: 'All Levels', problemCount: '5000+', isFree: true, rating: 4.5, bestFor: 'Building a competitive rating for Indian placement', emoji: '🍴' },
    { name: 'AtCoder', description: 'Japanese platform with mathematically rich problems.', url: 'https://atcoder.jp', focus: 'Algorithms', difficulty: 'Intermediate', problemCount: '3000+', isFree: true, rating: 4.7, bestFor: 'Math-heavy algorithm problems', emoji: '🏯' },
  ],
  frontend: [
    { name: 'Frontend Mentor', description: 'Build real websites from professional designs with Figma files.', url: 'https://www.frontendmentor.io', focus: 'HTML/CSS/JavaScript/React', difficulty: 'All Levels', problemCount: '80+ challenges', isFree: true, rating: 4.9, bestFor: 'Building a frontend portfolio', emoji: '🎨' },
    { name: 'CSS Battle', description: 'Replicate CSS targets in the least amount of code.', url: 'https://cssbattle.dev', focus: 'CSS', difficulty: 'All Levels', problemCount: '400+', isFree: true, rating: 4.6, bestFor: 'Mastering CSS tricks', emoji: '⚔️' },
    { name: 'JavaScript30', description: '30 JavaScript projects in 30 days — no libraries.', url: 'https://javascript30.com', focus: 'Vanilla JavaScript', difficulty: 'Beginner', problemCount: '30 projects', isFree: true, rating: 4.8, bestFor: 'Learning JavaScript through projects', emoji: '📅' },
  ],
  sql: [
    { name: 'SQLBolt', description: 'Interactive SQL lessons with live exercises in the browser.', url: 'https://sqlbolt.com', focus: 'SQL fundamentals', difficulty: 'Beginner', problemCount: '18 lessons', isFree: true, rating: 4.9, bestFor: 'Learning SQL from scratch', emoji: '⚡' },
    { name: 'HackerRank SQL', description: 'SQL challenges from basic to advanced with rankings.', url: 'https://www.hackerrank.com/domains/sql', focus: 'SQL querying', difficulty: 'All Levels', problemCount: '58 challenges', isFree: true, rating: 4.7, bestFor: 'SQL interview preparation', emoji: '🏆' },
    { name: 'LeetCode SQL', description: 'Database problems on LeetCode with MySQL/PostgreSQL.', url: 'https://leetcode.com/problemset/database/', focus: 'SQL + Database', difficulty: 'All Levels', problemCount: '200+', isFree: true, rating: 4.8, bestFor: 'Data engineer/analyst interview prep', emoji: '🗄️' },
    { name: 'Mode SQL Tutorial', description: 'SQL practice on real datasets with analytics focus.', url: 'https://mode.com/sql-tutorial/', focus: 'Analytics SQL', difficulty: 'Intermediate', problemCount: '50+', isFree: true, rating: 4.6, bestFor: 'Data analyst role preparation', emoji: '📊' },
  ],
  python: [
    { name: 'LeetCode (Python)', description: 'Solve all LeetCode problems in Python.', url: 'https://leetcode.com/problemset/?language=Python3', focus: 'Algorithms', difficulty: 'All Levels', problemCount: '3000+', isFree: true, rating: 4.9, bestFor: 'Python algorithm interviews', emoji: '🐍' },
    { name: 'Exercism Python', description: 'Mentored practice with code review from real people.', url: 'https://exercism.org/tracks/python', focus: 'Python idioms', difficulty: 'Beginner', problemCount: '140+ exercises', isFree: true, rating: 4.8, bestFor: 'Writing idiomatic Python', emoji: '🎓' },
    { name: 'Codewars', description: 'Solve kata (challenges) and earn ranks.', url: 'https://www.codewars.com/?language=python', focus: 'General programming', difficulty: 'All Levels', problemCount: '9000+', isFree: true, rating: 4.6, bestFor: 'Daily practice in Python', emoji: '⚔️' },
  ],
  java: [
    { name: 'LeetCode (Java)', description: 'Java-specific LeetCode practice.', url: 'https://leetcode.com/problemset/?language=Java', focus: 'Algorithms', difficulty: 'All Levels', problemCount: '3000+', isFree: true, rating: 4.9, bestFor: 'Java interview preparation', emoji: '☕' },
    { name: 'CodingBat Java', description: 'Short, focused Java exercises on strings, arrays, logic.', url: 'https://codingbat.com/java', focus: 'Java fundamentals', difficulty: 'Beginner', problemCount: '200+', isFree: true, rating: 4.7, bestFor: 'Java beginners building muscle memory', emoji: '🏋️' },
    { name: 'Exercism Java', description: 'Java exercises with mentor code review.', url: 'https://exercism.org/tracks/java', focus: 'Java best practices', difficulty: 'Beginner', problemCount: '130+', isFree: true, rating: 4.7, bestFor: 'Learning clean Java code', emoji: '🎓' },
  ],
};

// Helper to get language key from slug
export const getLanguageKey = (slug: string, langName: string): string => {
  const slugMap: Record<string, string> = {
    python: 'python',
    java: 'java',
    'web-development': 'javascript',
    javascript: 'javascript',
    typescript: 'javascript',
    cpp: 'cpp',
    'data-science': 'sql',
    backend: 'javascript',
    devops: 'dsa',
    'machine-learning': 'python',
    'deep-learning': 'python',
    'cloud-computing': 'dsa',
    cybersecurity: 'dsa',
    react: 'javascript',
  };
  return slugMap[slug] || langName.toLowerCase();
};
