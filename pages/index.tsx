import Head from 'next/head';
import Navbar from '../components/Navbar'; // Import the Navbar component
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar /> {/* Use the Navbar component */}
      <main className={styles.main}>
        <h1 className={styles.header}>
          Join Us in Making a Difference
        </h1>
        <p className={styles.subheader}>
          Your community needs you
        </p>
        <a href="/quiz">
          <button className={styles.matchButton}>
            Get Matched
          </button>
        </a>
      </main>
    </div>
  );
}