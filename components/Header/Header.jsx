'use client'
import React from 'react';
import styles from "./header.module.css";
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logoLink}>
                <Image 
                    src="/my_logo_white.png" 
                    alt="Logo" 
                    width={40} 
                    height={40} 
                    className={styles.logoImage}
                />
            </Link>

            <div className={styles.titleContainer}>
                <h1 className={styles.title}>TicTacToe Game</h1>
            </div>

            <nav className={styles.nav}>
                <Link 
                    href="https://github.com/JRanjan-Biswal/tic-tac-toe-game" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    GitHub
                </Link>
                <Link 
                    href="https://jyoti-ranjan-biswal.vercel.app/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Portfolio
                </Link>
            </nav>
        </header>
    );
};

export default Header;