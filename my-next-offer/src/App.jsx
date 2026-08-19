import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";


import {

  Link,

  NavLink,

  Navigate,

  Outlet,

  Route,

  Routes,

  useNavigate,

  useParams

} from "react-router-dom";


import {
  mockQuestions,
  resumeTips,
  roadmap,
  topics
} from "./data";


import { useLocalStorage } from "./hooks";



/* =========================
   NAVBAR + LAYOUT
========================= */

function Layout({ loggedIn, setLoggedIn }) {

  return (

    <div className="app-shell">

      <header className="navbar">

        <Link
          className="brand"
          to="/"
        >
          Next<span>Offer</span>
        </Link>


        <nav>

          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/topics">
            Topics
          </NavLink>

          <NavLink to="/roadmap">
            Roadmap
          </NavLink>

          <NavLink to="/mock-interview">
            Mock Interview
          </NavLink>

          <NavLink to="/resume">
            Resume
          </NavLink>

        </nav>


        <button

          className="small-button"

          onClick={() =>
            setLoggedIn(!loggedIn)
          }

        >

          {loggedIn
            ? "Log out"
            : "Demo login"}

        </button>

      </header>


      <main>

        <Outlet />

      </main>


      <footer>

        <p>
          NextOffer • Built for students who want their next offer.
        </p>

      </footer>

    </div>

  );

}



/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({ loggedIn }) {

  return loggedIn
    ? <Outlet />
    : <Navigate to="/login" replace />;

}



/* =========================
   HOME
========================= */

function Home() {

  return (

    <section className="hero">

      <div className="hero-content">

        <p className="eyebrow">
          INTERVIEW PREPARATION, WITHOUT THE CHAOS
        </p>


        <h1>

          Prepare today.

          <br />

          <span>
            Get your NextOffer.
          </span>

        </h1>


        <p className="hero-text">

          Practice DSA, learn frontend concepts,
          revise React and JavaScript, prepare for
          mock interviews and track what you have completed.

        </p>


        <div className="hero-actions">

          <Link
            className="primary-button"
            to="/dashboard"
          >
            Start preparing
          </Link>


          <Link
            className="secondary-button"
            to="/topics"
          >
            Explore topics
          </Link>

        </div>

      </div>



      <div className="hero-card">

        <div className="card-top">

          <span>
            Today's progress
          </span>

          <strong>
            68%
          </strong>

        </div>


        <div className="progress">

          <div
            style={{
              width: "68%"
            }}
          />

        </div>


        <p>
          Keep going — 3 small tasks left.
        </p>


        <div className="mini-task done">
          ✓ Arrays revision
        </div>


        <div className="mini-task done">
          ✓ React props
        </div>


        <div className="mini-task">
          ○ Mock interview
        </div>

      </div>

    </section>

  );

}



/* =========================
   DASHBOARD
========================= */

function Dashboard({ completed }) {

  const completedCount =
    completed.length;


  const percentage =
    Math.round(
      (completedCount / topics.length) * 100
    );


  return (

    <section className="page">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            YOUR SPACE
          </p>

          <h2>
            Welcome back 👋
          </h2>

          <p>
            Pick one thing and make progress today.
          </p>

        </div>


        <Link
          className="primary-button"
          to="/topics"
        >
          Practice now
        </Link>

      </div>



      <div className="stats-grid">

        <div className="stat-card">

          <strong>
            {completedCount}
          </strong>

          <span>
            Topics completed
          </span>

        </div>


        <div className="stat-card">

          <strong>
            {topics.length - completedCount}
          </strong>

          <span>
            Topics remaining
          </span>

        </div>


        <div className="stat-card">

          <strong>
            {percentage}%
          </strong>

          <span>
            Overall progress
          </span>

        </div>

      </div>



      <div className="content-grid">


        <section className="panel">

          <h3>
            Continue your roadmap
          </h3>


          {roadmap
            .slice(0, 3)
            .map((item) => (

              <div
                className="roadmap-row"
                key={item.week}
              >

                <span>
                  {item.week}
                </span>


                <div>

                  <strong>
                    {item.title}
                  </strong>

                  <small>
                    {item.items
                      .slice(0, 3)
                      .join(" • ")}
                  </small>

                </div>

              </div>

            ))}


          <Link
            className="text-link"
            to="/roadmap"
          >
            View full roadmap →
          </Link>

        </section>



        <section className="panel">

          <h3>
            Quick interview questions
          </h3>


          {mockQuestions
            .slice(0, 3)
            .map((item) => (

              <div
                className="question-preview"
                key={item.id}
              >

                <span>
                  {item.topic}
                </span>

                <p>
                  {item.question}
                </p>

              </div>

            ))}

        </section>

      </div>

    </section>

  );

}



/* =========================
   TOPICS
========================= */

