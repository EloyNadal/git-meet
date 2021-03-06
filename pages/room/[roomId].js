import { useEffect, useState } from 'react';
import useUser, { USER_STATES } from 'hooks/useUser';
import RoomLayout from 'components/RoomLayout';
import Participant from 'components/Participant';
import TrackPublication from 'components/TrackPublication';
import { v4 as uuidv4 } from 'uuid';
import { startRoom } from "services/twilio/client";
import styles from 'styles/pages/Room.module.css';
import { useAppContext } from 'context/state';
import Button from 'components/Button';
import People from 'components/Icons/People';
import Chat from 'components/Icons/Chat';
import Settings from 'components/Icons/Settings';


export default function LiveRoom({ roomId }) {

    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const user = useUser();
    //force build
    const mycontext = useAppContext();

    globalThis.test = () => {
        return {
            room,
            mycontext
        };
    };

    const handleConnectedParticipant = (participant) => {
        console.log('Participant connected: ', participant);

        if (participants.find(p => p.sid === participant.sid)) return;

        setParticipants((prevParticipants => {
            const newParticipants = [...prevParticipants, participant];
            return newParticipants;
        }));
    };

    const handleDisconnectedParticipant = (participant) => {
        console.log('Participant disconnected: ', participant);

        participant.removeAllListeners();
        setParticipants(prevParticipants => prevParticipants.filter(p => p.sid !== participant.sid));
    };

    const handleCloseRoom = (room) => {
        if (participants.length === 0) {
            room.disconnect();
        }
    };

    useEffect(() => {
        console.log('Estado usuario: ', user);
        const createRoom = async (userName) => {
            const room = await startRoom(roomId, userName);
            if (!room) {
                return;
            }
            setRoom(room);
        }

        if (user === USER_STATES.NOT_LOGGED) {
            console.log('guest: ');
            createRoom(uuidv4());
        }

        if (user !== USER_STATES.NOT_LOGGED && user) {
            console.log('user: ', user);
            createRoom(user.gitName);
        }
    }, [user]);

    useEffect(() => {

        //Conectar a la sala
        if (room) {

            mycontext.setContextRoom(room);

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
        <RoomLayout>
            <div className={styles.room}>

                <div className={styles.room__principal_list_container}>

                    <div className={`${styles.room__principal} ${participants.length}-participans`}>
                        {room && participants.map((participant) => <TrackPublication key={participant.identity} participant={participant} />)}
                    </div>

                    <section className={styles.room__participants_list}>
                        <header>
                            <h4>En la llamada</h4>
                        </header>

                        <ul>
                            {participants.map(participant => (
                                <li key={participant.sid}>
                                    <Participant id={participant.identity} />
                                </li>
                            ))}
                        </ul>

                        <footer>
                            <Button><People width={32} height={32} /></Button>
                            <Button><Chat width={32} height={32} /></Button>
                            <Button><Settings width={32} height={32} /></Button>
                        </footer>
                    </section>

                </div>
            </div>
        </RoomLayout>
    );

}

export async function getServerSideProps(context) {

    const { params, req, res } = context;
    const { roomId } = params;

    return { props: { roomId } };
}