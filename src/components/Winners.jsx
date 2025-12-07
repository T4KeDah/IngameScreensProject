import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ScreenshotCard from './ScreenshotCard';

export default function Winners(){
  const [winners, setWinners] = useState([]);

  useEffect(()=>{
    async function fetchWinners(){
      try{
        const ref = doc(db, 'weeklyWinners', 'latest');
        const snap = await getDoc(ref);
        if(!snap.exists()) return;
        const data = snap.data();
        if(!data || !data.ids) return;

        const shots = await Promise.all(data.ids.map(async id => {
          const shotRef = doc(db, 'screenshots', id);
          const shotSnap = await getDoc(shotRef);
          return shotSnap.exists() ? { id: shotSnap.id, ...shotSnap.data() } : null;
        }));

        setWinners(shots.filter(Boolean));
      }catch(e){ console.error(e); }
    }
    fetchWinners();
  },[]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Best of the Week</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {winners.map(s => <ScreenshotCard key={s.id} shot={s} />)}
      </div>
    </div>
  );
}
