import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";

function Header() {
  return (
    <header>
      <div className={styles.workers}>
        <Link className={styles.a} to="/workers">
          Pracownicy
        </Link>
      </div>
      <div className={styles.plan}>
        <Link className={styles.a} to="/">
          Plan
        </Link>
      </div>
    </header>
  );
}

export default Header;
