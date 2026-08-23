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
