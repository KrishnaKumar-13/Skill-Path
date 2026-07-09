// ─── Personalized Roadmap Data ───────────────────────────────────────────────
// Each language × experience level produces a completely different roadmap.

export interface RoadmapPhase {
  title: string;
  description: string;
  topics: string[];
  duration: string;
  projectIdea: string;
}

export interface PersonalizedRoadmap {
  duration: string;
  phases: RoadmapPhase[];
  skipNote?: string;
}

type ExperienceLevel = 'beginner' | 'basic' | 'intermediate' | 'advanced';
type LanguageSlug = string;

// ─── Python ──────────────────────────────────────────────────────────────────
const pythonRoadmaps: Record<ExperienceLevel, PersonalizedRoadmap> = {
  beginner: {
    duration: '6–8 months',
    phases: [
      {
        title: '🌱 Getting Started',
        description: 'Install Python, understand how code runs, write your first program.',
        topics: ['Installation & Setup', 'print() & input()', 'Variables', 'Data Types (int, str, float, bool)'],
        duration: '2–3 weeks',
        projectIdea: 'Hello World with your name',
      },
      {
        title: '🧱 Core Building Blocks',
        description: 'Master control flow — the backbone of every program.',
        topics: ['Operators', 'if/elif/else', 'for loops', 'while loops', 'break/continue'],
        duration: '3–4 weeks',
        projectIdea: 'Number guessing game',
      },
      {
        title: '📦 Functions & Data Structures',
        description: 'Organize code with functions and work with collections of data.',
        topics: ['Functions & parameters', 'Lists', 'Tuples', 'Dictionaries', 'Sets', 'String methods'],
        duration: '3–4 weeks',
        projectIdea: 'Simple calculator',
      },
      {
        title: '📁 Files & Error Handling',
        description: 'Make programs that persist data and handle problems gracefully.',
        topics: ['File I/O (read/write)', 'try/except', 'Exceptions', 'Modules & imports'],
        duration: '2–3 weeks',
        projectIdea: 'Todo list saved to a text file',
      },
      {
        title: '🚀 First Real Projects',
        description: 'Combine everything into complete mini-applications.',
        topics: ['Project planning', 'Code organization', 'Debugging', 'pip & virtual environments'],
        duration: '4–6 weeks',
        projectIdea: 'Weather app using an API',
      },
    ],
  },

  basic: {
    duration: '4–5 months',
    skipNote: 'Skipping beginner syntax — starting from OOP and beyond.',
    phases: [
      {
        title: '🏗️ Object-Oriented Python',
        description: 'Model real-world problems using classes and objects.',
        topics: ['Classes & Objects', '__init__ & self', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Magic methods (__str__, __len__)'],
        duration: '3–4 weeks',
        projectIdea: 'Bank account system with OOP',
      },
      {
        title: '⚡ Advanced Python Features',
        description: 'Write Pythonic, efficient code using advanced language features.',
        topics: ['List comprehensions', 'Generators & yield', 'Decorators', 'Context managers', 'Lambda functions', 'map/filter/reduce'],
        duration: '3 weeks',
        projectIdea: 'Data pipeline script',
      },
      {
        title: '📊 Data & APIs',
        description: 'Work with external data sources and web APIs.',
        topics: ['requests library', 'JSON handling', 'pandas basics', 'CSV processing', 'REST APIs'],
        duration: '3–4 weeks',
        projectIdea: 'Stock price tracker',
      },
      {
        title: '🧪 Testing & Best Practices',
        description: 'Write reliable, maintainable code like a professional.',
        topics: ['unittest & pytest', 'Test-driven development', 'Code documentation', 'Type hints', 'Virtual environments'],
        duration: '2–3 weeks',
        projectIdea: 'CLI tool with full test coverage',
      },
    ],
  },

  intermediate: {
    duration: '2–3 months',
    skipNote: 'Skipping basics and OOP — diving into advanced Python and real-world applications.',
    phases: [
      {
        title: '🔬 Advanced OOP & Design Patterns',
        description: 'Master professional software design patterns.',
        topics: ['SOLID principles', 'Factory pattern', 'Singleton', 'Observer', 'Strategy pattern', 'Mixins'],
        duration: '2–3 weeks',
        projectIdea: 'Plugin architecture system',
      },
      {
        title: '⚡ Concurrency & Performance',
        description: 'Write programs that do multiple things at once and run fast.',
        topics: ['Threading vs Multiprocessing', 'asyncio', 'async/await', 'GIL explained', 'Profiling with cProfile'],
        duration: '2–3 weeks',
        projectIdea: 'Async web scraper',
      },
      {
        title: '🌐 Web Development with FastAPI',
        description: 'Build production-ready REST APIs.',
        topics: ['FastAPI', 'SQLAlchemy ORM', 'Pydantic models', 'JWT auth', 'Docker basics', 'PostgreSQL'],
        duration: '4 weeks',
        projectIdea: 'Full REST API with authentication',
      },
      {
        title: '🤖 ML/AI Foundations',
        description: 'Apply Python to machine learning problems.',
        topics: ['numpy & pandas', 'scikit-learn', 'Data visualization', 'Linear regression', 'Model evaluation'],
        duration: '3–4 weeks',
        projectIdea: 'Salary prediction model',
      },
    ],
  },

  advanced: {
    duration: '4–6 weeks',
    skipNote: 'Skipping almost everything — focusing on senior-level topics and interview prep.',
    phases: [
      {
        title: '🏛️ System Design & Architecture',
        description: 'Design scalable, production-grade systems.',
        topics: ['Microservices vs Monolith', 'Event-driven architecture', 'Message queues (Kafka)', 'Caching strategies', 'Rate limiting', 'Database sharding'],
        duration: '1–2 weeks',
        projectIdea: 'System design document for a URL shortener',
      },
      {
        title: '⚙️ CPython Internals & Performance',
        description: 'Understand Python at the interpreter level.',
        topics: ['CPython source', 'Bytecode & dis module', 'Memory management', 'C extensions', 'Cython & Numba', 'Profiling & optimization'],
        duration: '1 week',
        projectIdea: 'Write a C extension for a hot path',
      },
      {
        title: '🧪 Production Engineering',
        description: 'Deploy and maintain Python apps at scale.',
        topics: ['CI/CD pipelines', 'Docker & Kubernetes', 'Observability (logging, metrics, traces)', 'Feature flags', 'Zero-downtime deploys'],
        duration: '1–2 weeks',
        projectIdea: 'Fully deployed microservice with observability',
      },
      {
        title: '🎯 Interview Mastery',
        description: 'Senior-level interview preparation.',
        topics: ['LC Hard problems', 'Behavioral questions', 'System design interviews', 'Code review practice', 'Open source contributions'],
        duration: '1 week',
        projectIdea: 'Contribute to a popular Python open source project',
      },
    ],
  },
};

// ─── Java ─────────────────────────────────────────────────────────────────────
const javaRoadmaps: Record<ExperienceLevel, PersonalizedRoadmap> = {
  beginner: {
    duration: '7–9 months',
    phases: [
      { title: '☕ Java Basics', description: 'JDK setup, first programs, understanding the JVM.', topics: ['JDK installation', 'Hello World', 'Variables & types', 'Operators', 'Scanner input'], duration: '2–3 weeks', projectIdea: 'Simple calculator' },
      { title: '🔁 Control Flow', description: 'Make decisions and repeat actions.', topics: ['if/else', 'switch', 'for/while/do-while', 'break/continue', 'Arrays'], duration: '3 weeks', projectIdea: 'Number guessing game' },
      { title: '🏗️ Object-Oriented Basics', description: 'Core OOP — the heart of Java.', topics: ['Classes & Objects', 'Constructors', 'this keyword', 'Inheritance', 'super', 'Polymorphism', 'Interfaces', 'Abstract classes'], duration: '4 weeks', projectIdea: 'Library book management' },
      { title: '📚 Java Collections', description: 'Work with the Java Collections Framework.', topics: ['ArrayList', 'LinkedList', 'HashMap', 'HashSet', 'Iterator', 'Collections utility class'], duration: '3 weeks', projectIdea: 'Student grade tracker' },
      { title: '⚠️ Exceptions & I/O', description: 'Handle errors and work with files.', topics: ['try/catch/finally', 'Custom exceptions', 'File reading/writing', 'BufferedReader', 'Scanner'], duration: '2 weeks', projectIdea: 'Contact book with file storage' },
    ],
  },
  basic: {
    duration: '4–5 months',
    skipNote: 'Skipping Java syntax basics — starting from advanced OOP.',
    phases: [
      { title: '🔬 Advanced OOP', description: 'Master Java generics, lambdas, and streams.', topics: ['Generics', 'Comparable & Comparator', 'Lambda expressions', 'Functional interfaces', 'Stream API', 'Optional'], duration: '3–4 weeks', projectIdea: 'Data processing pipeline' },
      { title: '🧵 Concurrency', description: 'Multi-threaded Java programming.', topics: ['Thread class & Runnable', 'synchronized', 'ExecutorService', 'Future & CompletableFuture', 'volatile & atomic'], duration: '3 weeks', projectIdea: 'Parallel file processor' },
      { title: '🗄️ JDBC & Databases', description: 'Connect Java to databases.', topics: ['JDBC API', 'PreparedStatement', 'ResultSet', 'Connection pooling (HikariCP)', 'Transactions'], duration: '2–3 weeks', projectIdea: 'Employee CRUD with MySQL' },
      { title: '🌐 Spring Boot Basics', description: 'Build REST APIs with Spring Boot.', topics: ['Spring Boot setup', '@RestController', '@GetMapping/@PostMapping', 'Spring Data JPA', 'application.properties'], duration: '4 weeks', projectIdea: 'Student REST API' },
    ],
  },
  intermediate: {
    duration: '2–3 months',
    skipNote: 'Skipping basics and standard OOP — focusing on enterprise Spring and microservices.',
    phases: [
      { title: '🏛️ Enterprise Spring', description: 'Full Spring Boot with security and testing.', topics: ['Spring Security', 'JWT authentication', 'Spring Data JPA advanced', 'Hibernate tuning', 'Spring profiles', 'Spring AOP'], duration: '4 weeks', projectIdea: 'Full auth REST API' },
      { title: '☁️ Microservices', description: 'Build distributed Java services.', topics: ['Spring Cloud', 'Service discovery (Eureka)', 'API Gateway', 'Config server', 'Feign clients', 'Circuit breaker (Resilience4j)'], duration: '3 weeks', projectIdea: 'Microservice e-commerce system' },
      { title: '⚡ Performance & JVM', description: 'Tune and optimize Java applications.', topics: ['JVM internals', 'GC tuning', 'JProfiler', 'Virtual threads (Java 21)', 'GraalVM native image'], duration: '2 weeks', projectIdea: 'Benchmark before/after optimization' },
    ],
  },
  advanced: {
    duration: '3–5 weeks',
    skipNote: 'Senior-level focus: system design, distributed systems, interview prep.',
    phases: [
      { title: '🏗️ Distributed Systems Design', description: 'Design Java-based distributed systems.', topics: ['CAP theorem', 'Event sourcing', 'CQRS', 'Saga pattern', 'Kafka integration', 'gRPC'], duration: '1–2 weeks', projectIdea: 'Event-driven order system design' },
      { title: '🔐 Security & Compliance', description: 'Production-grade security.', topics: ['OAuth2 / OIDC', 'OWASP Top 10', 'SQL injection prevention', 'Rate limiting', 'Secrets management'], duration: '1 week', projectIdea: 'Security audit of existing Spring Boot app' },
      { title: '🎯 Interview Prep', description: 'Target senior Java/Spring interviews.', topics: ['LeetCode Hard (Java)', 'Spring Boot system design', 'Behavioral STAR', 'Java 17/21 features'], duration: '1 week', projectIdea: 'Mock interview sessions' },
    ],
  },
};

// ─── JavaScript ───────────────────────────────────────────────────────────────
const jsRoadmaps: Record<ExperienceLevel, PersonalizedRoadmap> = {
  beginner: {
    duration: '5–7 months',
    phases: [
      { title: '🌐 Web Foundations', description: 'HTML + CSS + basic JavaScript together.', topics: ['HTML structure', 'CSS styling', 'JS variables', 'Data types', 'Functions', 'DOM manipulation'], duration: '3 weeks', projectIdea: 'Personal profile webpage' },
      { title: '⚡ JavaScript Core', description: 'Deep dive into JavaScript language features.', topics: ['Arrays & objects', 'Loops', 'Events', 'Forms', 'Template literals', 'Scope & closures'], duration: '4 weeks', projectIdea: 'Interactive quiz game' },
      { title: '🔄 Async JavaScript', description: 'Handle asynchronous operations.', topics: ['Callbacks', 'Promises', 'async/await', 'fetch API', 'Error handling'], duration: '3 weeks', projectIdea: 'Weather app with live API' },
      { title: '📦 Modern JS & Tooling', description: 'Use ES6+ and modern development tools.', topics: ['ES6+ features', 'Modules (import/export)', 'npm', 'Webpack/Vite', 'ESLint'], duration: '2 weeks', projectIdea: 'Modular to-do app' },
    ],
  },
  basic: {
    duration: '4–5 months',
    skipNote: 'Skipping JS basics — starting from React and modern frameworks.',
    phases: [
      { title: '⚛️ React Fundamentals', description: 'Build UIs with React.', topics: ['JSX', 'Components', 'Props & state', 'Hooks (useState, useEffect)', 'Event handling', 'Conditional rendering'], duration: '4 weeks', projectIdea: 'Task manager app' },
      { title: '🔀 State Management & Routing', description: 'Scale React apps.', topics: ['React Router', 'Context API', 'useReducer', 'React Query / TanStack Query', 'Form handling'], duration: '3 weeks', projectIdea: 'Multi-page blog app' },
      { title: '🌐 Node.js & Express', description: 'JavaScript on the server.', topics: ['Node.js runtime', 'Express.js', 'REST APIs', 'Middleware', 'MongoDB with Mongoose'], duration: '4 weeks', projectIdea: 'Full-stack notes app' },
    ],
  },
  intermediate: {
    duration: '2–3 months',
    skipNote: 'Skipping React basics — focusing on Next.js, TypeScript, and production patterns.',
    phases: [
      { title: '🔷 TypeScript Mastery', description: 'Type-safe JavaScript at scale.', topics: ['Advanced types', 'Generics', 'Decorators', 'Mapped types', 'Conditional types', 'Declaration files'], duration: '2 weeks', projectIdea: 'Typed API client library' },
      { title: '⚡ Next.js & SSR', description: 'Full-stack React with Next.js.', topics: ['App router', 'Server components', 'Server actions', 'SSR vs SSG vs ISR', 'Edge runtime', 'Image optimization'], duration: '4 weeks', projectIdea: 'Full-stack e-commerce site' },
      { title: '🧪 Testing & Performance', description: 'Production-quality frontend code.', topics: ['Vitest', 'React Testing Library', 'Playwright e2e', 'Core Web Vitals', 'Bundle optimization', 'Lighthouse'], duration: '3 weeks', projectIdea: 'Add full test suite to existing project' },
    ],
  },
  advanced: {
    duration: '3–4 weeks',
    skipNote: 'Senior-level JavaScript: architecture, security, performance.',
    phases: [
      { title: '🏗️ Frontend Architecture', description: 'Scale large frontend applications.', topics: ['Micro-frontends', 'Module federation', 'Design systems', 'Monorepo (Nx/Turborepo)', 'Feature flags', 'A/B testing'], duration: '1–2 weeks', projectIdea: 'Design system documentation site' },
      { title: '🚀 Performance Engineering', description: 'Optimize for real-world users.', topics: ['V8 internals', 'Memory leaks', 'JS profiling', 'Web Workers', 'WASM integration', 'Streaming SSR'], duration: '1 week', projectIdea: 'Performance audit + fix report' },
      { title: '🎯 Senior Interview Prep', description: 'Target FAANG and top-tier companies.', topics: ['System design for frontend', 'JavaScript runtime internals', 'LC Hard', 'Architecture decisions'], duration: '1 week', projectIdea: 'Portfolio with case studies' },
    ],
  },
};

// ─── Master Lookup ────────────────────────────────────────────────────────────
const roadmapDatabase: Record<LanguageSlug, Partial<Record<ExperienceLevel, PersonalizedRoadmap>>> = {
  python: pythonRoadmaps,
  java: javaRoadmaps,
  javascript: jsRoadmaps,
  typescript: jsRoadmaps,  // TypeScript uses JS roadmap with TS overlay
  cpp: {
    beginner: {
      duration: '7–9 months',
      phases: [
        { title: '⚡ C++ Setup & Basics', description: 'Compile your first C++ program.', topics: ['g++ setup', 'cin/cout', 'Variables', 'Data types', 'Operators', 'Namespace std'], duration: '2 weeks', projectIdea: 'Simple calculator' },
        { title: '🔁 Control Flow & Functions', description: 'Master loops and functions.', topics: ['if/else', 'for/while', 'Functions', 'Pass by value vs reference', 'Overloading'], duration: '3 weeks', projectIdea: 'Number guessing game' },
        { title: '👉 Pointers & Memory', description: 'Understand the most important C++ concept.', topics: ['Pointers', 'Dynamic allocation (new/delete)', 'References', 'Memory leaks', 'Stack vs heap'], duration: '4 weeks', projectIdea: 'Linked list from scratch' },
        { title: '📦 STL & OOP', description: 'Use the Standard Template Library.', topics: ['vector', 'map', 'set', 'Classes', 'Inheritance', 'Templates'], duration: '4 weeks', projectIdea: 'Student grade system' },
      ],
    },
    basic: {
      duration: '4 months',
      skipNote: 'Skipping C++ basics — starting from STL and competitive programming.',
      phases: [
        { title: '⚡ Advanced STL', description: 'Master the full STL.', topics: ['priority_queue', 'deque', 'unordered_map', 'bitset', 'Iterators', 'Algorithm library'], duration: '3 weeks', projectIdea: 'LRU cache implementation' },
        { title: '🧠 Competitive Programming', description: 'Solve algorithmic problems efficiently.', topics: ['Time/space complexity', 'Binary search', 'Two pointers', 'Sliding window', 'Sorting algorithms'], duration: '4 weeks', projectIdea: '50 LeetCode problems solved' },
        { title: '🔧 Modern C++', description: 'C++17/20 features.', topics: ['Auto', 'Lambda expressions', 'Smart pointers', 'Move semantics', 'Range-based for'], duration: '3 weeks', projectIdea: 'Refactor old code to modern C++' },
      ],
    },
    intermediate: {
      duration: '2 months',
      skipNote: 'Skipping basics — focusing on systems programming and design patterns.',
      phases: [
        { title: '🏗️ Design Patterns in C++', description: 'Write professional C++ architecture.', topics: ['RAII', 'Factory', 'Observer', 'Strategy', 'Template method', 'CRTP'], duration: '3 weeks', projectIdea: 'Event system using Observer pattern' },
        { title: '⚡ Concurrency & Systems', description: 'Multi-threaded C++ programming.', topics: ['std::thread', 'mutex', 'condition_variable', 'atomic', 'Memory model', 'Lock-free data structures'], duration: '3 weeks', projectIdea: 'Thread-safe queue implementation' },
      ],
    },
    advanced: {
      duration: '3–4 weeks',
      skipNote: 'Targeting C++ systems engineer/FAANG roles.',
      phases: [
        { title: '🔬 C++ Internals', description: 'Deep C++ compiler knowledge.', topics: ['Virtual table', 'Name mangling', 'Template metaprogramming', 'Constexpr', 'Concepts (C++20)', 'Modules'], duration: '2 weeks', projectIdea: 'Custom allocator' },
        { title: '🎯 Interview Prep', description: 'Systems programming interviews.', topics: ['LC Hard in C++', 'OS concepts', 'Network programming', 'POSIX API', 'Memory-mapped files'], duration: '2 weeks', projectIdea: 'Implement a mini HTTP server' },
      ],
    },
  },
  'web-development': jsRoadmaps,
  backend: {
    beginner: {
      duration: '6 months',
      phases: [
        { title: '🌐 HTTP & Web Basics', description: 'Understand how the web works.', topics: ['HTTP/HTTPS', 'Request/Response cycle', 'Status codes', 'REST principles', 'JSON'], duration: '1 week', projectIdea: 'Map out a REST API design' },
        { title: '🟢 Node.js Foundations', description: 'Server-side JavaScript.', topics: ['Node.js runtime', 'Express.js', 'Routing', 'Middleware', 'Environment variables'], duration: '3 weeks', projectIdea: 'Hello World API' },
        { title: '🗄️ Databases', description: 'Store and retrieve data.', topics: ['SQL basics', 'PostgreSQL', 'Prisma ORM', 'CRUD operations', 'Relationships', 'Indexing'], duration: '4 weeks', projectIdea: 'Blog API with database' },
        { title: '🔐 Auth & Security', description: 'Secure your API.', topics: ['JWT tokens', 'Password hashing (bcrypt)', 'CORS', 'Rate limiting', 'Input validation'], duration: '3 weeks', projectIdea: 'Full auth system' },
      ],
    },
    basic: { duration: '3 months', phases: [{ title: '🚀 Advanced APIs', description: 'Build production-grade APIs.', topics: ['GraphQL', 'WebSockets', 'File uploads', 'Caching (Redis)', 'Queue systems', 'Background jobs'], duration: '6 weeks', projectIdea: 'Real-time chat API' }, { title: '☁️ Deployment', description: 'Deploy and scale your backend.', topics: ['Docker', 'CI/CD', 'Cloud platforms (AWS/GCP)', 'Nginx', 'SSL/TLS', 'Monitoring'], duration: '4 weeks', projectIdea: 'Deployed API with monitoring' }] },
    intermediate: { duration: '2 months', skipNote: 'Skipping basics.', phases: [{ title: '⚡ Microservices', description: 'Build distributed backend systems.', topics: ['Microservice patterns', 'gRPC', 'Message queues', 'Service mesh', 'API gateway'], duration: '4 weeks', projectIdea: 'Microservice order system' }, { title: '🏗️ System Design', description: 'Design scalable systems.', topics: ['Load balancing', 'DB replication', 'Sharding', 'Caching strategies', 'CDN'], duration: '4 weeks', projectIdea: 'System design document' }] },
    advanced: { duration: '3 weeks', skipNote: 'Senior backend focus.', phases: [{ title: '🎯 Senior Interview Prep', description: 'Backend system design interviews.', topics: ['Distributed systems', 'CAP theorem', 'ACID vs BASE', 'Consistency patterns'], duration: '3 weeks', projectIdea: 'Technical blog on chosen architecture' }] },
  },
};

// Default fallback roadmap for unlisted languages
const defaultRoadmap = (langName: string): Record<ExperienceLevel, PersonalizedRoadmap> => ({
  beginner: {
    duration: '5–6 months',
    phases: [
      { title: `🌱 ${langName} Fundamentals`, description: 'Core syntax and basic concepts.', topics: ['Setup & installation', 'Variables & types', 'Control flow', 'Functions', 'Basic data structures'], duration: '4 weeks', projectIdea: 'Simple command-line app' },
      { title: '📦 Intermediate Concepts', description: 'OOP, error handling, and file I/O.', topics: ['Object-oriented programming', 'Error handling', 'File I/O', 'Modules & packages', 'Standard library'], duration: '4 weeks', projectIdea: 'Personal organizer app' },
      { title: '🚀 Real Projects', description: 'Apply knowledge in real-world applications.', topics: ['Project architecture', 'Debugging', 'Third-party libraries', 'Version control'], duration: '4 weeks', projectIdea: 'Full mini-application' },
    ],
  },
  basic: { duration: '3–4 months', phases: [{ title: '🔬 Advanced Concepts', description: 'OOP, performance, advanced patterns.', topics: ['Advanced OOP', 'Design patterns', 'Performance optimization', 'Testing'], duration: '6 weeks', projectIdea: 'Advanced project' }, { title: '🚀 Production Projects', description: 'Build deployable applications.', topics: ['Deployment', 'CI/CD', 'Code review', 'Open source'], duration: '4 weeks', projectIdea: 'Deployed web app' }] },
  intermediate: { duration: '2 months', skipNote: 'Skipping basics.', phases: [{ title: '🏗️ Architecture', description: 'Design scalable software.', topics: ['System design', 'Design patterns', 'Performance', 'Security'], duration: '4 weeks', projectIdea: 'Large-scale project' }, { title: '🎯 Interview Prep', description: 'Prepare for senior roles.', topics: ['Algorithm practice', 'System design interviews', 'Behavioral prep'], duration: '4 weeks', projectIdea: 'Portfolio project' }] },
  advanced: { duration: '3 weeks', skipNote: 'Senior-level focus.', phases: [{ title: '🎯 Senior Prep', description: 'Interview and architecture mastery.', topics: ['System design', 'Performance engineering', 'Leadership', 'Open source'], duration: '3 weeks', projectIdea: 'Contribute to major open source project' }] },
});

/**
 * Get the personalized roadmap for a language + experience level.
 * Falls back to a sensible default if the exact combination isn't defined.
 */
export const getPersonalizedRoadmap = (
  langSlug: string,
  experience: ExperienceLevel
): PersonalizedRoadmap => {
  const langData = roadmapDatabase[langSlug.toLowerCase()] || defaultRoadmap(langSlug);
  return langData[experience] || defaultRoadmap(langSlug)[experience];
};

export type { ExperienceLevel };
