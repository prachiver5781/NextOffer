export const topics = [
  {
    id: "arrays",
    title: "Arrays & Searching",
    type: "DSA",
    level: "Beginner",
    description: "Master array traversal, searching algorithms, in-place manipulation, and basic two-pointer techniques.",
    questions: [
      {
        id: "arr-1",
        title: "Find the Largest and Second Largest Element",
        prompt: "Write a function that returns the largest and second largest distinct numbers in an integer array.",
        starterCode: "// Language: JavaScript\nfunction findTwoLargest(arr) {\n  let first = -Infinity;\n  let second = -Infinity;\n  \n  for (let num of arr) {\n    if (num > first) {\n      second = first;\n      first = num;\n    } else if (num > second && num !== first) {\n      second = num;\n    }\n  }\n  \n  return { largest: first, secondLargest: second };\n}\n\nconsole.log(findTwoLargest([12, 35, 1, 10, 34, 1]));",
        sampleTest: "Input: [12, 35, 1, 10, 34, 1] => Output: { largest: 35, secondLargest: 34 }"
      },
      {
        id: "arr-2",
        title: "Reverse an Array In-Place",
        prompt: "Reverse an array without allocating extra array space using two pointers.",
        starterCode: "function reverseArray(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr;\n}\n\nconsole.log(reverseArray([1, 2, 3, 4, 5]));",
        sampleTest: "Input: [1, 2, 3, 4, 5] => Output: [5, 4, 3, 2, 1]"
      },
      {
        id: "arr-3",
        title: "Move Zeroes to End",
        prompt: "Given an array of integers, move all 0's to the end while maintaining the relative order of non-zero elements.",
        starterCode: "function moveZeroes(nums) {\n  let lastNonZero = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      [nums[lastNonZero], nums[i]] = [nums[i], nums[lastNonZero]];\n      lastNonZero++;\n    }\n  }\n  return nums;\n}\n\nconsole.log(moveZeroes([0, 1, 0, 3, 12]));",
        sampleTest: "Input: [0, 1, 0, 3, 12] => Output: [1, 3, 12, 0, 0]"
      },
      {
        id: "arr-4",
        title: "Find Duplicate Elements in Array",
        prompt: "Find all duplicates in an array containing numbers from 1 to n.",
        starterCode: "function findDuplicates(nums) {\n  const seen = new Set();\n  const duplicates = [];\n  for (let n of nums) {\n    if (seen.has(n)) duplicates.push(n);\n    else seen.add(n);\n  }\n  return duplicates;\n}",
        sampleTest: "Input: [4, 3, 2, 7, 8, 2, 3, 1] => Output: [2, 3]"
      }
    ]
  },
  {
    id: "strings",
    title: "Strings & Frequency Counting",
    type: "DSA",
    level: "Beginner",
    description: "Practice string manipulation, palindrome checks, anagram detection, and frequency maps.",
    questions: [
      {
        id: "str-1",
        title: "Valid Palindrome Check",
        prompt: "Determine if a string is a palindrome, considering only alphanumeric characters and ignoring cases.",
        starterCode: "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}\n\nconsole.log(isPalindrome('A man, a plan, a canal: Panama'));",
        sampleTest: "Input: 'A man, a plan, a canal: Panama' => Output: true"
      },
      {
        id: "str-2",
        title: "Valid Anagrams",
        prompt: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        starterCode: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (let char of s) count[char] = (count[char] || 0) + 1;\n  for (let char of t) {\n    if (!count[char]) return false;\n    count[char]--;\n  }\n  return true;\n}",
        sampleTest: "Input: s = 'anagram', t = 'nagaram' => Output: true"
      },
      {
        id: "str-3",
        title: "First Non-Repeating Character",
        prompt: "Find the first character in a string that occurs only once and return its index.",
        starterCode: "function firstUniqChar(s) {\n  const map = {};\n  for (let c of s) map[c] = (map[c] || 0) + 1;\n  for (let i = 0; i < s.length; i++) {\n    if (map[s[i]] === 1) return i;\n  }\n  return -1;\n}",
        sampleTest: "Input: 'leetcode' => Output: 0"
      }
    ]
  },
  {
    id: "html-css",
    title: "HTML5 & CSS3 Fundamentals",
    type: "Frontend",
    level: "Beginner",
    description: "Semantic tags, accessibility basics, CSS Box Model, Flexbox, CSS Grid, media queries, and mobile-first layouts.",
    questions: [
      {
        id: "hc-1",
        title: "Explain the CSS Box Model and box-sizing: border-box",
        prompt: "Explain content, padding, border, and margin. Why is * { box-sizing: border-box; } standard in modern web development?",
        starterCode: "/* Explain CSS Box Model with code snippet */\n.card {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #6c5ce7;\n  margin: 15px;\n  /* Total rendered width remains 300px with border-box */\n}",
        sampleTest: "Key points: Content, Padding, Border, Margin, Box-sizing difference."
      },
      {
        id: "hc-2",
        title: "Flexbox vs CSS Grid - When to use which?",
        prompt: "Compare 1D layout (Flexbox) vs 2D layout (Grid) with common UI patterns.",
        starterCode: "/* Flexbox: Ideal for 1D row/column navigation bars */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n/* CSS Grid: Ideal for 2D responsive dashboards */\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 20px;\n}",
        sampleTest: "1D (Flexbox) vs 2D (Grid) layout comparison."
      },
      {
        id: "hc-3",
        title: "Mobile-First Responsive Layout with Media Queries",
        prompt: "Write a clean media query layout starting with mobile styles and scaling to desktop.",
        starterCode: "/* Mobile default */\n.container {\n  padding: 16px;\n  font-size: 14px;\n}\n\n/* Tablet & Desktop breakpoint */\n@media (min-width: 768px) {\n  .container {\n    padding: 32px;\n    font-size: 16px;\n    max-width: 1200px;\n    margin: 0 auto;\n  }\n}",
        sampleTest: "Mobile-first approach using min-width breakpoints."
      }
    ]
  },
  {
    id: "javascript-es6",
    title: "JavaScript & ES6+ Core",
    type: "JavaScript",
    level: "Beginner",
    description: "Variables (let, const, var), Arrow functions, Destructuring, Spread/Rest, Modules, Promises, async/await, DOM events, and localStorage.",
    questions: [
      {
        id: "js-1",
        title: "let, const vs var - Scope, Hoisting & TDZ",
        prompt: "Explain function scope vs block scope, variable hoisting, and Temporal Dead Zone (TDZ).",
        starterCode: "// Example demonstrating Block Scope & TDZ\nfunction scopeDemo() {\n  // console.log(a); // ReferenceError: Cannot access 'a' before initialization (TDZ)\n  let a = 10;\n  \n  if (true) {\n    let a = 20; // Block scoped variable\n    var b = 30; // Function scoped variable\n  }\n  \n  console.log(a); // 10\n  console.log(b); // 30\n}\nscopeDemo();",
        sampleTest: "Block scope vs Function scope, Hoisting behavior, TDZ."
      },
      {
        id: "js-2",
        title: "Async/Await with Fetch API & Error Handling",
        prompt: "Write a resilient async function using fetch with try-catch and response.ok verification.",
        starterCode: "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);\n    if (!response.ok) {\n      throw new Error(`HTTP Error! Status: ${response.status}`);\n    }\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Fetch failed:', error.message);\n    return null;\n  }\n}",
        sampleTest: "Demonstrates async/await, response.ok check, try/catch block."
      },
      {
        id: "js-3",
        title: "Array Methods: map, filter, reduce & Spread Operator",
        prompt: "Transform an array of student objects to calculate total marks and filter passed students using modern ES6 array methods.",
        starterCode: "const students = [\n  { name: 'Aarav', score: 85 },\n  { name: 'Priya', score: 42 },\n  { name: 'Rohan', score: 78 }\n];\n\nconst passed = students.filter(s => s.score >= 50);\nconst avgScore = students.reduce((acc, s) => acc + s.score, 0) / students.length;\n\nconsole.log({ passed, avgScore });",
        sampleTest: "Using filter, map, reduce and immutable array operations."
      }
    ]
  },
  {
    id: "react-basics",
    title: "React Fundamentals & Components",
    type: "React",
    level: "Intermediate",
    description: "Component-based architecture, JSX, Props, State, Lists & Keys, Conditional Rendering, and Controlled Form Components.",
    questions: [
      {
        id: "rc-1",
        title: "Controlled Component vs Uncontrolled Component",
        prompt: "Build a controlled input form with validation and clear state management.",
        starterCode: "import { useState } from 'react';\n\nfunction LoginForm() {\n  const [email, setEmail] = useState('');\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log('Submitted:', email);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input \n        value={email} \n        onChange={(e) => setEmail(e.target.value)} \n        placeholder='Enter email'\n      />\n      <button type='submit'>Submit</button>\n    </form>\n  );\n}",
        sampleTest: "React state driving input value with onChange event."
      },
      {
        id: "rc-2",
        title: "Why are Keys needed in React Lists?",
        prompt: "Explain how React's Virtual DOM reconciliation uses keys to identify changed, added, or removed elements.",
        starterCode: "// Keys give elements a stable identity across re-renders\nconst TodoList = ({ items }) => (\n  <ul>\n    {items.map((item) => (\n      <li key={item.id}>{item.text}</li> // Always use unique IDs, avoid array indices if list mutates\n    ))}\n  </ul>\n);",
        sampleTest: "Keys optimize Virtual DOM diffing & prevent state mutation bugs."
      }
    ]
  },
  {
    id: "react-hooks",
    title: "React Hooks Deep Dive",
    type: "React",
    level: "Intermediate",
    description: "Master useState, useEffect lifecycle & cleanup, useRef for DOM & mutable refs, useMemo & useCallback performance, and custom hooks.",
    questions: [
      {
        id: "hk-1",
        title: "useEffect Lifecycle: Mount, Update & Cleanup",
        prompt: "Write a custom hook or component that sets up a window resize listener with proper cleanup to prevent memory leaks.",
        starterCode: "import { useState, useEffect } from 'react';\n\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  \n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    \n    // Cleanup listener on unmount\n    return () => window.removeEventListener('resize', handleResize);\n  }, []); // Empty deps = run on mount & unmount\n  \n  return width;\n}",
        sampleTest: "Cleanup function prevents memory leaks."
      },
      {
        id: "hk-2",
        title: "useMemo vs useCallback - Preventing Unnecessary Rerenders",
        prompt: "Explain when to memoize expensive computations with useMemo versus memoizing function references with useCallback.",
        starterCode: "import { useMemo, useCallback } from 'react';\n\n// useMemo caches the RESULT of a computation\nconst filteredList = useMemo(() => {\n  return list.filter(item => item.value > threshold);\n}, [list, threshold]);\n\n// useCallback caches the FUNCTION INSTANCE itself\nconst handleClick = useCallback((id) => {\n  console.log('Clicked item', id);\n}, []);",
        sampleTest: "useMemo for computed values, useCallback for callback props."
      },
      {
        id: "hk-3",
        title: "Building a Reusable Custom Hook (useLocalStorage)",
        prompt: "Create a custom hook that syncs any React state with browser localStorage seamlessly.",
        starterCode: "import { useState, useEffect } from 'react';\n\nfunction useLocalStorage(key, initialValue) {\n  const [val, setVal] = useState(() => {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : initialValue;\n  });\n  \n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(val));\n  }, [key, val]);\n  \n  return [val, setVal];\n}",
        sampleTest: "Encapsulates state & side-effect logic for reuse."
      }
    ]
  },
  {
    id: "react-router",
    title: "React Router v6 & Navigation",
    type: "React",
    level: "Intermediate",
    description: "Routes, nested routes with <Outlet />, dynamic routes with useParams(), useNavigate(), ProtectedRoute auth guards, and 404 handling.",
    questions: [
      {
        id: "rr-1",
        title: "Protected Route Pattern for Authentication",
        prompt: "Implement a ProtectedRoute component that redirects unauthenticated users to /login while saving location.",
        starterCode: "import { Navigate, Outlet } from 'react-router-dom';\n\nfunction ProtectedRoute({ isAuthenticated }) {\n  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;\n}",
        sampleTest: "Redirects unauthorized users to /login using <Navigate replace />."
      },
      {
        id: "rr-2",
        title: "Dynamic Routing & Route Parameters",
        prompt: "Extract route parameters using useParams() to fetch and display dynamic resource data.",
        starterCode: "import { useParams } from 'react-router-dom';\n\nfunction ProblemView() {\n  const { topicId, problemId } = useParams();\n  return <h2>Viewing Problem: {problemId} under Topic: {topicId}</h2>;\n}",
        sampleTest: "Extracts URL params dynamically."
      }
    ]
  }
];

