import { findOrCreateRoom, getAccessToken } from 'services/twilio/server'

export default function handler(req, res) {

    if (req.method != 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
    }

    const roomName = req.body.roomId;
    const userName = req.body.userName;

    findOrCreateRoom(roomName);

    const token = getAccessToken(roomName, userName);

    res.status(200).json({ token });
  }