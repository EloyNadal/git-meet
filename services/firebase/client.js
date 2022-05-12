// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const GUEST_USER = {
    avatar_url: 'https://avatars.githubusercontent.com/u/4708922?v=4',
    blog: '',
    name: '',
    id: false,
    login: 'Invitado',
};


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};



// Initialize Firebase
//solo si no se ha iniciado antes
const app = !getApps().length && initializeApp(firebaseConfig);
const db = getFirestore();

const mapUserFromFirebaseAuth = (user) => {

    const { reloadUserInfo, uid } = user;
    const { screenName, photoUrl, displayName } = reloadUserInfo;
    const gitHubUrl = 'https://github.com/';

    return {
        avatar: photoUrl,
        blog: `${gitHubUrl}${screenName}`,
        userName: displayName,
        uid,
        gitName: screenName,
    };
}

export const currentUser = () => {

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        return mapUserFromFirebaseAuth(user);
    } else {
        return null;
    }
}

export const authStateListener = (onChange) => {

    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            onChange(mapUserFromFirebaseAuth(user))
        } else {
            onChange(null);
        }
    });

}

export const loginWithGitHub = () => {

    const auth = getAuth();
    const porvider = new GithubAuthProvider();

    return signInWithPopup(auth, porvider)
        .then((result) => {

            const credentials = GithubAuthProvider.credentialFromResult(result);
            const token = credentials.accessToken;

            const user = result.user;
            return mapUserFromFirebaseAuth(user);

        }).catch((error) => {
            const { code, message, email } = error;

            console.log({ code, message, email });

            const credentials = GithubAuthProvider.credentialFromError(error);
            console.log(credentials);

        });
}

export const getGitUser = async (id) => {
    return await fetch(`https://api.github.com/users/${id}`)
        .then(res => {
            if (res.ok) return res.json();
            return GUEST_USER;
        })
        .catch(err => GUEST_USER);
};

