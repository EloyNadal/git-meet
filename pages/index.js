import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import useUser from 'hooks/useUser';
import Button from 'components/Buttton';

export default function Home() {

  const user = useUser();
  const router = useRouter();

  const handelClick = () => {
    console.log('test');
  }

  return (
    <Layout>
      <h1>Contenido home</h1>
      <Button onClick={handelClick}>Nueva reunión</Button>
    </Layout>
  )
}
