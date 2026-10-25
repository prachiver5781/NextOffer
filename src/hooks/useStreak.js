// Custom hook helper for calculating learning streak
// Helps track how many days in a row a student has practiced

// Returns date string in YYYY-MM-DD format for comparing dates easily
export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Function to calculate consecutive days of practice
export function calculateStreak(activeDates = []) {
  if (!activeDates || activeDates.length === 0) {
    return 0;
  }

  // Put dates in a Set for fast lookup
  const dateSet = new Set(activeDates);
  const today = new Date();
  const todayStr = getTodayDateString();

  // Find yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // If user practiced today or yesterday, start counting streak
  let currentDate = null;
  if (dateSet.has(todayStr)) {
    currentDate = today;
  } else if (dateSet.has(yesterdayStr)) {
    currentDate = yesterday;
  } else {
    // Streak broken if not practiced today or yesterday
    return 0;
  }

  let streak = 0;
  const tempDate = new Date(currentDate);

  // Go backwards day by day to count the continuous chain
  while (true) {
    const formatted = tempDate.toISOString().split("T")[0];
    if (dateSet.has(formatted)) {
      streak++;
      tempDate.setDate(tempDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
