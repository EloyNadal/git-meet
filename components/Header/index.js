import Avatar from "components/Avatar";
import Button from "components/Buttton";
import GitHub from "components/Icons/GitHub";
import useUser, {USER_STATES} from "hooks/useUser";
import Image from "next/image";
import styles from './Header.module.css'
import { loginWithGitHub } from "services/firebase/client";

export default function Header() {

    const user = useUser();

    const handleClick = () => {
        loginWithGitHub()
          .catch(err => {
            console.log(err)
          })
    }

    return (
        <header className={styles.header}>
            
            <div className={styles.logoWrapper}>
                <GitHub fill='#fff' width={32} height={32} />
                <h1 className={styles.logo}>/ GitMeet</h1>
            </div>
            
            <div className={styles.buttonsWrapper}>
            {
              user === USER_STATES.NOT_LOGGED &&
              <Button onClick={handleClick}>
                Iniciar sesión
              </Button>
            } 
            {
              user === USER_STATES.NOT_KNOWN && <Image src={'/spinner.gif'} alt='loading' width={100} height={100} />
            }
            
            <Button className={'secondary'}>Iniciar nueva reunión</Button>
            <Button>Unirse a reunión</Button>

            {/* Avatar inicio de sesión */}
            {
                user && user.avatar &&
                <Avatar src={user.avatar} alt={user.userName} sizeW={40} sizeH={40} />
            }
            </div>
        </header>
    );
}