export const roadmap = [
  {
    week: "Week 1",
    title: "HTML5 Structure & Modern CSS3",
    tag: "Fundamentals",
    items: [
      "Semantic HTML5 & Accessibility (a11y)",
      "CSS Box Model (content, padding, border, margin)",
      "Flexbox 1D Layouts & CSS Grid 2D Dashboards",
      "Media queries & Mobile-first responsive design",
      "Mini Project: Static Responsive Landing Page"
    ]
  },
  {
    week: "Week 2",
    title: "JavaScript Basics & Environment",
    tag: "JavaScript",
    items: [
      "Variables, Data Types, Type Coercion",
      "Functions, Scope & Arrow Functions",
      "Arrays, Objects & Loops",
      "Chrome DevTools, VS Code Setup, Git/GitHub Basics",
      "Mini Project: Interactive Form Validator"
    ]
  },
  {
    week: "Week 3",
    title: "Modern ES6+ & Async JavaScript",
    tag: "Advanced JS",
    items: [
      "let / const, Destructuring & Spread/Rest",
      "ES Modules (import / export)",
      "Promises, async / await, Fetch API",
      "DOM Manipulation, Event Listeners, localStorage & JSON",
      "Mini Project: Interactive To-Do App with Persistence"
    ]
  },
  {
    week: "Week 4",
    title: "React Intro & Component Architecture",
    tag: "React",
    items: [
      "Vite React setup & Project Structure",
      "JSX syntax, Component-based architecture",
      "Props vs State & Lifting state up",
      "Rendering Lists with Keys & Conditional Rendering",
      "Mini Project: Counter App & Product Catalog Card"
    ]
  },
  {
    week: "Week 5",
    title: "React Hooks & Custom Hooks",
    tag: "React Hooks",
    items: [
      "useState for local state management",
      "useEffect for lifecycle, fetch & cleanups",
      "useRef for DOM references & timers",
      "useMemo & useCallback for optimization",
      "Mini Project: Weather App / Notes App with Custom Hooks"
    ]
  },
  {
    week: "Week 6",
    title: "React Router & Full App Architecture",
    tag: "Routing & Project",
    items: [
      "BrowserRouter, Routes, Route, Link, NavLink",
      "Nested Routes & <Outlet /> layouts",
      "Dynamic Route Params with useParams()",
      "Protected Routes & 404 Fallbacks",
      "Capstone Project: NextOffer Placement Prep Platform"
    ]
  }
];

