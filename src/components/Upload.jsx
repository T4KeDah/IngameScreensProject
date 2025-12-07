import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db, serverTimestamp } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../UserContext';

export default function Upload(){
  const { user, loading } = useUser();
  const [file, setFile] = useState(null);
  const [game, setGame] = useState('');
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleFile = (e) => {
    if(e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!file) return alert('Please select an image');
    if(!user) return alert('You must sign in to upload.');

    try{
      setStatus('Uploading...');
      const id = uuidv4();
      const storageRef = ref(storage, `screenshots/${id}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot)=>{
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      }, (error)=>{
        console.error(error);
        setStatus('Upload failed');
      }, async ()=>{
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, 'screenshots'), {
          imageURL: url,
          game,
          caption,
          likes: 0,
          approved: false,
          featured: false,
          uploaderName: user.displayName || user.email || 'Anonymous',
          uploaderId: user.uid,
          createdAt: serverTimestamp()
        });
        setStatus('Uploaded successfully');
        setFile(null);
        setGame('');
        setCaption('');
        setProgress(0);
      });

    }catch(e){
      console.error(e);
      setStatus('Error');
    }
  };

  if(loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Upload a Screenshot</h2>
      {!user ? (
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-2">You must be signed in to upload screenshots.</p>
          <p>Use the Sign in with Google button in the top-right to get started.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block mb-2">Image</label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Game</label>
            <input value={game} onChange={e=>setGame(e.target.value)} className="w-full border p-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Caption</label>
            <input value={caption} onChange={e=>setCaption(e.target.value)} className="w-full border p-2" />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Upload</button>
            {progress>0 && <div className="text-sm">{progress}%</div>}
            <div className="text-sm text-gray-600">{status}</div>
          </div>
        </form>
      )}
    </div>
  );
}
