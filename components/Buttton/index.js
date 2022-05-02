import styles from './Button.module.css';

export default function Button({ children, disabled, onClick, className }) {



    return (
        <button className={`${styles.button} ${styles[className]}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}