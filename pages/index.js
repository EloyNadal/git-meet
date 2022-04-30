import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import useUser from 'hooks/useUser';
import Button from 'components/Buttton';
import { startRoom } from 'services/twilio/client.js';

import styles from 'styles/pages/Home.module.css';

export default function Home() {

  const user = useUser();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  /**
   * @todo
   * Cada vez que creemos una sala, redirigiremos a una nueva url y la crearemos allí
   * - Enviar nombre de usuario
   */

  const handelClick = () => {
    createRoom();
  }

  const createRoom = async () => {

    const room = await startRoom();
    setRoom(room);
  }

  useEffect(() => {

    const handleConnectedParticipant  = (participant) => {
      console.log('Participant connected: ', participant);
      setParticipants([...participants, participant]);
    };

    const handleDisconnectedParticipant = (participant) => {
      console.log('Participant disconnected: ', participant);

      // stop listening for this participant
      participant.removeAllListeners();

      setParticipants(participants.filter(p => p.sid !== participant.sid));
    };

    //Conectar a la sala
    if (room) {

      // participante local
      handleConnectedParticipant (room.localParticipant);

      // participantes remotos
      room.participants.forEach(handleConnectedParticipant);

      // escuchar participantes remotos
      room.on("participantConnected", handleConnectedParticipant );
      room.on('participantDisconnected', handleDisconnectedParticipant);

      // desconectar de la sala cuando se desconecta el usuario
      window.addEventListener("pagehide", () => room.disconnect());
      window.addEventListener("beforeunload", () => room.disconnect());

      console.log({ room });
      return () => {
        room.off('participantConnected', handleConnectedParticipant );
        room.off('participantDisconnected', handleDisconnectedParticipant);
      };

    }

  }, [room]);

  return (
    <Layout>
      <h1>Contenido home</h1>
      <Button onClick={handelClick}>Nueva reunión</Button>

      <div className={styles.roomsContainer}>
        {room && participants.map((participant) => {
          return (
            <div key={participant.identity}>
              <p>{participant.identity}</p>
              <TrackPublication participant={participant} />
            </div>
          )
        })}
      </div>
    </Layout>
  )
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
    <div>
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

  const [track, setTrack] = useState(null);
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
    <div>
      { track && track.kind === 'video'
         && <video style={{ width: '100%', height: '100%' }} ref={videoRef} />
      }
    </div>
  );

}