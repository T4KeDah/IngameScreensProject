import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ScreenshotCard({ shot }){
  const like = async () => {
    try{
      const ref = doc(db, 'screenshots', shot.id);
      await updateDoc(ref, { likes: (shot.likes || 0) + 1 });
    }catch(e){ console.error(e); }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <img src={shot.imageURL} alt={shot.caption} className="w-full h-56 object-cover" />
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold">{shot.game || 'Unknown Game'}</div>
            <div className="text-sm text-gray-500">by {shot.uploaderName || (shot.uploaderId ? 'User' : 'Anonymous')}</div>
          </div>
          <div className="text-sm">⭐ {shot.likes || 0}</div>
        </div>
        <p className="mt-2 text-sm">{shot.caption}</p>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={like}>Like</button>
          <a className="px-3 py-1 border rounded" href={shot.imageURL} target="_blank" rel="noreferrer">View</a>
        </div>
      </div>
    </div>
  );
}
