import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
    <header className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <h1 className={styles.navTitle}>HelpingHands</h1>
          <nav className={styles.navLinks}>
            <a href="#">Home</a>
            <a href="#">Opportunities</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.header}>
          Join Us in Making a Difference
        </h1>
        <p className={styles.subheader}>
          Your community needs you
        </p>
        <button className={styles.matchButton} onClick={() => alert('Get matched functionality coming soon!')}>
          Get Matched
        </button>
      </main>
    </div>
  );
}