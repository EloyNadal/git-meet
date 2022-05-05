import { useEffect, useState } from 'react';
import Track from 'components/Track';
import styles from './TrackPublication.module.css';


export default function TrackPublication({ participant, numParticipants }) {

    const [trackPublications, setTrackPublications] = useState([]);

    useEffect(() => {

        const handleTrackPublication = (trackPublications) => {
            console.log('Track published: ', trackPublications);
            setTrackPublications(prevPublications => [...prevPublications, trackPublications]);
        };
        const handleTrackUnpublished = (trackPublications) => {
            setTrackPublications(prevPublications => prevPublications.filter(p => p !== trackPublications));
        };

        // Reset the publications when the 'participant' variable changes.
        setTrackPublications(Array.from(participant.tracks.values()));

        participant.on('trackPublished', handleTrackPublication);
        participant.on('trackUnpublished', handleTrackUnpublished);

        return () => {
            participant.off('trackPublished', handleTrackPublication);
            participant.off('trackUnpublished', handleTrackUnpublished);
        };

    }, [participant]);

    return (
        <div className={styles.track__container}>
            {trackPublications.map((trackPublication) => {
                return (
                    <div key={trackPublication.trackSid}>
                        <Track trackPublication={trackPublication} numParticipants={numParticipants}/>
                    </div>
                );
            }
            )}
        </div>
    );
}