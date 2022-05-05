import styles from './Button.module.css';

export default function Button({ children, disabled, onClick, className, ...props }) {
    
    return (
        <button className={`${styles.button} ${styles[className]}`} onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    )
}