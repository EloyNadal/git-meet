import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {

    const [videoIsEnabled, setVideoIsEnabled] = useState(true);

    let sharedState = {
        videoIsEnabled: videoIsEnabled,
        handleChangeEnabledVideo: () => {
            setVideoIsEnabled(!videoIsEnabled);
        },
        room: null, 
        localParticipant: [],
        remoteParticipants: [],
    };

    useEffect(() => {
        sharedState.videoIsEnabled = videoIsEnabled;
    } , [videoIsEnabled]);

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}