export const mockQuestions = [
  {
    id: 1,
    topic: "JavaScript",
    question: "What is the difference between let, const, and var?",
    answer: "var is function-scoped and hoisted with undefined. let and const are block-scoped and hoisted into the Temporal Dead Zone (TDZ). const cannot be reassigned after declaration."
  },
  {
    id: 2,
    topic: "React",
    question: "What causes a component to re-render in React?",
    answer: "A component re-renders when its state updates, props passed to it change, its parent re-renders, or context values it subscribes to change."
  },
  {
    id: 3,
    topic: "React",
    question: "Why should you never call hooks inside conditional statements or loops?",
    answer: "React relies on the exact call order of hooks on every render to correctly preserve state between renders. Calling hooks conditionally disrupts this order."
  },
  {
    id: 4,
    topic: "CSS",
    question: "Explain the CSS box model and how box-sizing affects it.",
    answer: "The box model consists of content, padding, border, and margin. With box-sizing: content-box (default), width only applies to content. With box-sizing: border-box, width includes content, padding, and border."
  },
  {
    id: 5,
    topic: "DSA",
    question: "What is the Two Pointers technique and when should you use it?",
    answer: "Two pointers uses two index markers (e.g. start and end) to traverse a linear data structure in O(N) time and O(1) space, commonly used for palindrome checks, pair sums, and reversing arrays."
  },
  {
    id: 6,
    topic: "Web",
    question: "What is the difference between localStorage, sessionStorage, and Cookies?",
    answer: "localStorage persists data indefinitely until cleared (5-10MB limit). sessionStorage persists only for the browser tab session. Cookies are sent with every HTTP request and have a 4KB limit with expiration dates."
  }
];

