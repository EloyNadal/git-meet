import Avatar from 'components/Avatar';
import styles from './Participant.module.css';
import useGitUser from 'hooks/useGitUser';

export default function Participant({ id }) {

    const user = useGitUser(id);

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