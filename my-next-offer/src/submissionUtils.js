const STORAGE_KEY = "nextoffer-submissions";

export function getSubmissions() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveSubmission(submission) {
  const submissions = getSubmissions();
  const newSubmission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toLocaleString(),
    ...submission,
  };
  const updated = [newSubmission, ...submissions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteSubmission(id) {
  const updated = getSubmissions().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSubmissions() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
