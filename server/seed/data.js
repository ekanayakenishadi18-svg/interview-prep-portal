// Sample content loaded by seed.js. Edit or extend freely.

const users = [
  { name: 'Portal Admin', email: 'admin@prep.dev', password: 'Admin@123', role: 'admin', targetRole: 'Platform administrator' },
  { name: 'Demo Student', email: 'student@prep.dev', password: 'Student@123', targetRole: 'Software Engineer Intern', bio: 'Final-year engineering undergraduate preparing for internship interviews.' },
  { name: 'Kavindi Perera', email: 'kavindi@prep.dev', password: 'Student@123', targetRole: 'Associate Software Engineer' },
];

const questions = [
  // ---------- Data Structures & Algorithms ----------
  {
    title: 'What is the difference between an array and a linked list?',
    category: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    tags: ['arrays', 'linked-list'],
    answer: `An array stores elements in one contiguous block of memory, so any element can be read by index in O(1) time. Its size is fixed (or needs costly resizing), and inserting or deleting in the middle is O(n) because elements must shift.

A linked list stores each element in a separate node that points to the next node. Inserting or deleting is O(1) once you hold a reference to the position, and the list grows easily. However, reaching the k-th element is O(n) because you must walk the list, and each node uses extra memory for the pointer.

Use an array when you need fast random access; use a linked list when you insert and remove often and mostly traverse sequentially.`,
  },
  {
    title: 'How does a hash table handle collisions?',
    category: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    tags: ['hashing', 'hash-table'],
    answer: `A collision happens when two keys hash to the same bucket. The two common strategies are:

1. Separate chaining: each bucket holds a list (or tree) of entries. Colliding keys are appended to that list, and lookup searches the list.
2. Open addressing: all entries live in the array itself. On a collision you probe for another slot using linear probing, quadratic probing or double hashing.

To keep operations close to O(1), the table tracks its load factor (entries / buckets) and resizes and rehashes when it passes a threshold such as 0.75. A good hash function that spreads keys evenly also reduces collisions.`,
  },
  {
    title: 'How would you detect a cycle in a linked list?',
    category: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    tags: ['linked-list', 'two-pointers'],
    company: 'Common in campus interviews',
    answer: `Use Floyd's cycle-finding algorithm (the tortoise and hare). Start two pointers at the head. Move "slow" one node at a time and "fast" two nodes at a time.

- If fast reaches null, the list has no cycle.
- If slow and fast ever point to the same node, there is a cycle.

This runs in O(n) time and O(1) extra space. To find where the cycle starts, reset one pointer to the head and move both one step at a time; they meet at the start of the cycle.

An alternative is to store visited nodes in a hash set, which is simpler but uses O(n) memory.`,
  },
  {
    title: 'What is the time complexity of quicksort, and when does it degrade?',
    category: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    tags: ['sorting', 'complexity'],
    answer: `Quicksort runs in O(n log n) on average: each partition step is O(n) and a good pivot splits the array roughly in half, giving about log n levels.

The worst case is O(n^2). It happens when the pivot is repeatedly the smallest or largest element, for example choosing the first element as pivot on an already-sorted array. Then each partition only removes one element.

Ways to avoid it: pick a random pivot, use median-of-three, or switch to heapsort when recursion gets too deep (introsort). Quicksort sorts in place and uses O(log n) stack space on average, but it is not stable.`,
  },

  // ---------- Object-Oriented Programming ----------
  {
    title: 'Explain the four pillars of object-oriented programming.',
    category: 'Object-Oriented Programming',
    difficulty: 'Easy',
    tags: ['oop', 'fundamentals'],
    answer: `1. Encapsulation: bundling data and the methods that act on it inside a class, and hiding internal state behind a public interface (for example, private fields with getters and setters).
2. Abstraction: exposing only what a user of the class needs and hiding the implementation details, often through abstract classes or interfaces.
3. Inheritance: a class can reuse and extend another class's fields and behaviour, forming an "is-a" relationship (a Car is a Vehicle).
4. Polymorphism: the same call can behave differently depending on the object's actual type, through method overriding (runtime) or overloading (compile time).

A strong answer gives a short example for each, ideally from a project you built.`,
  },
  {
    title: 'What is the difference between an abstract class and an interface?',
    category: 'Object-Oriented Programming',
    difficulty: 'Medium',
    tags: ['oop', 'java', 'interfaces'],
    answer: `An abstract class can have fields, constructors, and both abstract and concrete methods. A class can extend only one abstract class. Use it when related classes share state or common code.

An interface defines a contract: the methods a class promises to implement. A class can implement many interfaces. In Java 8+, interfaces can also have default and static methods, but they cannot hold instance state.

Rule of thumb: use an abstract class for an "is-a" relationship with shared implementation, and an interface for a capability that unrelated classes can share (for example Comparable or Serializable).`,
  },
  {
    title: 'What is the difference between method overloading and method overriding?',
    category: 'Object-Oriented Programming',
    difficulty: 'Easy',
    tags: ['oop', 'polymorphism'],
    answer: `Overloading means defining several methods with the same name in the same class but different parameter lists (number or types of parameters). The compiler picks the right one at compile time, so it is compile-time polymorphism.

Overriding means a subclass provides its own implementation of a method that already exists in its parent class, with the same name, parameters and compatible return type. Which version runs is decided at runtime based on the object's actual type, so it is runtime polymorphism.`,
  },

  // ---------- Database Systems ----------
  {
    title: 'What are the ACID properties of a database transaction?',
    category: 'Database Systems',
    difficulty: 'Easy',
    tags: ['transactions', 'acid'],
    answer: `- Atomicity: a transaction completes fully or not at all. If any step fails, all changes are rolled back.
- Consistency: a transaction moves the database from one valid state to another, respecting all constraints.
- Isolation: concurrent transactions do not see each other's partial work; the result is as if they ran one after another (to the degree set by the isolation level).
- Durability: once committed, changes survive crashes, usually because they are written to a log on disk.

Example: a bank transfer must debit one account and credit another as one atomic unit.`,
  },
  {
    title: 'Explain database normalization up to Third Normal Form (3NF).',
    category: 'Database Systems',
    difficulty: 'Medium',
    tags: ['normalization', 'sql'],
    answer: `Normalization organizes tables to reduce redundancy and update anomalies.

- 1NF: every column holds atomic values and there are no repeating groups.
- 2NF: the table is in 1NF and every non-key column depends on the whole primary key, not part of a composite key (no partial dependency).
- 3NF: the table is in 2NF and no non-key column depends on another non-key column (no transitive dependency).

Example: if an Orders table stores customer_city alongside customer_id, the city depends on the customer, not the order. Moving customer details into a Customers table brings it to 3NF.`,
  },
  {
    title: 'What is the difference between INNER JOIN and LEFT JOIN?',
    category: 'Database Systems',
    difficulty: 'Easy',
    tags: ['sql', 'joins'],
    answer: `INNER JOIN returns only the rows that have a match in both tables.

LEFT JOIN (LEFT OUTER JOIN) returns every row from the left table, plus matching rows from the right table. Where there is no match, the right table's columns are NULL.

Example: Students LEFT JOIN Enrollments lists every student, including those not enrolled in any course; an INNER JOIN would leave those students out.`,
  },
  {
    title: 'When would you choose a NoSQL database like MongoDB over a relational database?',
    category: 'Database Systems',
    difficulty: 'Medium',
    tags: ['mongodb', 'nosql', 'design'],
    answer: `Choose a document database such as MongoDB when:
- the data is naturally hierarchical or varies between records, so a flexible schema helps;
- you read and write whole objects together (embedding avoids joins);
- you need to scale horizontally across many servers with sharding.

Prefer a relational database when the data is highly related, you rely on complex joins and reporting, or you need strict multi-table transactions and constraints (banking, inventory).

In this portal, questions and quizzes with embedded MCQs fit documents well. Modern MongoDB also supports multi-document transactions, so the choice is about data shape and access patterns more than features.`,
  },

  // ---------- Operating Systems ----------
  {
    title: 'What is the difference between a process and a thread?',
    category: 'Operating Systems',
    difficulty: 'Easy',
    tags: ['processes', 'threads', 'concurrency'],
    answer: `A process is an independent program in execution with its own address space, file handles and resources. Processes are isolated, so one crashing does not usually affect another, but creating them and switching between them is relatively expensive.

A thread is a unit of execution inside a process. Threads of the same process share memory and resources but each has its own stack and registers. They are cheaper to create and switch, and communicate easily through shared memory, but that sharing needs synchronization (locks, semaphores) to avoid race conditions.`,
  },
  {
    title: 'What is a deadlock, and what are the four conditions that cause it?',
    category: 'Operating Systems',
    difficulty: 'Medium',
    tags: ['deadlock', 'concurrency'],
    answer: `A deadlock is when a set of processes are each waiting for a resource held by another process in the set, so none can continue.

All four Coffman conditions must hold at once:
1. Mutual exclusion: a resource can be held by only one process at a time.
2. Hold and wait: a process holds one resource while waiting for another.
3. No preemption: resources cannot be forcibly taken away.
4. Circular wait: a cycle of processes, each waiting on the next.

Breaking any one prevents deadlock, for example by always acquiring locks in a fixed global order (removes circular wait). Other approaches are avoidance (Banker's algorithm) and detection with recovery.`,
  },
  {
    title: 'Explain virtual memory and paging.',
    category: 'Operating Systems',
    difficulty: 'Hard',
    tags: ['memory', 'paging'],
    answer: `Virtual memory gives each process the illusion of a large, private, contiguous address space, independent of how much physical RAM exists.

With paging, virtual memory is split into fixed-size pages and physical memory into frames of the same size. A per-process page table maps pages to frames. The MMU translates each address, and a TLB caches recent translations to keep this fast.

If a process touches a page that is not in RAM, a page fault occurs: the OS loads the page from disk, possibly evicting another page using a replacement policy such as LRU or Clock. Benefits are isolation between processes, running programs larger than RAM, and efficient sharing. The risk is thrashing when the working set does not fit in memory.`,
  },

  // ---------- Computer Networks ----------
  {
    title: 'What happens when you type a URL into the browser and press Enter?',
    category: 'Computer Networks',
    difficulty: 'Medium',
    tags: ['dns', 'http', 'tcp'],
    company: 'Classic open-ended question',
    answer: `1. The browser parses the URL and checks its caches.
2. DNS resolution turns the domain into an IP address (browser cache, OS cache, resolver, then root, TLD and authoritative servers).
3. The browser opens a TCP connection to the server (three-way handshake), and for HTTPS performs a TLS handshake to agree on encryption keys.
4. It sends an HTTP request (for example GET /index.html with headers and cookies).
5. The server, often behind a load balancer, processes the request and returns a response with a status code, headers and body.
6. The browser parses the HTML, builds the DOM and CSSOM, fetches CSS, JS and images, runs JavaScript, and renders the page.

Go deeper on whichever layer the interviewer seems interested in.`,
  },
  {
    title: 'What is the difference between TCP and UDP?',
    category: 'Computer Networks',
    difficulty: 'Easy',
    tags: ['tcp', 'udp', 'transport-layer'],
    answer: `TCP is connection-oriented and reliable. It sets up a connection with a handshake, guarantees in-order delivery, retransmits lost packets, and provides flow and congestion control. It suits web pages, email and file transfer.

UDP is connectionless. It sends independent datagrams with no delivery or ordering guarantees, so it has lower overhead and latency. It suits real-time traffic such as video calls, online games, DNS lookups and streaming, where speed matters more than perfect delivery.`,
  },
  {
    title: 'Explain the TCP three-way handshake.',
    category: 'Computer Networks',
    difficulty: 'Medium',
    tags: ['tcp', 'handshake'],
    answer: `1. SYN: the client sends a segment with the SYN flag and its initial sequence number (x).
2. SYN-ACK: the server replies with SYN and ACK flags, its own sequence number (y), and acknowledgement number x + 1.
3. ACK: the client sends ACK with acknowledgement number y + 1.

Both sides now know the other is reachable and have synchronized sequence numbers, so the connection is established. Closing uses a four-step FIN / ACK exchange.`,
  },

  // ---------- Web Development ----------
  {
    title: 'What is the difference between var, let and const in JavaScript?',
    category: 'Web Development',
    difficulty: 'Easy',
    tags: ['javascript', 'scope'],
    answer: `- var is function-scoped, can be redeclared, and is hoisted and initialized as undefined, so it can be used before its declaration line.
- let is block-scoped, cannot be redeclared in the same scope, and is in the "temporal dead zone" until its declaration runs.
- const is block-scoped like let, but the binding cannot be reassigned. The value itself can still change if it is an object or array.

Modern code uses const by default and let when reassignment is needed, and avoids var.`,
  },
  {
    title: 'Explain the JavaScript event loop.',
    category: 'Web Development',
    difficulty: 'Hard',
    tags: ['javascript', 'async', 'event-loop'],
    answer: `JavaScript runs on a single thread with one call stack. Long-running work such as timers, network requests and file I/O is handled by the browser or Node.js runtime, which queues a callback when the work finishes.

The event loop repeatedly:
1. runs everything on the call stack until it is empty;
2. drains the microtask queue (resolved Promise callbacks, queueMicrotask);
3. takes one task from the macrotask queue (setTimeout, I/O, UI events) and runs it, then repeats.

That is why console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D') prints A, D, C, B.`,
  },
  {
    title: 'What is the virtual DOM in React and why is it useful?',
    category: 'Web Development',
    difficulty: 'Medium',
    tags: ['react', 'virtual-dom'],
    answer: `The virtual DOM is a lightweight JavaScript representation of the UI. When state changes, React re-renders components into a new virtual tree, compares it with the previous one (reconciliation, or "diffing"), and applies only the minimal set of changes to the real DOM.

Benefits: you write declarative UI ("given this state, the screen looks like this") without manual DOM manipulation, and React batches updates. Keys on list items help React match elements between renders, which is why they must be stable and unique.`,
  },
  {
    title: 'How does JWT-based authentication work?',
    category: 'Web Development',
    difficulty: 'Medium',
    tags: ['jwt', 'authentication', 'security'],
    answer: `1. The user logs in with credentials. The server verifies them and signs a JSON Web Token containing claims such as the user id and an expiry time.
2. The client stores the token and sends it with each request, usually in the header Authorization: Bearer <token>.
3. The server verifies the signature with its secret key. If it is valid and not expired, it trusts the claims without a session lookup.

A JWT has three base64url parts: header, payload and signature. The payload is encoded, not encrypted, so never put secrets in it. Keep expiry short, always use HTTPS, and consider refresh tokens and httpOnly cookies to reduce XSS risk. This portal uses JWTs for its own login.`,
  },

  // ---------- System Design ----------
  {
    title: 'How would you design a URL shortener?',
    category: 'System Design',
    difficulty: 'Hard',
    tags: ['system-design', 'scalability'],
    answer: `1. Requirements: create a short code for a long URL, redirect quickly, optional custom aliases and expiry. Reads far outnumber writes.
2. API: POST /shorten { url } returns { code }; GET /{code} returns a 301 or 302 redirect.
3. Code generation: base62-encode an auto-incrementing id or a distributed unique id (7 characters give about 3.5 trillion codes), or hash the URL and handle collisions.
4. Storage: a key-value or document store mapping code to URL, created time and expiry.
5. Scale: put a cache (Redis) in front for hot codes, run stateless app servers behind a load balancer, and use a CDN or edge redirects.
6. Extras: rate limiting to stop abuse, and async click analytics through a queue.

Talk through trade-offs, such as 301 (cached by browsers, fewer analytics) versus 302.`,
  },
  {
    title: 'What is the difference between horizontal and vertical scaling?',
    category: 'System Design',
    difficulty: 'Easy',
    tags: ['scalability'],
    answer: `Vertical scaling (scaling up) means giving one machine more CPU, RAM or faster disks. It is simple and needs no code changes, but has a hardware ceiling and leaves a single point of failure.

Horizontal scaling (scaling out) means adding more machines and spreading load with a load balancer. It scales much further and improves availability, but the application must be stateless or share state externally, and data may need replication or sharding.`,
  },
  {
    title: 'What is caching, and where can it be applied in a web application?',
    category: 'System Design',
    difficulty: 'Medium',
    tags: ['caching', 'performance'],
    answer: `Caching stores the result of expensive work so later requests can be served faster.

Layers where it applies:
- Browser cache, controlled by Cache-Control and ETag headers.
- CDN, for static assets close to users.
- Application cache such as Redis or Memcached, for database query results or sessions.
- Database caches, buffer pools and query caches.

Main challenges are invalidation (stale data) and choosing an eviction policy such as LRU. Patterns include cache-aside, write-through and write-back, often with a TTL.`,
  },

  // ---------- HR & Behavioral ----------
  {
    title: 'Tell me about yourself.',
    category: 'HR & Behavioral',
    difficulty: 'Easy',
    tags: ['introduction', 'hr'],
    answer: `Keep it to about 60-90 seconds using a present-past-future structure:
- Present: who you are now, for example "I'm a final-year computer engineering student."
- Past: two or three highlights relevant to the role, such as a project you led, an internship, or a technology you know well. Mention one concrete result.
- Future: why this role and company fit what you want to do next.

Avoid repeating your whole CV or sharing personal details unrelated to the job. Practise it out loud until it sounds natural rather than memorised.`,
  },
  {
    title: 'Describe a time you faced a conflict in a team project. How did you handle it?',
    category: 'HR & Behavioral',
    difficulty: 'Medium',
    tags: ['star', 'teamwork', 'behavioral'],
    answer: `Answer with the STAR method:
- Situation: the project and context, briefly.
- Task: what you were responsible for.
- Action: what you specifically did. Listened to both sides, focused on the shared goal, proposed a compromise or used data to decide, and kept communication respectful.
- Result: the outcome, ideally measurable, and what you learned.

Choose a real example where the conflict was about work (approach, deadlines, workload), not personalities, and where you come across as constructive, not as the person who "won".`,
  },
  {
    title: 'Where do you see yourself in five years?',
    category: 'HR & Behavioral',
    difficulty: 'Easy',
    tags: ['career-goals', 'hr'],
    answer: `The interviewer wants to know whether your goals fit the role and whether you are likely to stay and grow. Give a realistic, role-related answer: for example, becoming a strong engineer in the company's domain, taking ownership of larger features, and mentoring newer team members.

Show ambition tied to learning and contribution, not to a specific title. Avoid answers that suggest you will leave soon, such as plans to start a business or study abroad next year.`,
  },
  {
    title: 'What is your greatest weakness?',
    category: 'HR & Behavioral',
    difficulty: 'Medium',
    tags: ['self-awareness', 'hr'],
    answer: `Pick a real but manageable weakness that is not central to the job, then show what you are doing about it. For example: "I used to find it hard to estimate how long tasks would take, so I started breaking work into smaller tasks and tracking my estimates against actual time. My estimates on my last project were much closer."

Avoid disguised strengths like "I work too hard", and avoid weaknesses that rule you out for the role.`,
  },
];

