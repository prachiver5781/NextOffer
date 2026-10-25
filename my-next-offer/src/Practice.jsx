// Challenge workspace with real remote execution through the Piston code-execution API.
import React, { useEffect, useState } from "react";
import { useParams, Navigate, Link, useSearchParams } from "react-router-dom";
import { topics } from "./data";
import { getTodayDateString } from "./hooks";
import ExternalQuestions from "./ExternalQuestions";
import { saveSubmission } from "./submissionUtils";

const EXECUTION_API = "https://emkc.org/api/v2/piston/execute";
const LANGUAGE_CONFIG = {
  JavaScript: { language: "javascript", version: "18.15.0" },
  Python: { language: "python", version: "3.10.0" },
  Java: { language: "java", version: "15.0.2" }
};

const LANGUAGE_STARTERS = {
  JavaScript: (q) => q.starterCode || "// Write your JavaScript solution here\n",
  Python: (q) => `# ${q.title}\n# ${q.prompt}\n\ndef solution():\n    # Write your Python solution here\n    pass\n\nprint(solution())\n`,
  Java: (q) => `// ${q.title}\n// ${q.prompt}\n\nimport java.util.*;\n\nclass Solution {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n`
};

export default function Practice({ currentUser, updateUser }) {
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);
  const [searchParams] = useSearchParams();
  const [activeQId, setActiveQId] = useState(() => searchParams.get("question") || null);
  const userStorageId = currentUser?.id || currentUser?.email || "guest";
  const draftsStorageKey = `nextoffer_code_drafts_${userStorageId}`;
  const languageStorageKey = `nextoffer_code_language_${userStorageId}`;
  const inputStorageKey = `nextoffer_sample_inputs_${userStorageId}`;
  const readStoredObject = (key, fallback) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch { return fallback; }
  };
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(languageStorageKey);
      return LANGUAGE_CONFIG[saved] ? saved : "JavaScript";
    } catch { return "JavaScript"; }
  });
  const [codeDrafts, setCodeDrafts] = useState(() => readStoredObject(draftsStorageKey, {}));
  const [dirtyDrafts, setDirtyDrafts] = useState({});
  const [feedback, setFeedback] = useState({});
  const [sampleInput, setSampleInput] = useState(() => readStoredObject(inputStorageKey, {}));
  const [runResults, setRunResults] = useState({});
  const [runningQuestion, setRunningQuestion] = useState(null);

  // Persist editor drafts, language choice, and custom stdin per user.
  useEffect(() => {
    try { localStorage.setItem(draftsStorageKey, JSON.stringify(codeDrafts)); }
    catch (error) { console.warn("Could not save code drafts:", error); }
  }, [codeDrafts, draftsStorageKey]);
  useEffect(() => {
    try { localStorage.setItem(languageStorageKey, language); }
    catch (error) { console.warn("Could not save editor language:", error); }
  }, [language, languageStorageKey]);
  useEffect(() => {
    try { localStorage.setItem(inputStorageKey, JSON.stringify(sampleInput)); }
    catch (error) { console.warn("Could not save sample inputs:", error); }
  }, [sampleInput, inputStorageKey]);

  useEffect(() => {
    if (!topic) return;
    const storageKey = `nextoffer_recently_viewed_${currentUser?.id || currentUser?.email || "guest"}`;
    try {
      const previous = JSON.parse(localStorage.getItem(storageKey) || "[]");
      localStorage.setItem(storageKey, JSON.stringify([
        { type: "topic", id: topic.id, title: topic.title, subtitle: `${topic.questions?.length || 0} practice questions · Topic`, to: `/topics/${topic.id}`, viewedAt: new Date().toISOString() },
        ...previous.filter(item => !(item.type === "topic" && item.id === topic.id))
      ].slice(0, 5)));
    } catch (error) { console.warn("Could not save recently viewed topics:", error); }
  }, [topic, currentUser?.id, currentUser?.email]);

  const hasUnsaved = Object.values(dirtyDrafts).some(Boolean);
  useEffect(() => {
    const warn = (event) => { if (hasUnsaved) { event.preventDefault(); event.returnValue = "You have unsaved code changes."; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsaved]);

  const questions = topic?.questions || [];
  useEffect(() => {
    const requestedQuestion = searchParams.get("question");
    if (requestedQuestion && questions.some((question) => String(question.id) === requestedQuestion)) setActiveQId(requestedQuestion);
  }, [topicId, searchParams, topic]);

  if (!topic) return <Navigate to="/topics" replace />;
  const draftKey = (qId, lang = language) => `${qId}::${lang}`;
  const codeFor = (q) => codeDrafts[draftKey(q.id)] ?? LANGUAGE_STARTERS[language](q);

  const changeLanguage = (nextLanguage) => {
    if (hasUnsaved && !window.confirm("You have unsaved code changes. Switch language anyway? Your draft will remain saved in this page.")) return;
    setLanguage(nextLanguage);
  };
  const resetCode = (q) => {
    if (dirtyDrafts[draftKey(q.id)] && !window.confirm("Reset this editor to the starter code? Your edits for this language will be lost.")) return;
    setCodeDrafts(prev => {
      const next = { ...prev };
      delete next[draftKey(q.id)];
      try { localStorage.setItem(draftsStorageKey, JSON.stringify(next)); } catch {}
      return next;
    });
    setDirtyDrafts(prev => ({ ...prev, [draftKey(q.id)]: false }));
    setFeedback(prev => ({ ...prev, [q.id]: null }));
  };
  const runCode = async (q) => {
    const config = LANGUAGE_CONFIG[language];
    if (!config) return;
    setRunningQuestion(q.id);
    setRunResults(prev => ({ ...prev, [q.id]: { state: "running", output: "Sending code to the execution service…" } }));
    try {
      const response = await fetch(EXECUTION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          files: [{ name: language === "Java" ? "Main.java" : language === "Python" ? "main.py" : "main.js", content: codeFor(q) }],
          stdin: sampleInput[q.id] || "",
          args: [],
          compile_timeout: 10000,
          run_timeout: 5000
        })
      });
      if (!response.ok) throw new Error(`Execution service returned HTTP ${response.status}. Please try again later.`);
      const result = await response.json();
      const compileOutput = result.compile?.output || "";
      const runOutput = result.run?.output || "";
      const stderr = [result.compile?.stderr, result.run?.stderr].filter(Boolean).join("\n");
      const output = [compileOutput, runOutput, stderr ? `Errors / diagnostics:\n${stderr}` : ""].filter(Boolean).join("\n").trim() || "Program finished with no output.";
      const exitCode = result.run?.code;
      const state = result.compile?.code && result.compile.code !== 0 ? "compile-error" : (exitCode === 0 ? "success" : "runtime-error");
      setRunResults(prev => ({ ...prev, [q.id]: { state, output, exitCode, language, ranAt: new Date().toISOString() } }));
      return { state, output, exitCode };
    } catch (error) {
      const message = error?.message || "Could not reach the code execution service.";
      setRunResults(prev => ({ ...prev, [q.id]: { state: "service-error", output: `${message}\nCheck your internet connection, then try again.` } }));
      return { state: "service-error", output: message };
    } finally {
      setRunningQuestion(null);
    }
  };

  const handleSubmit = async (q) => {
    const result = await runCode(q);
    if (!result) return;
    const today = getTodayDateString();
    const activeDates = new Set(currentUser?.activeDates || []); activeDates.add(today);
    const completed = new Set(currentUser?.completed || []);
    if (result.state === "success") completed.add(topic.id);
    const submittedAt = new Date().toISOString();
    const newSubmission = {
      id: `sub_${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      questionId: q.id,
      questionTitle: q.title,
      code: codeFor(q),
      language,
      status: result.state === "success" ? "Executed successfully" : result.state === "compile-error" ? "Compilation error" : result.state === "runtime-error" ? "Runtime error" : "Execution unavailable",
      submittedAt,
      output: result.output,
      exitCode: result.exitCode,
      sampleTest: q.sampleTest || "No sample test case provided.",
      userSampleInput: sampleInput[q.id] || "",
      executionMode: "Executed remotely using the Piston code execution API. Output reflects this run; sample test cases are not automatically graded."
    };

    const existingSubs = currentUser?.submissions || [];
    const updatedSubs = [...existingSubs, newSubmission];
    const uniqueCount = new Set(updatedSubs.map((s) => s.questionId || s.questionTitle)).size;

    updateUser({
      ...currentUser,
      completed: [...completed],
      activeDates: [...activeDates],
      submissions: updatedSubs,
      profile: {
        ...currentUser?.profile,
        stats: {
          ...currentUser?.profile?.stats,
          problems: uniqueCount,
          projects: currentUser?.projects?.length || currentUser?.profile?.stats?.projects || 0
        }
      }
    });

    saveSubmission(newSubmission);
    setDirtyDrafts(prev => ({ ...prev, [draftKey(q.id)]: false }));
    setFeedback(prev => ({ ...prev, [q.id]: { submittedAt, language, status: newSubmission.status } }));
  };

  return <section style={{ maxWidth: 1000, margin: "0 auto" }}>
    <Link to="/topics" style={{ color: "#818cf8", fontSize: 13.5, display: "inline-block", marginBottom: 16 }}>← Back to Practice Library</Link>
    <div className="dashboard-panel-card" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}><span className="badge-tag-purple">{topic.type}</span><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{topic.level}</span></div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)" }}>{topic.title}</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{topic.description}</p>
    </div>
    <div className="dashboard-panel-card" style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div><strong>Code workspace</strong><p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Run Java, Python, or JavaScript code remotely and review the output below.</p></div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>Language <select value={language} onChange={e => changeLanguage(e.target.value)} className="filter-search-input" style={{ minWidth: 145 }}><option>JavaScript</option><option>Python</option><option>Java</option></select></label>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {questions.map((q, idx) => {
        const isOpen = activeQId === q.id;
        const codeVal = codeFor(q);
        const key = draftKey(q.id);
        return <div className="dashboard-panel-card" key={q.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => {
            const nextOpen = isOpen ? null : q.id;
            setActiveQId(nextOpen);
            if (nextOpen) {
              const storageKey = `nextoffer_recently_viewed_${currentUser?.id || currentUser?.email || "guest"}`;
              try {
                const previous = JSON.parse(localStorage.getItem(storageKey) || "[]");
                const entry = { type: "question", id: q.id, questionId: q.id, topicId: topic.id, title: q.title, subtitle: `${topic.title} · Question`, to: `/topics/${topic.id}?question=${encodeURIComponent(q.id)}`, viewedAt: new Date().toISOString() };
                localStorage.setItem(storageKey, JSON.stringify([entry, ...previous.filter(item => !(item.type === "question" && item.id === q.id && item.topicId === topic.id))].slice(0, 8)));
              } catch (error) { console.warn("Could not save question history:", error); }
            }
          }}>
            <div><span style={{ color: "var(--cyan)", fontWeight: 800, marginRight: 8 }}>#{idx + 1}</span><strong style={{ fontSize: 15 }}>{q.title}</strong></div>
            <button className="view-code-btn" type="button">{isOpen ? "Hide Editor ▲" : "Solve Problem ▼"}</button>
          </div>
          {isOpen && <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 12 }}>{q.prompt}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 12 }}>
              <div style={{ padding: 12, background: "var(--bg-app)", borderRadius: 8, border: "1px solid var(--border-main)" }}><strong style={{ fontSize: 12 }}>Sample input / output</strong><p style={{ fontSize: 12.5, marginTop: 6, whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>{q.sampleTest || "No sample test case available."}</p></div>
              <div style={{ padding: 12, background: "var(--bg-app)", borderRadius: 8, border: "1px solid var(--border-main)" }}><label style={{ fontSize: 12, fontWeight: 700 }}>Program input / stdin (optional)</label><textarea rows={2} value={sampleInput[q.id] || ""} onChange={e => setSampleInput(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder="Input passed to your program when you click Run…" style={{ width: "100%", marginTop: 6, padding: 8, background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: 6 }} /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}><span style={{ fontSize: 12, color: dirtyDrafts[key] ? "#f59e0b" : "var(--text-muted)" }}>{dirtyDrafts[key] ? "● Unsaved edits" : "Draft stays in this editor until you leave this page"}</span><button className="view-code-btn" type="button" onClick={() => resetCode(q)}>↺ Reset code</button></div>
            <textarea aria-label={`${language} code editor for ${q.title}`} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: "100%", minHeight: 240, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13, background: "#0a0e1a", color: "#a5b4fc", padding: 14, borderRadius: 8, border: "1px solid var(--border-main)", outline: "none", lineHeight: 1.6, tabSize: 2 }} value={codeVal} onChange={e => { setCodeDrafts(prev => ({ ...prev, [key]: e.target.value })); setDirtyDrafts(prev => ({ ...prev, [key]: true })); }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              <span style={{ color: "var(--text-subtle)", fontSize: 12 }}>Runs code in a remote sandbox. Do not submit secrets or personal data.</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="view-code-btn" type="button" disabled={runningQuestion === q.id} onClick={() => runCode(q)}>{runningQuestion === q.id ? "Running…" : "▶ Run code"}</button>
                <button className="btn-primary-gradient" type="button" disabled={runningQuestion === q.id} onClick={() => handleSubmit(q)}>{runningQuestion === q.id ? "Submitting…" : "Submit Solution ✓"}</button>
              </div>
            </div>
            {runResults[q.id] && <div role="status" style={{ marginTop: 12, padding: 12, borderRadius: 8, background: runResults[q.id].state === "success" ? "rgba(16,185,129,.10)" : runResults[q.id].state === "running" ? "rgba(99,102,241,.10)" : "rgba(239,68,68,.10)", border: `1px solid ${runResults[q.id].state === "success" ? "rgba(16,185,129,.35)" : runResults[q.id].state === "running" ? "rgba(99,102,241,.35)" : "rgba(239,68,68,.35)"}`, color: "var(--text-main)", fontSize: 13 }}><strong>{runResults[q.id].state === "success" ? "Execution completed" : runResults[q.id].state === "running" ? "Executing code…" : runResults[q.id].state === "compile-error" ? "Compilation failed" : runResults[q.id].state === "runtime-error" ? "Program finished with an error" : "Execution service unavailable"}</strong><pre style={{ whiteSpace: "pre-wrap", overflowX: "auto", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{runResults[q.id].output}</pre></div>}
            {feedback[q.id] && (
              <div role="status" style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(16,185,129,.10)", border: "1px solid rgba(16,185,129,.3)", color: "var(--text-main)", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div><strong>✓ Submission saved.</strong> {feedback[q.id].language} solution recorded at {new Date(feedback[q.id].submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Status: {feedback[q.id].status}.</div>
                <Link to="/submissions" style={{ color: "var(--cyan)", fontWeight: 700, textDecoration: "underline", fontSize: 12.5 }}>View in Submissions →</Link>
              </div>
            )}
          </div>}
        </div>;
      })}
    </div>
    <ExternalQuestions topicTitle={topic.title} currentUser={currentUser} updateUser={updateUser} />
  </section>;
}