export const miniProjects = [
  {
    id: "proj-todo",
    title: "Interactive To-Do App",
    category: "JavaScript / ES6+",
    description: "A task manager with filtering (All, Active, Completed), localStorage persistence, and priority tags.",
    technologies: "HTML5, CSS3, ES6+, localStorage",
    syllabusWeek: "Week 3"
  },
  {
    id: "proj-weather",
    title: "Weather & City Forecast App",
    category: "React Hooks",
    description: "Fetch real-time weather using OpenWeather API with custom useFetch hook, loading skeletons, and error handling.",
    technologies: "React, useState, useEffect, Custom Hooks, Fetch API",
    syllabusWeek: "Week 5"
  },
  {
    id: "proj-counter",
    title: "Product Card & Cart Manager",
    category: "React Basics",
    description: "Interactive e-commerce product card with quantity counter, stock limits, and add-to-cart badges.",
    technologies: "React, Props, State, Component Composition",
    syllabusWeek: "Week 4"
  },
  {
    id: "proj-nextoffer",
    title: "NextOffer Placement Portal",
    category: "Full React + Router",
    description: "Complete interview preparation platform featuring authentication, dynamic topics, code submissions, roadmap, and resume builder.",
    technologies: "React, React Router v6, Hooks, CSS Grid/Flexbox, LocalStorage Auth",
    syllabusWeek: "Week 6"
  }
];

export const resumeTips = [
  "Keep your resume clean, 1 page, and easy to scan for technical recruiters.",
  "Use the Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
  "List your strongest skills first: JavaScript (ES6+), React.js, HTML5/CSS3, Git/GitHub.",
  "For each project, include 2-3 bullet points emphasizing technologies, problem solved, and measurable impact.",
  "Ensure you can fluently explain and live-code every project listed on your resume."
];