// API-Fetched Questions Dataset & Remote Fetcher Service - NextOffer
// Supports: LeetCode, Codeforces, and GeeksforGeeks APIs & Datasets

export const TOPIC_FILTERS = [
  "All Topics",
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Trees & Graphs",
  "Linked List",
  "Stack & Queue",
  "Two Pointers",
  "Greedy",
  "Binary Search",
  "Hash Table",
  "Math",
  "Backtracking"
];

export const PLATFORM_FILTERS = [
  "All Platforms",
  "LeetCode",
  "Codeforces",
  "GeeksforGeeks"
];

export const DIFFICULTY_FILTERS = [
  "All Difficulties",
  "Easy",
  "Medium",
  "Hard"
];

// Helper to normalize topic tags into primary categories
export function mapToPrimaryTopic(tags = [], name = "") {
  const combined = (tags.join(" ") + " " + name).toLowerCase();
  if (/two pointer|prefix|suffix|sliding window/.test(combined)) return "Two Pointers";
  if (/array|matrix|vector/.test(combined)) return "Arrays";
  if (/string|palindrome|anagram|text/.test(combined)) return "Strings";
  if (/dynamic|dp/.test(combined)) return "Dynamic Programming";
  if (/tree|bst|graph|dfs|bfs|trie/.test(combined)) return "Trees & Graphs";
  if (/linked list|node/.test(combined)) return "Linked List";
  if (/stack|queue|monotonic/.test(combined)) return "Stack & Queue";
  if (/greedy/.test(combined)) return "Greedy";
  if (/binary search|search/.test(combined)) return "Binary Search";
  if (/hash|map|set/.test(combined)) return "Hash Table";
  if (/math|number|prime|modulo|geometry/.test(combined)) return "Math";
  if (/backtrack|subset|permutation/.test(combined)) return "Backtracking";
  return "Arrays";
}

