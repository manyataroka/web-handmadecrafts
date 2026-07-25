"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("Flutter handmade craft enthusiast!");
  const [location, setLocation] = useState("Local Craft Studio");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logout = () => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    } catch (e) {}
    router.push('/');
  };

  useEffect(() => {
    try {
      const u = localStorage.getItem("username");
      setUsername(u);
      const savedPhoto = localStorage.getItem("profilePhoto");
      if (savedPhoto) setProfilePhoto(savedPhoto);
    } catch (e) {
      setUsername(null);
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        try {
          localStorage.setItem("profilePhoto", result);
        } catch (e) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/70 to-[#FCEEEE] pb-20">
      <div className="px-5 pt-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-black/70 hover:text-black mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-black mb-2">Profile</h1>
        <p className="text-black/70 text-sm">Manage your Flutter handmade crafts profile</p>
      </div>
      <div className="px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div 
                className="h-32 w-32 rounded-full overflow-hidden border-4 border-[#E53935] flex items-center justify-center bg-gradient-to-br from-[#E53935] to-[#FCEEEE] cursor-pointer"
                onClick={triggerFileInput}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <button 
                onClick={triggerFileInput} 
                className="absolute bottom-0 right-0 bg-[#E53935] text-white p-2 rounded-full shadow-md hover:bg-[#d32f2f] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 9a3 3 0 0 0-3 3v1H8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1v-1a3 3 0 0 0-3-3Zm3 3v1h-6v-1a3 3 0 1 1 6 0Z" />
                  <path d="M12 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/80 mb-1">Username</label>
                  <input
                    type="text"
                    value={username || ""}
                    disabled
                    className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg bg-gray-50 text-black/70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/80 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                    placeholder="Tell us about your Flutter handmade crafts..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/80 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                    placeholder="Your craft studio location"
                  />
                </div>
                <div className="pt-4 flex flex-wrap gap-3">
                  <button 
                    onClick={() => alert("Profile saved!")}
                    className="px-6 py-2 bg-[#E53935] text-white font-semibold rounded-lg hover:bg-[#d32f2f] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={logout}
                    className="px-6 py-2 border border-[#DDDDDD] text-black font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-black mb-4">Flutter Handmade Crafts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[#DDDDDD]">
              <h4 className="font-semibold text-black">My Creations</h4>
              <p className="text-sm text-black/70">View and manage your handmade crafts</p>
            </div>
            <div className="p-4 rounded-lg border border-[#DDDDDD]">
              <h4 className="font-semibold text-black">Workshops</h4>
              <p className="text-sm text-black/70">Join upcoming Flutter craft workshops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
