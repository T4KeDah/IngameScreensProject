import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../UserContext';

export default function Admin(){
  const { user, loading, isAdmin } = useUser();
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  useEffect(()=>{
    if(!isAdmin) return;
    fetchPending();
  },[isAdmin]);

  async function fetchPending(){
    setLoadingPending(true);
    try{
      const q = query(collection(db, 'screenshots'), where('approved', '==', false));
      const snaps = await getDocs(q);
      const arr = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
      setPending(arr);
    }catch(e){ console.error(e); }
    setLoadingPending(false);
  }

  async function approve(id){
    try{
      const ref = doc(db, 'screenshots', id);
      await updateDoc(ref, { approved: true });
      setPending(p => p.filter(x => x.id !== id));
    }catch(e){ console.error(e); }
  }

  async function markFeatured(id){
    try{
      const ref = doc(db, 'screenshots', id);
      await updateDoc(ref, { featured: true });
      setPending(p => p.map(x => x.id === id ? { ...x, featured: true } : x));
    }catch(e){ console.error(e); }
  }

  async function remove(id){
    try{
      const ref = doc(db, 'screenshots', id);
      await deleteDoc(ref);
      setPending(p => p.filter(x => x.id !== id));
    }catch(e){ console.error(e); }
  }

  if(loading) return <div>Loading...</div>;
  if(!isAdmin) return <div className="bg-white p-6 rounded shadow">You are not authorized to view this page.</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin — Moderation Queue</h2>
      {loadingPending ? <div>Loading pending uploads...</div> : null}
      <div className="space-y-4">
        {pending.length === 0 && <div className="bg-white p-4 rounded shadow">No pending uploads.</div>}
        {pending.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow flex gap-4">
            <img src={item.imageURL} alt={item.caption} className="w-48 h-32 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{item.game}</div>
              <div className="text-sm text-gray-600">by {item.uploaderName || item.uploaderId}</div>
              <p className="mt-2">{item.caption}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>approve(item.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={()=>markFeatured(item.id)} className="px-3 py-1 border rounded">Mark Featured</button>
                <button onClick={()=>remove(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