function Topics({
  completed,
  setCompleted
}) {

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");


  const searchRef =
    useRef(null);



  useEffect(() => {

    searchRef.current?.focus();

  }, []);



  const filteredTopics = useMemo(() => {

    return topics.filter((topic) => {

      const matchesSearch =

        topic.title
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        topic.description
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesFilter =

        filter === "All"
        ||
        topic.type === filter;


      return matchesSearch && matchesFilter;

    });

  }, [search, filter]);



  const toggleComplete = useCallback(
    (id) => {

      setCompleted((old) =>

        old.includes(id)

          ? old.filter(
              (item) => item !== id
            )

          : [...old, id]

      );

    },
    [setCompleted]
  );



  return (

    <section className="page">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            PRACTICE LIBRARY
          </p>

          <h2>
            Choose a topic
          </h2>

          <p>
            Search what you need instead of
            scrolling through everything.
          </p>

        </div>

      </div>



      <div className="filters">

        <input

          ref={searchRef}

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          placeholder="Search topics..."

        />


        {[
          "All",
          "DSA",
          "JavaScript",
          "React",
          "Frontend"
        ].map((item) => (

          <button

            key={item}

            className={
              filter === item
                ? "filter active"
                : "filter"
            }

            onClick={() =>
              setFilter(item)
            }

          >

            {item}

          </button>

        ))}

      </div>



      <div className="topic-grid">

        {filteredTopics.map((topic) => {

          const done =
            completed.includes(topic.id);


          return (

            <article
              className="topic-card"
              key={topic.id}
            >

              <div className="topic-meta">

                <span>
                  {topic.type}
                </span>

                <span>
                  {topic.level}
                </span>

              </div>


              <h3>
                {topic.title}
              </h3>


              <p>
                {topic.description}
              </p>


              <div className="topic-actions">

                <Link

                  className="secondary-button"

                  to={`/topics/${topic.id}`}

                >
                  Open topic
                </Link>


                <button

                  className={
                    done
                      ? "complete-button done"
                      : "complete-button"
                  }

                  onClick={() =>
                    toggleComplete(topic.id)
                  }

                >

                  {done
                    ? "✓ Completed"
                    : "Mark complete"}

                </button>

              </div>

            </article>

          );

        })}

      </div>



      {filteredTopics.length === 0 && (

        <div className="empty">

          No topic found.
          Try another search.

        </div>

      )}

    </section>

  );

}



/* =========================
   DYNAMIC TOPIC PAGE
========================= */

function TopicDetails({
  completed,
  setCompleted
}) {

  const { topicId } =
    useParams();


  const topic =
    topics.find(
      (item) =>
        item.id === topicId
    );


  if (!topic) {

    return (
      <Navigate
        to="/404"
        replace
      />
    );

  }


  const done =
    completed.includes(topic.id);



  function markComplete() {

    setCompleted((old) =>

      old.includes(topic.id)
        ? old
        : [...old, topic.id]

    );

  }



  return (

    <section className="page narrow">

      <Link
        className="back-link"
        to="/topics"
      >
        ← Back to topics
      </Link>


      <div className="detail-card">

        <span className="pill">
          {topic.type}
        </span>


        <h2>
          {topic.title}
        </h2>


        <p>
          {topic.description}
        </p>


        <h3>
          Practice questions
        </h3>


        <div className="question-list">

          {topic.questions.map(
            (question, index) => (

              <div
                className="practice-question"
                key={question}
              >

                <strong>
                  {index + 1}
                </strong>

                <span>
                  {question}
                </span>

              </div>

            )
          )}

        </div>


        <button
          className="primary-button"
          onClick={markComplete}
        >

          {done
            ? "Topic completed ✓"
            : "Mark topic as complete"}

        </button>

      </div>

    </section>

  );

}



/* =========================
   ROADMAP
========================= */

