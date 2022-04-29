import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// create the twilio client
const client = twilio(
    process.env.TWILIO_API_KEY_SID, 
    process.env.TWILIO_API_KEY_SECRET, 
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

//create or fetch room
export const findOrCreateRoom = async (roomName) => {
    try {
        
        await client.video.rooms(roomName).fetch();
        
    } catch (error) {
        
        if(error.code == 20404) {
            await client.video.rooms.create({
                uniqueName: roomName,
                type: 'go',
            });
        }
        else{
            throw error;
        }
    }
}

export const getAccessToken = (roomName) => {

    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY_SID,
        process.env.TWILIO_API_KEY_SECRET,
        { identity: uuidv4() }
    );

    const videoGrant = new VideoGrant({
        room: roomName,
    });
    
    token.addGrant(videoGrant);

    return token.toJwt();
}