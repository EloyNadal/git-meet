import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import Layout from 'components/Layout';
import useUser from 'hooks/useUser';
import Button from 'components/Button';
import { v4 as uuidv4 } from 'uuid';

import styles from 'styles/pages/Home.module.css';

export default function Home() {

  const user = useUser();
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);
  const inputRef = useRef(null);

  const handelClickStartRoom = () => {
    router.push(`/room/${inputRef.current.value || uuidv4()}`);
  }

  // handle click go to room
  const handleClickGoToRoom = () => {
    setIsClicked(true);
    inputRef.current.focus();
  }

  //unirse a reunion
  const handleClickJoinRoom = () => {
    handelClickStartRoom(inputRef.current.value);
  };


  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Portal de videollamadas por y para desarrolladores</h1>
        <h2 className={styles.subtitle}>Gratuito, simple y directo</h2>
      </div>

      <div className={styles.buttonsWrapper}>
        <Button onClick={handelClickStartRoom}>Iniciar nueva reunión</Button>
        <input
          className={styles.input}
          type='text'
          placeholder="Introduce dirección de reunión"
          style={{ display: isClicked ? 'inline-block' : 'none' }}
          ref={inputRef}
        />

        <Button className={'secondary'} onClick={handelClickStartRoom}
          style={{ display: isClicked ? 'inline-block' : 'none' }}>
           Ir
        </Button>

        <Button className={'secondary'} onClick={handleClickGoToRoom} style={{ display: isClicked ? 'none' : 'inline-block' }}>Unirse a reunión</Button>
      </div>
    </Layout>
  )
}