import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <main>
      <Button variant="dark">Dark</Button>{' '}
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
    </>
  );
}
