import { useEffect, useState } from 'react';
import Track from 'components/Track';
import styles from './TrackPublication.module.css';


export default function TrackPublication({ participant }) {

    const [trackPublications, setTrackPublications] = useState([]);

    useEffect(() => {

        const handleTrackPublication = (trackPublications) => {
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
        <>
            {trackPublications.map((trackPublication) => 
                <Track key={trackPublication.trackSid} trackPublication={trackPublication} userIdentity={participant.identity}/> 
            )}
        </>
    );
}