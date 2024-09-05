import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css'; 

export default function NavBar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" passHref>
          <div className={styles.logoContainer}>
            <Image
              src="/images/dove.png" 
              alt="HelpingHands Icon"
              width={40} 
              height={40} 
              className={styles.logoIcon}
            />
            <h1 className={styles.navTitle}>HelpingHands</h1>
          </div>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" passHref>Home</Link>
          <Link href="#">Opportunities</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
