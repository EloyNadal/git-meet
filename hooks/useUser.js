import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authStateListener } from "services/firebase/client";

export const USER_STATES = {
  NOT_LOGGED: null,
  NOT_KNOWN: undefined
};

export default function useUser() {
  const [user, setUser] = useState(USER_STATES.NOT_KNOWN);
  const router = useRouter();

  useEffect(() => {
    authStateListener(setUser)
  }, []);

  /* useEffect(() => {
    user === USER_STATES.NOT_LOGGED && router.push('/')
  }, [user]); */

  return user;
}