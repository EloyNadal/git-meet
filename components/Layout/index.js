import Header from 'components/Header';
import Nav from 'components/Nav';
import useUser from 'hooks/useUser';
import styles from './Layout.module.css';

export default function Layout({ children }) {

    return (
        <main>
            <Header />
            <section className={styles.section}>
                {children}
            </section>
        </main>
    );
}