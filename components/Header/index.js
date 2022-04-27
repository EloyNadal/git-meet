import Avatar from "components/Avatar";
import Button from "components/Buttton";
import GitHub from "components/Icons/GitHub";
import useUser, {USER_STATES} from "hooks/useUser";
import Image from "next/image";
import styles from './Header.module.css'

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
                <Image  
                    className={styles.avatar}
                    src={'https://www.gstatic.com/meet/google_meet_horizontal_wordmark_2020q4_1x_icon_124_40_2373e79660dabbf194273d27aa7ee1f5.png'}
                    alt={'live-video'}
                    width={124}
                    height={40}/>
            </div>
            {/* Iniciar sesión */}
            {
              user === USER_STATES.NOT_LOGGED &&
              <Button onClick={handleClick}>
                <GitHub fill='#fff' width={24} height={24} />
                Login with GitHub
              </Button>
            } 
            {
              user === USER_STATES.NOT_KNOWN && <Image src={'/spinner.gif'} alt='loading' width={100} height={100} />
            }
            
            {/*Button Unirse a una reunion */}


            {/* Iniciar una reunion (lo mismo que iniciar sesión) */}

            {/* Avatar inicio de sesión */}
            {
                user && user.avatar &&
                <Avatar src={user.avatar} alt={user.userName} sizeW={40} sizeH={40} />
            }
        </header>
    );
}