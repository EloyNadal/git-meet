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
                type: 'group',
            });
        }
        else{
            throw error;
        }
    }
}


/**
 * @todo Por el momento, solo se puede unir usuario autenticado. 
 * Mirar de hacerlo para usuarios anónimos
 * @param {*} roomName 
 * @param {*} userName 
 * @returns 
 */
export const getAccessToken = (roomName, userName) => {

    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY_SID,
        process.env.TWILIO_API_KEY_SECRET,
        { identity: userName }
    );

    const videoGrant = new VideoGrant({
        room: roomName,
    });
    
    token.addGrant(videoGrant);

    return token.toJwt();
}