const quizzes = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Scope, types, async behaviour and common gotchas that come up in web developer interviews.',
    category: 'Web Development',
    difficulty: 'Easy',
    timeLimit: 6,
    questions: [
      {
        question: 'What does typeof null return in JavaScript?',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctIndex: 1,
        explanation: 'typeof null returns "object". This is a long-standing quirk kept for backward compatibility.',
      },
      {
        question: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
        options: ['var', 'let', 'const', 'static'],
        correctIndex: 2,
        explanation: 'const is block-scoped and its binding cannot be reassigned. let is block-scoped but can be reassigned.',
      },
      {
        question: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?',
        options: ['true', 'false', 'TypeError', 'undefined'],
        correctIndex: 1,
        explanation: 'Floating-point rounding makes 0.1 + 0.2 equal 0.30000000000000004, so the comparison is false.',
      },
      {
        question: 'Which runs first: a resolved Promise .then callback or a setTimeout(fn, 0) callback?',
        options: ['setTimeout callback', 'Promise callback', 'They run at the same time', 'It depends on the browser'],
        correctIndex: 1,
        explanation: 'Promise callbacks are microtasks, which run before the next macrotask such as a setTimeout callback.',
      },
      {
        question: 'What does the === operator check?',
        options: ['Value only', 'Type only', 'Value and type, without type coercion', 'Memory address only'],
        correctIndex: 2,
        explanation: '=== is strict equality: both the type and value must match and no coercion happens.',
      },
    ],
  },
  {
    title: 'Data Structures Basics',
    description: 'Time complexity and choosing the right data structure.',
    category: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    timeLimit: 8,
    questions: [
      {
        question: 'What is the average time complexity of searching in a balanced binary search tree?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'A balanced BST halves the search space at each level, giving O(log n).',
      },
      {
        question: 'Which data structure follows Last In, First Out (LIFO)?',
        options: ['Queue', 'Stack', 'Heap', 'Hash table'],
        correctIndex: 1,
        explanation: 'A stack removes the most recently added element first.',
      },
      {
        question: 'Which data structure is best for implementing a priority queue?',
        options: ['Linked list', 'Binary heap', 'Stack', 'Array sorted after every insert'],
        correctIndex: 1,
        explanation: 'A binary heap gives O(log n) insert and extract-min/max, with O(1) peek.',
      },
      {
        question: 'Breadth-first search on a graph typically uses which structure?',
        options: ['Stack', 'Queue', 'Priority queue', 'Set only'],
        correctIndex: 1,
        explanation: 'BFS explores level by level, processing nodes in the order they were discovered, which is a queue.',
      },
      {
        question: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'],
        correctIndex: 2,
        explanation: 'With consistently bad pivots, such as on sorted input with a first-element pivot, quicksort degrades to O(n^2).',
      },
    ],
  },
  {
    title: 'DBMS and SQL Essentials',
    description: 'Transactions, keys, joins and normalization.',
    category: 'Database Systems',
    difficulty: 'Medium',
    timeLimit: 8,
    questions: [
      {
        question: 'Which ACID property guarantees that a committed transaction survives a system crash?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctIndex: 3,
        explanation: 'Durability means committed changes are permanently recorded, typically through a write-ahead log.',
      },
      {
        question: 'A LEFT JOIN returns:',
        options: [
          'Only rows that match in both tables',
          'All rows from the left table and matching rows from the right table',
          'All rows from both tables',
          'Only rows that do not match',
        ],
        correctIndex: 1,
        explanation: 'Unmatched rows from the left table still appear, with NULLs for the right table columns.',
      },
      {
        question: 'A table is in 3NF if it is in 2NF and has no:',
        options: ['Primary key', 'Partial dependencies', 'Transitive dependencies', 'Foreign keys'],
        correctIndex: 2,
        explanation: '3NF removes transitive dependencies, where a non-key column depends on another non-key column.',
      },
      {
        question: 'Which SQL clause filters groups after aggregation?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
        correctIndex: 1,
        explanation: 'WHERE filters rows before grouping; HAVING filters groups after aggregate functions are applied.',
      },
      {
        question: 'What does an index mainly improve?',
        options: ['Write speed', 'Read and lookup speed', 'Storage space', 'Data integrity'],
        correctIndex: 1,
        explanation: 'Indexes speed up lookups and range queries, at the cost of extra storage and slower writes.',
      },
    ],
  },
  {
    title: 'Operating Systems Concepts',
    description: 'Processes, scheduling, memory and deadlocks.',
    category: 'Operating Systems',
    difficulty: 'Hard',
    timeLimit: 10,
    questions: [
      {
        question: 'Which of the following is NOT one of the four necessary conditions for deadlock?',
        options: ['Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait'],
        correctIndex: 2,
        explanation: 'The condition is "no preemption". Allowing preemption is one way to prevent deadlock.',
      },
      {
        question: 'What do threads of the same process share?',
        options: ['Stack', 'Registers', 'Heap memory and open files', 'Program counter'],
        correctIndex: 2,
        explanation: 'Threads share the address space (code, heap, globals) and resources; each has its own stack, registers and program counter.',
      },
      {
        question: 'What is the role of the TLB?',
        options: [
          'Schedule processes on the CPU',
          'Cache recent virtual-to-physical address translations',
          'Store files on disk',
          'Handle hardware interrupts',
        ],
        correctIndex: 1,
        explanation: 'The Translation Lookaside Buffer caches page table entries so address translation is fast.',
      },
      {
        question: 'Which scheduling algorithm can cause starvation of long jobs?',
        options: ['Round Robin', 'First Come First Served', 'Shortest Job First', 'None of these'],
        correctIndex: 2,
        explanation: 'If short jobs keep arriving, SJF may postpone long jobs indefinitely.',
      },
      {
        question: 'Thrashing occurs when:',
        options: [
          'The CPU is idle',
          'The system spends most of its time swapping pages in and out',
          'Too many threads are created',
          'The disk is full',
        ],
        correctIndex: 1,
        explanation: 'When working sets do not fit in memory, page faults dominate and little useful work gets done.',
      },
    ],
  },
];

