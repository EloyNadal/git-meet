import { connect } from "twilio-video";

export const startRoom = async (roomId, userName) => {

    const response = await fetch("/api/join-room", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, userName }),
    });

    const { token } = await response.json();

    const room = await joinVideoRoom(roomId, token);

    return room;
}

async function joinVideoRoom(roomId, token) {
    const room = await connect(token, {
        room: roomId,
        //automaticSubscription: false,
    });

    return room;
}

