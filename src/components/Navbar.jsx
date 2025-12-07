import React from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useUser } from '../UserContext';

export default function Navbar(){
  const { user, loading, isAdmin } = useUser();

  const handleGoogleSignIn = async () => {
    try{
      await signInWithPopup(auth, googleProvider);
    }catch(e){ console.error(e); }
  };

  const handleSignOut = async () => {
    try{ await signOut(auth); }catch(e){ console.error(e); }
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">GameShots</div>
        <div className="flex items-center gap-4">
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Gallery</Link>
            <Link to="/upload" className="hover:underline">Upload</Link>
            <Link to="/winners" className="hover:underline">Best of Week</Link>
            {isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
          </div>
          <div>
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <img src={user.photoURL || 'https://www.gravatar.com/avatar?d=mp'} alt="avatar" className="w-8 h-8 rounded-full" />
                <span className="text-sm">{user.displayName || user.email}</span>
                <button onClick={handleSignOut} className="ml-2 px-3 py-1 border rounded">Sign out</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleGoogleSignIn} className="px-3 py-1 bg-blue-600 text-white rounded">Sign in with Google</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