function Roadmap() {

  return (

    <section className="page">

      <p className="eyebrow">
        LEARNING PATH
      </p>


      <h2>
        Frontend Interview Roadmap
      </h2>


      <p className="section-intro">

        A simple order based only on
        the technologies used in this project.

      </p>



      <div className="timeline">

        {roadmap.map((item) => (

          <article
            className="timeline-card"
            key={item.week}
          >

            <span>
              {item.week}
            </span>


            <div>

              <h3>
                {item.title}
              </h3>


              <div className="tag-list">

                {item.items.map(
                  (skill) => (

                    <span key={skill}>
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          </article>

        ))}

      </div>

    </section>

  );

}



/* =========================
   MOCK INTERVIEW
========================= */

function MockInterview() {

  const [current, setCurrent] =
    useState(0);


  const [showAnswer, setShowAnswer] =
    useState(false);


  const [score, setScore] =
    useState(0);


  const question =
    mockQuestions[current];



  function nextQuestion() {

    setScore((old) =>
      old + (showAnswer ? 0 : 1)
    );


    setShowAnswer(false);


    setCurrent((old) =>
      (old + 1) %
      mockQuestions.length
    );

  }



  return (

    <section className="page narrow">

      <p className="eyebrow">
        MOCK INTERVIEW
      </p>


      <h2>
        Think before you peek.
      </h2>


      <p className="section-intro">

        Read the question,
        answer it yourself,
        then reveal the sample answer.

      </p>



      <div className="interview-card">

        <div className="question-number">

          Question {current + 1}
          {" / "}
          {mockQuestions.length}

        </div>


        <span className="pill">
          {question.topic}
        </span>


        <h3>
          {question.question}
        </h3>


        {showAnswer && (

          <div className="answer">
            {question.answer}
          </div>

        )}


        <div className="interview-actions">

          <button

            className="secondary-button"

            onClick={() =>
              setShowAnswer(!showAnswer)
            }

          >

            {showAnswer
              ? "Hide answer"
              : "Show answer"}

          </button>


          <button

            className="primary-button"

            onClick={nextQuestion}

          >

            Next question →

          </button>

        </div>


        <small>
          Self-score: {score}
        </small>

      </div>

    </section>

  );

}



/* =========================
   RESUME
========================= */

function Resume() {

  const [saved, setSaved] =
    useState(false);



  function handleSubmit(e) {

    e.preventDefault();

    setSaved(true);

  }



  return (

    <section className="page">

      <p className="eyebrow">
        RESUME GUIDANCE
      </p>


      <h2>
        Make your resume easy to explain.
      </h2>



      <div className="content-grid">


        <section className="panel">

          <h3>
            Quick checklist
          </h3>


          {resumeTips.map(
            (tip, index) => (

              <div
                className="tip"
                key={tip}
              >

                <strong>
                  {index + 1}
                </strong>

                <span>
                  {tip}
                </span>

              </div>

            )
          )}

        </section>



        <section className="panel">

          <h3>
            Save a project idea
          </h3>


          <form
            onSubmit={handleSubmit}
            className="project-form"
          >

            <label>

              Project name

              <input
                required
                placeholder="e.g. NextOffer"
              />

            </label>


            <label>

              One-line description

              <textarea
                required
                placeholder="What did you build?"
              />

            </label>


            <button
              className="primary-button"
              type="submit"
            >
              Save project
            </button>


            {saved && (

              <p className="success">
                Saved for this session ✓
              </p>

            )}

          </form>

        </section>

      </div>

    </section>

  );

}



/* =========================
   LOGIN
========================= */

function Login({ setLoggedIn }) {

  const navigate =
    useNavigate();


  const [name, setName] =
    useState("");



  function handleSubmit(e) {

    e.preventDefault();


    if (!name.trim()) {
      return;
    }


    setLoggedIn(true);

    navigate("/dashboard");

  }



  return (

    <section className="login-page">

      <form
        className="login-card"
        onSubmit={handleSubmit}
      >

        <Link
          className="brand"
          to="/"
        >
          Next<span>Offer</span>
        </Link>


        <h2>
          Welcome to NextOffer
        </h2>


        <p>

          Enter your name to start
          your preparation space.

        </p>


        <label>

          Your name

          <input

            value={name}

            onChange={(e) =>
              setName(e.target.value)
            }

            placeholder="Enter your name"

          />

        </label>


        <button
          className="primary-button full"
          type="submit"
        >

          Enter NextOffer

        </button>

      </form>

    </section>

  );

}



/* =========================
   404
========================= */

function NotFound() {

  return (

    <section className="not-found">

      <span>
        404
      </span>


      <h2>
        Looks like this page missed the interview.
      </h2>


      <p>
        The page you are looking for does not exist.
      </p>


      <Link
        className="primary-button"
        to="/"
      >
        Go home
      </Link>

    </section>

  );

}



/* =========================
   MAIN APP
========================= */

export default function App() {

  const [loggedIn, setLoggedIn] =
    useState(false);


  const [completed, setCompleted] =
    useLocalStorage(
      "nextoffer-completed",
      []
    );



  return (

    <Routes>

      {/* Login */}

      <Route

        path="/login"

        element={
          <Login
            setLoggedIn={setLoggedIn}
          />
        }

      />



      {/* Main Layout */}

      <Route

        element={

          <Layout

            loggedIn={loggedIn}

            setLoggedIn={setLoggedIn}

          />

        }

      >

        <Route
          index
          element={<Home />}
        />


        {/* Protected Pages */}

        <Route
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
            />
          }
        >

          <Route

            path="dashboard"

            element={
              <Dashboard
                completed={completed}
              />
            }

          />


          <Route

            path="topics"

            element={

              <Topics

                completed={completed}

                setCompleted={setCompleted}

              />

            }

          />


          <Route

            path="topics/:topicId"

            element={

              <TopicDetails

                completed={completed}

                setCompleted={setCompleted}

              />

            }

          />


          <Route

            path="roadmap"

            element={<Roadmap />}

          />


          <Route

            path="mock-interview"

            element={<MockInterview />}

          />


          <Route

            path="resume"

            element={<Resume />}

          />

        </Route>



        {/* 404 */}

        <Route
          path="404"
          element={<NotFound />}
        />


        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>

    </Routes>

  );

}