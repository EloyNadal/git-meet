import { useEffect, useState } from 'react';
import VideoTrack from 'components/VideoTrack';

export default function Track({ trackPublication, userIdentity }) {

    const [track, setTrack] = useState([]);

    useEffect(() => {

        const removeTrack = () => setTrack(null);
        const handleTrackStarted = (track) => setTrack(track);

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

        if (track && track.kind === 'audio') {

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
                && <VideoTrack track={track} userIdentity={userIdentity}/>
            }
        </>
    );

}