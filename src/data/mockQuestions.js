export const mockQuestions = [
  {
    id: 1,
    topic: "JavaScript",
    difficulty: "Easy",
    question: "What is the difference between let and const?",
    answer: "Both are block scoped. A let variable can be reassigned, while a const variable cannot be reassigned once declared."
  },
  {
    id: 2,
    topic: "React",
    difficulty: "Easy",
    question: "What is a component in React?",
    answer: "A component is a reusable, independent piece of UI. It can accept inputs (props) and manage its internal state."
  },
  {
    id: 3,
    topic: "React",
    difficulty: "Medium",
    question: "Why is useEffect used and how does the dependency array work?",
    answer: "useEffect performs side effects (fetching data, timers, subscriptions). An empty array [] runs only on mount; including variables re-runs the effect whenever those variables change."
  },
  {
    id: 4,
    topic: "CSS",
    difficulty: "Easy",
    question: "What is the CSS Box Model?",
    answer: "The CSS Box Model is a container enclosing every HTML element consisting of margins, borders, padding, and the actual content."
  },
  {
    id: 5,
    topic: "JavaScript",
    difficulty: "Medium",
    question: "What is a closure in JavaScript?",
    answer: "A closure gives an inner function access to the outer function's scope even after the outer function has executed and returned."
  },
  {
    id: 6,
    topic: "React",
    difficulty: "Medium",
    question: "What is the purpose of the key prop in React lists?",
    answer: "Keys help React identify which items have changed, been added, or removed, allowing efficient DOM updates during the reconciliation process."
  },
  {
    id: 7,
    topic: "DSA",
    difficulty: "Hard",
    question: "What is the time complexity of Binary Search and when can it be used?",
    answer: "Binary Search has O(log n) time complexity and can only be applied on sorted data structures (like sorted arrays)."
  }
];

export const resumeTips = [
  "Keep your technical resume clean, concise, and ATS-friendly (single column preferred).",
  "Highlight real project impact (e.g. 'Improved query performance by 40% using indexing').",
  "List your strongest languages and frameworks at the top (JavaScript, React, Node).",
  "Link your live deployments and GitHub repositories clearly.",
  "Include problem-solving achievements and streak consistency."
];
