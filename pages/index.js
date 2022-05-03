import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import useUser from 'hooks/useUser';
import Button from 'components/Buttton';
import { startRoom } from 'services/twilio/client.js';
import { v4 as uuidv4 } from 'uuid';

import styles from 'styles/pages/Home.module.css';

export default function Home() {

  const user = useUser();
  const router = useRouter();

  /**
   * @todo
   * Cada vez que creemos una sala, redirigiremos a una nueva url y la crearemos allí
   * - Enviar nombre de usuario
   */

  const handelClick = () => {
    router.push(`/room/${uuidv4()}`);
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Portal de videollamadas por y para desarrolladores</h1>
        <h2 className={styles.subtitle}>Gratuito, simple y directo</h2>
      </div>

      <div className={styles.buttonsWrapper}>
        <Button onClick={handelClick}>Iniciar nueva reunión</Button>
        <Button className={'secondary'} onClick={handelClick}>Unirse a reunión</Button>
      </div>
    </Layout>
  )
}