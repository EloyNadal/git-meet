import styles from './Button.module.css';

export default function Button({ children, disabled, onClick }) {

    return (
        <button className={styles.button} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}