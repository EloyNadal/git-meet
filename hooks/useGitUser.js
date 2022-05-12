import { useState } from "react";
import { getGitUser } from "services/firebase/client";
import { useEffectOnce } from "./useEffectOnce";

export default function useGitUser(id) {
  const [gitUser, setGitUser] = useState(null);

  useEffectOnce(() => {
    const getUser = async () => {
      const userData = await getGitUser(id);
      setGitUser(userData);
    };

    getUser();
  }, []);

  return gitUser;
}