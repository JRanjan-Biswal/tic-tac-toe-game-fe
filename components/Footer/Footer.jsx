import React from 'react';
import Link from 'next/link';
import styles from './footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.copyright}>
          <p>© {currentYear} Jyoti Ranjan Biswal. All rights reserved.</p>
        </div>
        
        <div className={styles.links}>
          <Link 
            href="https://jyoti-ranjan-biswal.vercel.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Portfolio
          </Link>
          <Link 
            href="https://github.com/JRanjan-Biswal/tic-tac-toe-game" 
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;