// Curated high-priority LeetCode problems
export const LEETCODE_CORE_PROBLEMS = [
  {
    id: "lc-1",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    primaryTopic: "Arrays",
    url: "https://leetcode.com/problems/two-sum/",
    acceptance: "58.1%",
    prompt: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    sampleTest: "Input: nums = [2,7,11,15], target = 9 => Output: [0,1]"
  },
  {
    id: "lc-2",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    primaryTopic: "Linked List",
    url: "https://leetcode.com/problems/add-two-numbers/",
    acceptance: "44.2%",
    prompt: "Add two numbers represented by two non-empty linked lists in reverse order.",
    sampleTest: "Input: l1 = [2,4,3], l2 = [5,6,4] => Output: [7,0,8]"
  },
  {
    id: "lc-3",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Strings", "Sliding Window", "Hash Table"],
    primaryTopic: "Strings",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    acceptance: "36.8%",
    prompt: "Given a string s, find the length of the longest substring without repeating characters.",
    sampleTest: "Input: s = \"abcabcbb\" => Output: 3"
  },
  {
    id: "lc-4",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Binary Search", "Arrays"],
    primaryTopic: "Binary Search",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    acceptance: "42.5%",
    prompt: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays in O(log(m+n)).",
    sampleTest: "Input: nums1 = [1,3], nums2 = [2] => Output: 2.0"
  },
  {
    id: "lc-11",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Two Pointers", "Greedy", "Arrays"],
    primaryTopic: "Two Pointers",
    url: "https://leetcode.com/problems/container-with-most-water/",
    acceptance: "56.4%",
    prompt: "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    sampleTest: "Input: height = [1,8,6,2,5,4,8,3,7] => Output: 49"
  },
  {
    id: "lc-15",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "3Sum",
    difficulty: "Medium",
    tags: ["Two Pointers", "Arrays", "Sorting"],
    primaryTopic: "Two Pointers",
    url: "https://leetcode.com/problems/3sum/",
    acceptance: "35.9%",
    prompt: "Return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and nums[i] + nums[j] + nums[k] == 0.",
    sampleTest: "Input: nums = [-1,0,1,2,-1,-4] => Output: [[-1,-1,2],[-1,0,1]]"
  },
  {
    id: "lc-20",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack & Queue", "Strings"],
    primaryTopic: "Stack & Queue",
    url: "https://leetcode.com/problems/valid-parentheses/",
    acceptance: "41.8%",
    prompt: "Given a string s containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    sampleTest: "Input: s = \"()[]{}\" => Output: true"
  },
  {
    id: "lc-21",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List"],
    primaryTopic: "Linked List",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    acceptance: "65.3%",
    prompt: "Merge the two sorted linked lists into one sorted list.",
    sampleTest: "Input: list1 = [1,2,4], list2 = [1,3,4] => Output: [1,1,2,3,4,4]"
  },
  {
    id: "lc-33",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Binary Search", "Arrays"],
    primaryTopic: "Binary Search",
    url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    acceptance: "41.9%",
    prompt: "Given rotated sorted array nums, return index of target or -1 in O(log n).",
    sampleTest: "Input: nums = [4,5,6,7,0,1,2], target = 0 => Output: 4"
  },
  {
    id: "lc-42",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Two Pointers", "Dynamic Programming", "Stack & Queue"],
    primaryTopic: "Two Pointers",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    acceptance: "63.2%",
    prompt: "Compute how much water an elevation map can trap after raining.",
    sampleTest: "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1] => Output: 6"
  },
  {
    id: "lc-53",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Arrays"],
    primaryTopic: "Dynamic Programming",
    url: "https://leetcode.com/problems/maximum-subarray/",
    acceptance: "51.8%",
    prompt: "Find the subarray with the largest sum, and return its sum (Kadane's algorithm).",
    sampleTest: "Input: nums = [-2,1,-3,4,-1,2,1,-5,4] => Output: 6"
  },
  {
    id: "lc-56",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Arrays", "Sorting"],
    primaryTopic: "Arrays",
    url: "https://leetcode.com/problems/merge-intervals/",
    acceptance: "48.2%",
    prompt: "Given an array of intervals, merge all overlapping intervals.",
    sampleTest: "Input: intervals = [[1,3],[2,6],[8,10],[15,18]] => Output: [[1,6],[8,10],[15,18]]"
  },
  {
    id: "lc-70",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    primaryTopic: "Dynamic Programming",
    url: "https://leetcode.com/problems/climbing-stairs/",
    acceptance: "53.6%",
    prompt: "You are climbing a staircase. It takes n steps to reach the top. How many distinct ways can you climb to the top?",
    sampleTest: "Input: n = 3 => Output: 3"
  },
  {
    id: "lc-98",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Validate Binary Search Tree",
    difficulty: "Medium",
    tags: ["Trees & Graphs", "DFS"],
    primaryTopic: "Trees & Graphs",
    url: "https://leetcode.com/problems/validate-binary-search-tree/",
    acceptance: "33.7%",
    prompt: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    sampleTest: "Input: root = [2,1,3] => Output: true"
  },
  {
    id: "lc-121",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Arrays"],
    primaryTopic: "Dynamic Programming",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    acceptance: "55.4%",
    prompt: "Find the maximum profit you can achieve from a single stock transaction.",
    sampleTest: "Input: prices = [7,1,5,3,6,4] => Output: 5"
  },
  {
    id: "lc-146",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "LRU Cache",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List"],
    primaryTopic: "Hash Table",
    url: "https://leetcode.com/problems/lru-cache/",
    acceptance: "44.1%",
    prompt: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    sampleTest: "get(1), put(2, 2)... in O(1) average time complexity"
  },
  {
    id: "lc-200",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Number of Islands",
    difficulty: "Medium",
    tags: ["Trees & Graphs", "BFS", "DFS"],
    primaryTopic: "Trees & Graphs",
    url: "https://leetcode.com/problems/number-of-islands/",
    acceptance: "60.5%",
    prompt: "Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.",
    sampleTest: "Input: grid of 1s and 0s => Output: count of connected components"
  },
  {
    id: "lc-226",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Invert Binary Tree",
    difficulty: "Easy",
    tags: ["Trees & Graphs", "DFS"],
    primaryTopic: "Trees & Graphs",
    url: "https://leetcode.com/problems/invert-binary-tree/",
    acceptance: "78.4%",
    prompt: "Given the root of a binary tree, invert the tree, and return its root.",
    sampleTest: "Input: root = [4,2,7,1,3,6,9] => Output: [4,7,2,9,6,3,1]"
  },
  {
    id: "lc-322",
    platform: "LeetCode",
    platformIcon: "🟠",
    name: "Coin Change",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "BFS"],
    primaryTopic: "Dynamic Programming",
    url: "https://leetcode.com/problems/coin-change/",
    acceptance: "45.2%",
    prompt: "Return the fewest number of coins needed to make up that amount, or -1 if impossible.",
    sampleTest: "Input: coins = [1,2,5], amount = 11 => Output: 3"
  }
];

