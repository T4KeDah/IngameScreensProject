import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import ScreenshotCard from './ScreenshotCard';

export default function Gallery(){
  const [shots, setShots] = useState([]);

  useEffect(()=>{
    // only show approved screenshots
    const q = query(collection(db, 'screenshots'), where('approved', '==', true), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snapshot => {
      const arr = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShots(arr);
    });
    return () => unsub();
  },[]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shots.map(s => <ScreenshotCard key={s.id} shot={s} />)}
      </div>
    </div>
  );
}
