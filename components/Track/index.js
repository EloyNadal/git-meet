import { useEffect, useState, useRef } from 'react';
import styles from './Track.module.css';

export default function Track({ trackPublication }) {

    const [track, setTrack] = useState([]);
    const videoRef = useRef();

    useEffect(() => {

        const removeTrack = () => setTrack(null);
        const handleTrackStarted = (track) => {
            console.log('Add Track: ', track);
            setTrack(track);
        }

        console.log('Track started: ', trackPublication.track);
        // Reset the track when the 'trackPublications' variable changes.
        setTrack(trackPublication && trackPublication.track);

        if (trackPublication) {

            trackPublication.on('subscribed', handleTrackStarted);
            trackPublication.on('unsubscribed', removeTrack);
            return () => {
                trackPublication.off('subscribed', handleTrackStarted);
                trackPublication.off('unsubscribed', removeTrack);
            };
        }
    }, [trackPublication]);

    useEffect(() => {

        const videoContainer = videoRef.current;

        if (track && track.kind === 'video') {

            track.attach(videoContainer);
            return () => {
                track.detach(videoContainer);
                videoContainer.srcObject = null;
            };
        } else if (track && track.kind === 'audio') {

            /* const audio = document.createElement('audio');
            audio.srcObject = track.attach();       */
            const audio = track.attach();
            document.body.appendChild(audio);

            return () => {

                track.detach().forEach(el => {
                    el.remove();
                    el.srcObject = null;
                });

            };

        }

    }, [track]);


    return (
        <>
            {track && track.kind === 'video'
                && <video className={styles.video} ref={videoRef} />
            }
        </>
    );

}