// Curated top placement problems from GeeksforGeeks
export const GFG_CORE_PROBLEMS = [
  {
    id: "gfg-1",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Subarray with Given Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Two Pointers"],
    primaryTopic: "Arrays",
    url: "https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1",
    acceptance: "42.8%",
    prompt: "Given an unsorted array of non-negative integers, find a continuous sub-array which adds to a given number S.",
    sampleTest: "Input: arr = [1,2,3,7,5], s = 12 => Output: [2, 4]"
  },
  {
    id: "gfg-2",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Missing Number in Array",
    difficulty: "Easy",
    tags: ["Arrays", "Math"],
    primaryTopic: "Arrays",
    url: "https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1",
    acceptance: "45.6%",
    prompt: "Given an array of size N-1 with distinct integers in the range [1, N], find the missing element.",
    sampleTest: "Input: N = 5, arr = [1,2,3,5] => Output: 4"
  },
  {
    id: "gfg-3",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Kadane's Algorithm",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Arrays"],
    primaryTopic: "Dynamic Programming",
    url: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
    acceptance: "40.2%",
    prompt: "Find the contiguous sub-array which has the maximum sum and return its sum.",
    sampleTest: "Input: arr = [1, 2, 3, -2, 5] => Output: 9"
  },
  {
    id: "gfg-4",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Minimum Platforms Required",
    difficulty: "Medium",
    tags: ["Greedy", "Sorting"],
    primaryTopic: "Greedy",
    url: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
    acceptance: "38.5%",
    prompt: "Given arrival and departure times of all trains, find the minimum number of platforms required for the railway station so that no train is kept waiting.",
    sampleTest: "Input: arr[] = [0900, 0940, 0950, 1100], dep[] = [0910, 1200, 1120, 1130] => Output: 3"
  },
  {
    id: "gfg-5",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Detect Loop in Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    primaryTopic: "Linked List",
    url: "https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1",
    acceptance: "48.2%",
    prompt: "Given a linked list, check if the linked list has a loop (Floyd's cycle-finding algorithm).",
    sampleTest: "Input: Linked list with cycle => Output: true"
  },
  {
    id: "gfg-6",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Parenthesis Checker",
    difficulty: "Easy",
    tags: ["Stack & Queue", "Strings"],
    primaryTopic: "Stack & Queue",
    url: "https://www.geeksforgeeks.org/problems/parenthesis-checker2744/1",
    acceptance: "49.1%",
    prompt: "Given an expression string x, examine whether the pairs and the orders of \"{\", \"}\", \"(\", \")\", \"[\", \"]\" are correct.",
    sampleTest: "Input: {([])} => Output: true"
  },
  {
    id: "gfg-7",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Rat in a Maze Problem",
    difficulty: "Medium",
    tags: ["Backtracking", "Trees & Graphs"],
    primaryTopic: "Backtracking",
    url: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
    acceptance: "35.2%",
    prompt: "Find all possible paths that the rat can take to reach from (0, 0) to (N-1, N-1) in a grid.",
    sampleTest: "Input: N = 4, matrix with 0 and 1 => Output: [DDRDRR, DRDDRR]"
  },
  {
    id: "gfg-8",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Next Greater Element",
    difficulty: "Medium",
    tags: ["Stack & Queue", "Arrays"],
    primaryTopic: "Stack & Queue",
    url: "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1",
    acceptance: "36.8%",
    prompt: "For each element in the array, find the first greater element to its right.",
    sampleTest: "Input: arr = [1, 3, 2, 4] => Output: [3, 4, 4, -1]"
  },
  {
    id: "gfg-9",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "BFS of Graph",
    difficulty: "Easy",
    tags: ["Trees & Graphs", "BFS"],
    primaryTopic: "Trees & Graphs",
    url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
    acceptance: "52.4%",
    prompt: "Given a connected undirected graph, perform Breadth First Traversal of the graph.",
    sampleTest: "Input: V = 5, adj list => Output: [0, 1, 2, 3, 4]"
  },
  {
    id: "gfg-10",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "DFS of Graph",
    difficulty: "Easy",
    tags: ["Trees & Graphs", "DFS"],
    primaryTopic: "Trees & Graphs",
    url: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1",
    acceptance: "54.6%",
    prompt: "Given a connected undirected graph, perform Depth First Traversal of the graph.",
    sampleTest: "Input: V = 5, adj list => Output: [0, 2, 4, 3, 1]"
  },
  {
    id: "gfg-11",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "0 - 1 Knapsack Problem",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
    primaryTopic: "Dynamic Programming",
    url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
    acceptance: "39.4%",
    prompt: "Find maximum value subset of weights that does not exceed capacity W.",
    sampleTest: "Input: W = 4, val[] = [1,2,3], wt[] = [4,5,1] => Output: 3"
  },
  {
    id: "gfg-12",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Longest Common Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Strings"],
    primaryTopic: "Dynamic Programming",
    url: "https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1",
    acceptance: "41.0%",
    prompt: "Given two strings, find the length of longest subsequence present in both of them.",
    sampleTest: "Input: s1 = \"ABCDGH\", s2 = \"AEDFHR\" => Output: 3"
  },
  {
    id: "gfg-13",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Kth Smallest Element in Array",
    difficulty: "Medium",
    tags: ["Arrays", "Binary Search"],
    primaryTopic: "Arrays",
    url: "https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1",
    acceptance: "42.1%",
    prompt: "Given an array and a number k, find the kth smallest element in the given array.",
    sampleTest: "Input: arr = [7, 10, 4, 3, 20, 15], k = 3 => Output: 7"
  },
  {
    id: "gfg-14",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Check for BST",
    difficulty: "Medium",
    tags: ["Trees & Graphs"],
    primaryTopic: "Trees & Graphs",
    url: "https://www.geeksforgeeks.org/problems/check-for-bst/1",
    acceptance: "44.9%",
    prompt: "Given a binary tree, check whether it is a valid binary search tree.",
    sampleTest: "Input: Binary tree nodes => Output: 1 (true) or 0 (false)"
  },
  {
    id: "gfg-15",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    name: "Word Ladder",
    difficulty: "Hard",
    tags: ["Trees & Graphs", "BFS"],
    primaryTopic: "Trees & Graphs",
    url: "https://www.geeksforgeeks.org/problems/word-ladder/1",
    acceptance: "31.2%",
    prompt: "Find the shortest transformation sequence from startWord to targetWord using a word dictionary.",
    sampleTest: "Input: startWord = \"der\", targetWord = \"dfs\", wordList = [\"des\", \"der\", \"dfr\", \"dfs\"] => Output: 3"
  }
];

