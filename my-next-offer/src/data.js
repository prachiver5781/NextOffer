export const defaultProfile = {
  name: "Vanshika Goel",
  title: "Frontend & Full Stack Developer · Student Developer",
  email: "vanshika.goel@nextoffer.io",
  phone: "9876543210",
  location: "India · Open to internships",
  about: "Student developer interested in building high-performance web products, solving DSA problems and learning in public. Currently exploring React, JavaScript, and full-stack engineering.",
  skills: ["JavaScript", "React", "Python", "Java", "Git", "DSA", "HTML5", "CSS3"],
  stats: {
    problems: 87,
    projects: 12
  }
};

export const achievementsList = []; // Blank as requested

export const dailyChallenge = {
  id: "daily-01",
  code: "01",
  difficulty: "EASY",
  title: "Two Sum",
  description: "Given an array of integers, return indices of the two numbers that add up to a target.",
  tags: ["Arrays", "Hash Table", "15 min", "74% acceptance"],
  acceptance: "74% acceptance"
};

export const continueLearningList = [
  {
    id: "cl-1",
    title: "Data Structures & Algorithms",
    progress: 65,
    icon: "🌲",
    topicId: "arrays"
  },
  {
    id: "cl-2",
    title: "JavaScript & ES6+ Core",
    progress: 50,
    icon: "⚡",
    topicId: "javascript-es6"
  },
  {
    id: "cl-3",
    title: "React Fundamentals & Hooks",
    progress: 35,
    icon: "⚛️",
    topicId: "react-basics"
  }
];

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
        title: "Two Sum",
        prompt: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        starterCode: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]",
        sampleTest: "Input: nums = [2, 7, 11, 15], target = 9 => Output: [0, 1]"
      },
      {
        id: "arr-2",
        title: "Find the Largest and Second Largest Element",
        prompt: "Write a function that returns the largest and second largest distinct numbers in an integer array.",
        starterCode: "// Language: JavaScript\nfunction findTwoLargest(arr) {\n  let first = -Infinity;\n  let second = -Infinity;\n  \n  for (let num of arr) {\n    if (num > first) {\n      second = first;\n      first = num;\n    } else if (num > second && num !== first) {\n      second = num;\n    }\n  }\n  \n  return { largest: first, secondLargest: second };\n}\n\nconsole.log(findTwoLargest([12, 35, 1, 10, 34, 1]));",
        sampleTest: "Input: [12, 35, 1, 10, 34, 1] => Output: { largest: 35, secondLargest: 34 }"
      },
      {
        id: "arr-3",
        title: "Reverse an Array In-Place",
        prompt: "Reverse an array without allocating extra array space using two pointers.",
        starterCode: "function reverseArray(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr;\n}\n\nconsole.log(reverseArray([1, 2, 3, 4, 5]));",
        sampleTest: "Input: [1, 2, 3, 4, 5] => Output: [5, 4, 3, 2, 1]"
      },
      {
        id: "arr-4",
        title: "Move Zeroes to End",
        prompt: "Given an array of integers, move all 0's to the end while maintaining the relative order of non-zero elements.",
        starterCode: "function moveZeroes(nums) {\n  let lastNonZero = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      [nums[lastNonZero], nums[i]] = [nums[i], nums[lastNonZero]];\n      lastNonZero++;\n    }\n  }\n  return nums;\n}\n\nconsole.log(moveZeroes([0, 1, 0, 3, 12]));",
        sampleTest: "Input: [0, 1, 0, 3, 12] => Output: [1, 3, 12, 0, 0]"
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
    title: "HTML5 & Modern CSS3",
    type: "Frontend",
    level: "Beginner",
    description: "Semantic tags, accessibility basics, CSS Box Model, Flexbox, CSS Grid, media queries, and mobile-first layouts.",
    questions: [
      {
        id: "hc-1",
        title: "Explain the CSS Box Model and box-sizing: border-box",
        prompt: "Explain content, padding, border, and margin. Why is * { box-sizing: border-box; } standard in modern web development?",
        starterCode: "/* Explain CSS Box Model with code snippet */\n.card {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #6366f1;\n  margin: 15px;\n}",
        sampleTest: "Key points: Content, Padding, Border, Margin, Box-sizing difference."
      },
      {
        id: "hc-2",
        title: "Flexbox vs CSS Grid - When to use which?",
        prompt: "Compare 1D layout (Flexbox) vs 2D layout (Grid) with common UI patterns.",
        starterCode: "/* Flexbox: 1D row/column */\n.navbar { display: flex; justify-content: space-between; }\n\n/* Grid: 2D responsive dashboards */\n.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }",
        sampleTest: "1D (Flexbox) vs 2D (Grid) layout comparison."
      }
    ]
  },
  {
    id: "javascript-es6",
    title: "JavaScript & ES6+ Core",
    type: "JavaScript",
    level: "Beginner",
    description: "Variables, Arrow functions, Destructuring, Spread/Rest, Modules, Promises, async/await, and localStorage.",
    questions: [
      {
        id: "js-1",
        title: "let, const vs var - Scope, Hoisting & TDZ",
        prompt: "Explain function scope vs block scope, variable hoisting, and Temporal Dead Zone (TDZ).",
        starterCode: "// Example demonstrating Block Scope & TDZ\nfunction scopeDemo() {\n  let a = 10;\n  if (true) {\n    let a = 20;\n    var b = 30;\n  }\n  console.log(a); // 10\n  console.log(b); // 30\n}\nscopeDemo();",
        sampleTest: "Block scope vs Function scope, Hoisting behavior, TDZ."
      },
      {
        id: "js-2",
        title: "Async/Await with Fetch API & Error Handling",
        prompt: "Write a resilient async function using fetch with try-catch and response.ok verification.",
        starterCode: "async function fetchUserData(userId) {\n  try {\n    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);\n    if (!res.ok) throw new Error('Fetch failed');\n    return await res.json();\n  } catch (err) {\n    console.error(err);\n  }\n}",
        sampleTest: "Demonstrates async/await, response.ok check, try/catch block."
      }
    ]
  },
  {
    id: "react-basics",
    title: "React Fundamentals & Components",
    type: "React",
    level: "Intermediate",
    description: "Component-based architecture, JSX, Props, State, Lists & Keys, and Controlled Components.",
    questions: [
      {
        id: "rc-1",
        title: "Controlled Component vs Uncontrolled Component",
        prompt: "Build a controlled input form with validation and clear state management.",
        starterCode: "import { useState } from 'react';\n\nfunction LoginForm() {\n  const [email, setEmail] = useState('');\n  return (\n    <form onSubmit={(e) => { e.preventDefault(); console.log(email); }}>\n      <input value={email} onChange={(e) => setEmail(e.target.value)} />\n      <button type='submit'>Submit</button>\n    </form>\n  );\n}",
        sampleTest: "React state driving input value with onChange event."
      }
    ]
  },
  {
    id: "react-hooks",
    title: "React Hooks Deep Dive",
    type: "React",
    level: "Intermediate",
    description: "Master useState, useEffect, useRef, useMemo, useCallback, and Custom Hooks.",
    questions: [
      {
        id: "hk-1",
        title: "useEffect Lifecycle: Mount, Update & Cleanup",
        prompt: "Write a custom hook or component that sets up a window resize listener with proper cleanup.",
        starterCode: "import { useState, useEffect } from 'react';\n\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  return width;\n}",
        sampleTest: "Cleanup function prevents memory leaks."
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
    title: "NextOffer Placement Platform",
    category: "Full React + Router",
    description: "Complete developer ecosystem platform featuring authentication, dynamic topics, code submissions, roadmap, and resume builder.",
    technologies: "React, React Router v6, Hooks, CSS Grid/Flexbox, LocalStorage Auth",
    syllabusWeek: "Week 6"
  }
];