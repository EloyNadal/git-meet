import Header from 'components/Header';
import styles from './Layout.module.css';

export default function Layout({ children }) {

    return (
        <main className={styles.layout}>
            <Header />
            <section className={styles.section}>
                {children}
            </section>
        </main>
    );
}