import Header from 'components/Header';
import GitHub from 'components/Icons/GitHub';
import styles from './RoomLayout.module.css';

export default function RoomLayout({ children }) {

    return (
        <main className={styles.layout}>
            
            <header className={styles.header}>
                <div className={styles.logoWrapper}>
                    <GitHub fill='#fff' width={32} height={32} />
                    <h1 className={styles.logo}>/ GitMeet</h1>
                </div>
            </header>

            <section className={styles.section}>
                {children}
            </section>

            <Header withButtons={false} />
        </main>
    );
}