// Curated top Codeforces problems
export const CODEFORCES_FALLBACK_PROBLEMS = [
  {
    id: "cf-4-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Watermelon",
    difficulty: "Easy",
    rating: 800,
    tags: ["Math", "Implementation"],
    primaryTopic: "Math",
    url: "https://codeforces.com/problemset/problem/4/A",
    acceptance: "89.2%",
    prompt: "Check if watermelon of weight w can be divided into two parts each of even weight.",
    sampleTest: "Input: 8 => Output: YES"
  },
  {
    id: "cf-71-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Way Too Long Words",
    difficulty: "Easy",
    rating: 800,
    tags: ["Strings"],
    primaryTopic: "Strings",
    url: "https://codeforces.com/problemset/problem/71/A",
    acceptance: "84.5%",
    prompt: "Abbreviate words longer than 10 characters as first letter + count + last letter.",
    sampleTest: "Input: localization => Output: l10n"
  },
  {
    id: "cf-231-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Team",
    difficulty: "Easy",
    rating: 800,
    tags: ["Greedy"],
    primaryTopic: "Greedy",
    url: "https://codeforces.com/problemset/problem/231/A",
    acceptance: "81.0%",
    prompt: "Count how many problems the team will solve if at least 2 members are sure about the solution.",
    sampleTest: "Input: 3 problems => Output: count"
  },
  {
    id: "cf-158-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Next Round",
    difficulty: "Easy",
    rating: 800,
    tags: ["Arrays"],
    primaryTopic: "Arrays",
    url: "https://codeforces.com/problemset/problem/158/A",
    acceptance: "78.4%",
    prompt: "Find the number of participants who advance to the next round with score >= k-th participant.",
    sampleTest: "Input: 8 participants, k = 5 => Output: 6"
  },
  {
    id: "cf-282-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Bit++",
    difficulty: "Easy",
    rating: 800,
    tags: ["Implementation"],
    primaryTopic: "Arrays",
    url: "https://codeforces.com/problemset/problem/282/A",
    acceptance: "86.1%",
    prompt: "Execute sequence of ++X and --X statements on variable X initialized to 0.",
    sampleTest: "Input: ++X, --X, ++X => Output: 1"
  },
  {
    id: "cf-118-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "String Task",
    difficulty: "Medium",
    rating: 1000,
    tags: ["Strings"],
    primaryTopic: "Strings",
    url: "https://codeforces.com/problemset/problem/118/A",
    acceptance: "62.4%",
    prompt: "Delete all vowels, insert '.' before each consonant, and turn into lowercase.",
    sampleTest: "Input: tour => Output: .t.r"
  },
  {
    id: "cf-1-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Theatre Square",
    difficulty: "Medium",
    rating: 1000,
    tags: ["Math"],
    primaryTopic: "Math",
    url: "https://codeforces.com/problemset/problem/1/A",
    acceptance: "65.8%",
    prompt: "Calculate least number of a x a flagstones needed to pave n x m Theatre Square.",
    sampleTest: "Input: 6 6 4 => Output: 4"
  },
  {
    id: "cf-189-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Cut Ribbon",
    difficulty: "Medium",
    rating: 1300,
    tags: ["Dynamic Programming"],
    primaryTopic: "Dynamic Programming",
    url: "https://codeforces.com/problemset/problem/189/A",
    acceptance: "44.6%",
    prompt: "Find maximum number of ribbon pieces of lengths a, b, or c summing to n.",
    sampleTest: "Input: 5 5 3 2 => Output: 2"
  },
  {
    id: "cf-455-A",
    platform: "Codeforces",
    platformIcon: "🔵",
    name: "Boredom",
    difficulty: "Hard",
    rating: 1500,
    tags: ["Dynamic Programming"],
    primaryTopic: "Dynamic Programming",
    url: "https://codeforces.com/problemset/problem/455/A",
    acceptance: "39.8%",
    prompt: "Maximize total points by picking number ak and eliminating all values equal to ak-1 and ak+1.",
    sampleTest: "Input: [1, 2, 1, 3, 2, 2, 2, 2, 3] => Output: 10"
  }
];

