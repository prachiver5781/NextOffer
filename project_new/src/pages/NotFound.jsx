import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <span>404</span>
      <h2>Looks like this page missed the interview.</h2>
      <p>The page you are looking for doesn't exist.</p>
      <Link className="primary-button" to="/">
        ← Go home
      </Link>
    </section>
  );
}
