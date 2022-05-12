import { useEffect, useState } from 'react';
import Track from 'components/Track';
import styles from './TrackPublication.module.css';


export default function TrackPublication({ participant }) {

    const [trackPublications, setTrackPublications] = useState([]);

    useEffect(() => {

        const handleTrackPublication = (trackPublications) => {
            console.log('Track published: ', trackPublications);
            setTrackPublications(prevPublications => [...prevPublications, trackPublications]);
        };
        const handleTrackUnpublished = (trackPublications) => {
            console.log('Track unpublished: ', trackPublications);
            setTrackPublications(prevPublications => prevPublications.filter(p => p !== trackPublications));
        };

        // Reset the publications when the 'participant' variable changes.
        setTrackPublications(Array.from(participant.tracks.values()));

        participant.on('trackPublished', handleTrackPublication);
        participant.on('trackUnpublished', handleTrackUnpublished);
        participant.on('trackRemoved', () => console.log('Track removed'));
        participant.on('trackDisabled', () => console.log('Track disabled'));
        participant.on('trackUnsuscribed', () => console.log('Track unsuscribed'));
        participant.on('trackStopped', () => console.log('Track stopped'));
        

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