// Fictional companies used for sample posts
const experiences = [
  {
    company: 'Northwind Software',
    role: 'Software Engineer Intern',
    location: 'Colombo',
    outcome: 'Selected',
    difficulty: 'Medium',
    rounds: 3,
    content: `Round 1 was an online assessment on HackerRank: two coding questions (string manipulation and a BFS on a grid) plus 15 MCQs on OOP and DBMS. 90 minutes in total.

Round 2 was a technical interview with two engineers. They asked me to walk through my final-year project in depth, then explain the difference between a process and a thread, how indexes work, and to write a SQL query with GROUP BY and HAVING. I was also asked to reverse a linked list on a shared editor while talking through my approach.

Round 3 was an HR and culture-fit discussion: tell me about yourself, a time I had a disagreement in a team, and why I wanted to join.`,
    tips: 'Know every line of your own projects. They spent more time on my project than on algorithms. Think out loud during coding; they cared about the approach more than a perfect answer.',
  },
  {
    company: 'Bluepeak Technologies',
    role: 'Associate Software Engineer',
    location: 'Remote',
    outcome: 'Rejected',
    difficulty: 'Hard',
    rounds: 2,
    content: `First round was a 60 minute live coding session. The problem was to design an LRU cache with O(1) get and put. I got the hash map part quickly but struggled to explain why a doubly linked list is needed, and ran out of time before finishing the eviction logic.

Second round was a system design discussion on a URL shortener. They focused on how I would generate unique codes and how caching would work under heavy read traffic.

I didn't get the offer, but the feedback was useful: practise explaining trade-offs, and get faster at standard data structure designs.`,
    tips: 'Practise LRU cache, rate limiters and URL shorteners until you can explain them without notes. Ask clarifying questions before you start coding.',
  },
  {
    company: 'Coralstack',
    role: 'Full Stack Developer Intern (MERN)',
    location: 'Kandy',
    outcome: 'Awaiting result',
    difficulty: 'Easy',
    rounds: 2,
    content: `Round 1 was a take-home task: build a small REST API with Express and MongoDB for a todo app, with JWT authentication and input validation, plus a simple React front end. They gave 3 days.

Round 2 was a code review call where they went through my submission. Questions included why I chose certain status codes, how I would paginate the list endpoint, the difference between useEffect and useMemo, and how I would store the JWT safely on the client.`,
    tips: 'Keep the take-home clean and add a README with setup steps. They noticed small things like consistent error responses and environment variables.',
  },
];

module.exports = { users, questions, quizzes, experiences };
