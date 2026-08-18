export const topics = [

  {
    id: "arrays",

    title: "Arrays",

    type: "DSA",

    level: "Beginner",

    description:
      "Build your basics with traversal, searching, sorting and common array patterns.",

    questions: [

      "Find the largest element in an array.",

      "Find the second largest element.",

      "Reverse an array.",

      "Find duplicate elements.",

      "Move all zeroes to the end."

    ]
  },


  {
    id: "strings",

    title: "Strings",

    type: "DSA",

    level: "Beginner",

    description:
      "Practice string manipulation, frequency counting and common interview patterns.",

    questions: [

      "Check whether a string is a palindrome.",

      "Reverse a string.",

      "Find the first non-repeating character.",

      "Check whether two strings are anagrams.",

      "Compress a string."

    ]
  },


  {
    id: "javascript",

    title: "JavaScript Basics",

    type: "JavaScript",

    level: "Beginner",

    description:
      "Revise variables, functions, arrays, objects, loops and modern JavaScript.",

    questions: [

      "Explain let, const and var.",

      "What is an arrow function?",

      "What is destructuring?",

      "Explain spread and rest operators.",

      "What is the difference between map and filter?"

    ]
  },


  {
    id: "react",

    title: "React Fundamentals",

    type: "React",

    level: "Intermediate",

    description:
      "Learn JSX, components, props, state, lists and conditional rendering.",

    questions: [

      "What is JSX?",

      "What are props?",

      "What is state?",

      "Why do lists need keys?",

      "Explain conditional rendering."

    ]
  },


  {
    id: "hooks",

    title: "React Hooks",

    type: "React",

    level: "Intermediate",

    description:
      "Practice useState, useEffect, useRef, useMemo, useCallback and custom hooks.",

    questions: [

      "When should you use useState?",

      "What does useEffect do?",

      "What is useRef used for?",

      "Why would you use useMemo?",

      "What is a custom hook?"

    ]
  },


  {
    id: "web",

    title: "Web Fundamentals",

    type: "Frontend",

    level: "Beginner",

    description:
      "Revise HTML5, CSS3, Flexbox, Grid and responsive design.",

    questions: [

      "What are semantic HTML tags?",

      "Explain the CSS box model.",

      "Flexbox vs Grid?",

      "What is mobile-first design?",

      "What are media queries?"

    ]
  }

];


export const roadmap = [

  {
    week: "Week 1",

    title: "HTML + CSS",

    items: [
      "Semantic HTML",
      "Accessibility basics",
      "Box Model",
      "Flexbox",
      "Grid",
      "Responsive design"
    ]
  },


  {
    week: "Week 2",

    title: "JavaScript",

    items: [
      "Variables",
      "Functions",
      "Arrays",
      "Objects",
      "Loops",
      "DOM events"
    ]
  },


  {
    week: "Week 3",

    title: "Modern JavaScript",

    items: [
      "let / const",
      "Arrow functions",
      "Destructuring",
      "Spread / rest",
      "Promises",
      "async / await",
      "Fetch API"
    ]
  },


  {
    week: "Week 4",

    title: "React Basics",

    items: [
      "JSX",
      "Components",
      "Props",
      "State",
      "Lists",
      "Conditional rendering"
    ]
  },


  {
    week: "Week 5",

    title: "React Hooks",

    items: [
      "useState",
      "useEffect",
      "useRef",
      "useMemo",
      "useCallback",
      "Custom hooks"
    ]
  },


  {
    week: "Week 6",

    title: "React Router",

    items: [
      "Routes",
      "Nested routes",
      "Dynamic routes",
      "Route params",
      "Protected routes",
      "404 page"
    ]
  }

];


export const mockQuestions = [

  {
    id: 1,

    topic: "JavaScript",

    question:
      "What is the difference between let and const?",

    answer:
      "Both are block scoped. A let variable can be reassigned, while a const variable cannot be reassigned."
  },


  {
    id: 2,

    topic: "React",

    question:
      "What is a component in React?",

    answer:
      "A component is a reusable piece of UI. It can receive data through props and manage changing data with state."
  },


  {
    id: 3,

    topic: "React",

    question:
      "Why is useEffect used?",

    answer:
      "It is used for side effects such as reading data, reacting to state changes, or working with browser APIs."
  },


  {
    id: 4,

    topic: "CSS",

    question:
      "What is the CSS box model?",

    answer:
      "An element is made up of content, padding, border and margin."
  }

];


export const resumeTips = [

  "Keep the resume simple and easy to scan.",

  "Put your strongest technical skills near the top.",

  "Add projects with a short problem, solution and technology description.",

  "Use action words when describing what you built.",

  "Keep project descriptions honest and easy to explain in an interview."

];