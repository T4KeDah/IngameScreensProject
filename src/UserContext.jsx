import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const UserContext = createContext(null);

export function UserProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    let mounted = true;
    const unsub = onAuthStateChanged(auth, async (u) => {
      if(!mounted) return;
      if(u){
        // fetch token result to read custom claims (admin)
        const idTokenResult = await u.getIdTokenResult(true).catch(()=>null);
        const adminClaim = idTokenResult?.claims?.admin || false;
        setUser(u);
        setIsAdmin(!!adminClaim);
      }else{
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => { mounted = false; unsub(); };
  },[]);

  return (
    <UserContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(){ return useContext(UserContext); }
