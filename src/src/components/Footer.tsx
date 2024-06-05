import styles from "./styles/Footer.module.css";

function Footer() {
  return (
    <footer>
      <p className={styles.text}>
        Created by Fip & Flap &copy; {new Date().getFullYear()} All rights
        reserved
      </p>
    </footer>
  );
}

export default Footer;
