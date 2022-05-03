import Layout from 'components/Layout';
import { useEffectOnce } from 'hooks/useEffectOnce';
import useUser, { USER_STATES } from 'hooks/useUser';
import { useEffect, useState, useRef } from 'react';
import { startRoom } from "services/twilio/client";


import styles from 'styles/pages/Room.module.css';

const ROOM_STATE = {
    CREATING: 'CREATING',
    JOINING: 'JOINING',
    JOINED: 'JOINED',
    ERROR: 'ERROR'
};

export default function LiveRoom({ roomId }) {

    const [roomState, setRoomState] = useState(ROOM_STATE.CREATING);
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const user = useUser();

    globalThis.test = () => {
        return {
            room
        };
    };

    const handleConnectedParticipant = (participant) => {
        console.log('Participant connected: ', participant);
        setParticipants((prevParticipants => {
            const newParticipants = [...prevParticipants, participant];
            return newParticipants;
        }));
    };

    const handleDisconnectedParticipant = (participant) => {
        console.log('Participant disconnected: ', participant);

        participant.removeAllListeners();
        setParticipants(prevParticipants => prevParticipants.filter(p => p.sid !== participant.sid));

        /* if(participants.length === 0) {
          room.disconnect();
        } */
    };

    const handleCloseRoom = (room) => {
        if (participants.length === 0) {
            room.disconnect();
        }
    };

    useEffect(() => {

        if (user !== USER_STATES.NOT_LOGGED && user) {

            console.log('user: ', user);
            const createRoom = async () => {
                const room = await startRoom(roomId, user.gitName);
                setRoom(room);
                setRoomState(ROOM_STATE.JOINED);
            }

            setRoomState(ROOM_STATE.JOINING);
            createRoom();
        }
    }, [user]);

    useEffect(() => {

        //Conectar a la sala
        if (room) {

            // participante local
            handleConnectedParticipant(room.localParticipant);

            // participantes remotos
            Array.from(room.participants.values()).forEach(handleConnectedParticipant);

            // escuchar participantes remotos
            room.on("participantConnected", handleConnectedParticipant);
            room.on('participantDisconnected', handleDisconnectedParticipant);

            // desconectar de la sala cuando se desconecta el usuario
            window.addEventListener("pagehide", () => handleCloseRoom(room));
            window.addEventListener("beforeunload", () => handleCloseRoom(room));

            return () => {
                room.off('participantConnected', handleConnectedParticipant);
                room.off('participantDisconnected', handleDisconnectedParticipant);
            };

        }

    }, [room]);

    return (
        <Layout>
            <div className={styles.room}>

                <div className={styles.room__principal_list_container}>

                    <div className={styles.room__principal}>
                        {room && participants.map(participant => <TrackPublication key={participant.identity} participant={participant} />)}
                    </div>


                    <div className={styles.room__participants_list}>
                        <ul>
                            {participants.map(participant => (
                                <li key={participant.sid}>{participant.identity}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </Layout>
    );

}

export async function getServerSideProps(context) {

    const { params, req, res } = context;
    const { roomId } = params;

    return { props: { roomId } };
}

function TrackPublication({ participant }) {

    const [trackPublications, setTrackPublications] = useState([]);

    useEffect(() => {

        const handleTrackPublication = (trackPublications) => {
            console.log('Track published: ', trackPublications);
            setTrackPublications(prevPublications => [...prevPublications, trackPublications]);
        };
        const handleTrackUnpublished = (trackPublications) => {
            setTrackPublications(prevPublications => prevPublications.filter(p => p !== trackPublications));
        };

        /* participant.tracks.forEach((trackPublication) => {
          handleTrackPublication(trackPublication, participant);
        }); */

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
                        <Track trackPublication={trackPublication} />
                    </div>
                );
            }
            )}
        </div>
    );

}

function Track({ trackPublication }) {

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
        <div className={styles.video__container}>
            {track && track.kind === 'video'
                && <video className={styles.video} ref={videoRef} />
            }
        </div>
    );

}