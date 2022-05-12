import { useEffect, useRef, useState } from 'react';
import useGitUser from 'hooks/useGitUser';
import styles from './VideoTrack.module.css';

export default function VideoTrack({ track, userIdentity }) {

    const videoRef = useRef();
    const [isStopped , setIsStopped] = useState(false);
    const user = useGitUser(userIdentity);

    useEffect(() => {

        const videoContainer = videoRef.current;
        track.attach(videoContainer);

        track.on('disabled', () => { 
            setIsStopped(true);
        });

        track.on('enabled', () => { 
            setIsStopped(false);
        });

        /* track.on('stopped', () => { 
            setIsStopped(true);
        });
        track.on('started', () => { 
            setIsStopped(false);
        }); */

        return () => {
            track.detach(videoContainer);
            videoContainer.srcObject = null;

            track.off('disabled', () => setIsStopped(true));
            track.off('enabled', () => setIsStopped(false));
        };
    
    }, [track]);

    //lo del stopped no funciona como me gustaria. quiero que quede el cuadro pero no una letra de stop.
    return (
        <>
            <video className={styles.video} ref={videoRef} style={{display: isStopped ? 'none' : 'block'}}/>
            <div className={styles.noVideo} style={{display: !isStopped ? 'none' : 'grid'}}><span>{ user?.login[0] || 'I' }</span></div>
        
        </>
    );
}