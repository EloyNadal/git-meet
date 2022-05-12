import { useAppContext } from 'context/state';
import GitHub from 'components/Icons/GitHub';
import Button from 'components/Button';
import styles from './RoomLayout.module.css';
import Camera from 'components/Icons/Camera';
import CameraOff from 'components/Icons/CameraOff';
import Micro from 'components/Icons/Micro';
import MicroOff from 'components/Icons/MicroOff';
import Phone from 'components/Icons/Phone';

export default function RoomLayout({ children }) {

    const mycontext = useAppContext();

    return (
        <main className={styles.layout}>

            <header className={styles.header}>
                <div className={styles.logoWrapper}>
                    <a onClick={mycontext.handleExitRoom}>
                        <GitHub fill='#fff' width={32} height={32} />
                    </a>
                    <h1 className={styles.logo}>/ GitMeet</h1>
                </div>
            </header>

            <section className={styles.section}>
                {children}
            </section>

            <footer>
                <Button onClick={mycontext.handleChangeEnabledVideo}>
                    {mycontext.videoIsEnabled 
                        ? <Camera width={32} height={32} /> 
                        : <CameraOff width={32} height={32} />}
                </Button>
                <Button onClick={mycontext.handleExitRoom} className={'warning'}>
                    <Phone width={32} height={32} />
                </Button>
                <Button onClick={mycontext.handleChangeEnabledAudio}>
                    {mycontext.audioIsEnabled
                        ? <Micro width={32} height={32} /> 
                        : <MicroOff width={32} height={32} />}
                </Button>
            </footer>
        </main>
    );
}