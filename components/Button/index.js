import styles from './Button.module.css';

export default function Button({ children, disabled, onClick, className, globalClasses, ...props }) {

    return (
        <button className={`${styles.button} ${styles[className]} ${globalClasses}`} onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    )
}
