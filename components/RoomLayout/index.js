import Header from 'components/Header';
import GitHub from 'components/Icons/GitHub';
import Link from 'next/link';
import styles from './RoomLayout.module.css';

/**
 * @todo
 * - [ ] desconectar usuario de la sala al ir a la página de inicio
 */

export default function RoomLayout({ children }) {

    return (
        <main className={styles.layout}>

            <header className={styles.header}>
                <div className={styles.logoWrapper}>
                    <Link href="/">
                        <a><GitHub fill='#fff' width={32} height={32} /></a>
                    </Link>
                    <h1 className={styles.logo}>/ GitMeet</h1>
                </div>
            </header>

            <section className={styles.section}>
                {children}
            </section>

            {/* <Header withButtons={false} /> */}
        </main>
    );
}