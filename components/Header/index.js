import Avatar from "components/Avatar";
import Button from "components/Button";
import GitHub from "components/Icons/GitHub";
import useUser, { USER_STATES } from "hooks/useUser";
import Image from "next/image";
import styles from './Header.module.css'
import { loginWithGitHub } from "services/firebase/client";
import Link from "next/link";

export default function Header({ withButtons = true }) {

  const user = useUser();

  const handleClick = () => {
    loginWithGitHub()
      .catch(err => {
        console.log(err)
      })
  }
 

  const handelClickRoom = () => {
    router.push(`/room/${uuidv4()}`);
  }

  return (
    <header className={styles.header}>

      <div className={styles.logoWrapper}>
        <Link href="/">
          <a><GitHub fill='#fff' width={32} height={32} /></a>
        </Link>
        
        <h1 className={styles.logo}>/ GitMeet</h1>
      </div>

      {withButtons && (
        <div className={styles.buttonsWrapper}>
          {
            user === USER_STATES.NOT_LOGGED &&
            <Button onClick={handleClick}>
              Iniciar sesión
            </Button>
          }
          
          <Button onClick={handelClickRoom} className={'secondary'} globalClasses={'d-none d-sm-inline-block'}>Iniciar nueva reunión</Button>
          
          {
            user === USER_STATES.NOT_KNOWN && <Image src={'/spinner.gif'} alt='loading' width={100} height={100} />
          }
          {
            user && user.avatar &&
            <Avatar src={user.avatar} alt={user.userName} sizeW={40} sizeH={40} />
          }
        </div>
      )}
    </header>
  );
}