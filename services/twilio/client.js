import { connect } from "twilio-video";

export const startRoom = async () => {

    const roomName = 'test';

    const response = await fetch("/api/join-room", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: roomName }),
    });

    const { token } = await response.json();

    const room = await joinVideoRoom(roomName, token);

    return room;
}

async function joinVideoRoom(roomName, token) {
    const room = await connect(token, {
        room: roomName
    });

    return room;
}

