import Create from 'components/Icons/Create';
import Home from 'components/Icons/Home';
import Search from 'components/Icons/Search';
import styles from 'components/Nav/Nav.module.css';
import Link from 'next/link';

export default function Nav() {
    return (
        <nav className={styles.nav}>
            <Link href="/home">
                <a>
                    <Home width={32} height={32} />
                </a>
            </Link>
            <Link href="/compose/tweet">
                <a>
                    <Search width={32} height={32} />
                </a>
            </Link>
            <Link href="/compose/tweet">
                <a>
                    <Create width={32} height={32} />
                </a>
            </Link>
        </nav>
    )
}