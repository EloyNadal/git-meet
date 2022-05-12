import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AppContext = createContext();

export function AppWrapper({ children }) {

    const [videoIsEnabled, setVideoIsEnabled] = useState(true);
    const [audioIsEnabled, setAudioIsEnabled] = useState(true);
    const [contextRoom, setContextRoom] = useState([]);
    const router = useRouter();

    const handleChangeEnabledVideo = () => {
        setVideoIsEnabled(!videoIsEnabled);
    }

    const handleChangeEnabledAudio = () => {
        setAudioIsEnabled(!audioIsEnabled);
    }

    const handleExitRoom = () => {
        contextRoom?.disconnect();
        router.push('/');
    }

    let sharedState = {
        videoIsEnabled,
        handleChangeEnabledVideo,
        audioIsEnabled, 
        handleChangeEnabledAudio,
        setContextRoom,
        handleExitRoom,
    };

    //activacion o desacivacion de mi camara para todos
    useEffect(() => {
        if(contextRoom) {
            contextRoom?.localParticipant?.videoTracks.forEach(localVideoTrack => {
                if(videoIsEnabled) {
                    localVideoTrack.track.restart();
                    localVideoTrack.track.enable()    
                } else {
                    localVideoTrack.track.stop();
                    localVideoTrack.track.disable();
                }

                /* localVideoTrack.track.enable() : localVideoTrack.track.disable();
                videoIsEnabled ? localVideoTrack.track.restart() : localVideoTrack.track.stop(); */
            });
        }
    } , [videoIsEnabled]);

    //activacion o desacivacion de mi micro para todos
    useEffect(() => {
        if(contextRoom) {
            contextRoom?.localParticipant?.audioTracks.forEach(audioTrack => {
                audioIsEnabled ? audioTrack.track.enable() : audioTrack.track.disable();
            });
        }
    } , [audioIsEnabled]);

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}