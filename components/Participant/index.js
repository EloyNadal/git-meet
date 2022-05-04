import { useState } from 'react';

import { useEffectOnce } from 'hooks/useEffectOnce';
import Avatar from 'components/Avatar';
import { GUEST_USER } from 'hooks/useUser';

import styles from './Participant.module.css';

export default function Participant({ id }) {

    const [user, setUser] = useState(null);

    useEffectOnce(() => {

        const getUser = async () => {
            const userData = await fetch(`https://api.github.com/users/${id}`)
                        .then(res => {
                            if(res.ok) return res.json();
                            return GUEST_USER;
                        })
                        .catch(err => GUEST_USER);

            console.log('User data: ', userData);

            setUser(userData);
        };

        getUser();
    }, []);

    return (
        <>
            {user &&
                <div className={styles.participant}>
                    <div className={styles.avatar}>
                        <Avatar src={user.avatar_url} alt={user.login} sizeW={40} sizeH={40} />
                    </div>
                    <div className={styles.participantInfo}>
                        <h3>{user.login}</h3>
                        <p>{user.name}</p>
                    </div>
                </div>
            }
        </>
    );
}