const CACHE_KEY = "nextoffer_all_api_questions_v2";
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

export async function fetchAllApiQuestions() {
  // Check sessionStorage cache
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.savedAt && Date.now() - parsed.savedAt < CACHE_TTL && Array.isArray(parsed.questions) && parsed.questions.length > 30) {
        return parsed.questions;
      }
    }
  } catch {}

  let leetCodeFetched = [];
  let codeforcesFetched = [];

  // 1. Fetch LeetCode API asynchronously with fallback
  try {
    const response = await fetch("https://alfa-leetcode-api.onrender.com/problems?limit=60");
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.problemsetQuestionList)) {
        leetCodeFetched = data.problemsetQuestionList
          .filter((p) => !p.isPaidOnly && p.title)
          .map((p) => {
            const tags = (p.topicTags || []).map((t) => t.name || t.slug);
            const diff = p.difficulty || "Medium";
            return {
              id: `lc-${p.questionFrontendId || p.titleSlug}`,
              platform: "LeetCode",
              platformIcon: "🟠",
              name: p.title,
              difficulty: diff === "Easy" ? "Easy" : diff === "Hard" ? "Hard" : "Medium",
              tags: tags.length > 0 ? tags.slice(0, 3) : ["Algorithms"],
              primaryTopic: mapToPrimaryTopic(tags, p.title),
              url: `https://leetcode.com/problems/${p.titleSlug}/`,
              acceptance: p.acRate ? `${Math.round(p.acRate)}%` : "50%",
              prompt: `LeetCode problem #${p.questionFrontendId}: ${p.title}. Solve using optimal algorithmic approaches.`
            };
          });
      }
    }
  } catch (err) {
    console.warn("Could not fetch live LeetCode list, using rich curated set.", err);
  }

  // 2. Fetch Codeforces API asynchronously with fallback
  try {
    const response = await fetch("https://codeforces.com/api/problemset.problems");
    if (response.ok) {
      const data = await response.json();
      if (data.status === "OK" && Array.isArray(data.result?.problems)) {
        codeforcesFetched = data.result.problems
          .filter((p) => p.contestId && p.index && p.name && p.type === "PROGRAMMING")
          .slice(0, 80)
          .map((p) => {
            const rating = p.rating || null;
            const diff = !rating || rating < 1200 ? "Easy" : rating < 1700 ? "Medium" : "Hard";
            const tags = p.tags || ["implementation"];
            return {
              id: `cf-${p.contestId}-${p.index}`,
              platform: "Codeforces",
              platformIcon: "🔵",
              name: p.name,
              difficulty: diff,
              rating,
              tags: tags.slice(0, 3),
              primaryTopic: mapToPrimaryTopic(tags, p.name),
              url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
              acceptance: rating ? `Rating: ${rating}` : "Contest Problem",
              prompt: `Codeforces problem #${p.contestId}${p.index}: ${p.name}. Competitive programming challenge.`
            };
          });
      }
    }
  } catch (err) {
    console.warn("Could not fetch live Codeforces list, using rich curated set.", err);
  }

  // Merge datasets removing duplicate IDs
  const combined = [
    ...LEETCODE_CORE_PROBLEMS,
    ...(leetCodeFetched.length > 0 ? leetCodeFetched : []),
    ...GFG_CORE_PROBLEMS,
    ...CODEFORCES_FALLBACK_PROBLEMS,
    ...(codeforcesFetched.length > 0 ? codeforcesFetched : [])
  ];

  // Deduplicate by ID
  const seenIds = new Set();
  const uniqueQuestions = [];
  for (const q of combined) {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      uniqueQuestions.push(q);
    }
  }

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), questions: uniqueQuestions }));
  } catch {}

  return uniqueQuestions;
}
