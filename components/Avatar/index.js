import Image from 'next/image'
import styles from './Avatar.module.css';

export default function Avatar({ alt, src, text, sizeW, sizeH}) {

    return (
        <div className={styles.container}>
            <Image
                className={styles.avatar}
                src={src}
                alt={alt}
                width={sizeW ?? 49}
                height={sizeH ?? 49}
            />
            {text && <strong className={styles.strong}>{text}</strong>}
        </div>
    )

}