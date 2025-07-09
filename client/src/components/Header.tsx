import { Paintbrush } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const {isLoggedIn, checkAuthStatus, logout} = useAuthStore();

  const handleSignin = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/wb');
  }

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };



  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-7xl mx-auto px-6 py-2 flex items-center justify-between bg-white/10 shadow-sm rounded-full backdrop-blur-lg">
      
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-pink-100 rounded-full">
          <Paintbrush className="text-black w-5 h-5" />
        </div>
        <h1 className="text-pink-500 font-semibold text-xl">VibeCollab</h1>
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
        <a href="#" className="hover:text-pink-400 transition">Home</a>
        <a href="#" className="hover:text-pink-400 transition">Features</a>
        <a href="#" className="hover:text-pink-400 transition">Support</a>
        <a href="#" className="hover:text-pink-400 transition">About</a>
      </nav>

      {isLoggedIn ? (
  <div>
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-full border border-pink-400 text-black text-sm font-medium cursor-pointer hover:bg-pink-300"
    >
      Sign Out
    </button>
  </div>
) : (
  <div className="flex items-center space-x-3">
    <button
      onClick={handleSignUp}
      className="px-4 py-2 bg-pink-500 rounded-full text-sm font-medium text-black hover:bg-pink-600 cursor-pointer"
    >
      Get Started
    </button>
    <button
      onClick={handleSignin}
      className="px-4 py-2 rounded-full border border-pink-400 text-black text-sm font-medium cursor-pointer hover:bg-pink-300"
    >
      SignIn
    </button>
  </div>
)}

    </header>
  );
}

export default Header;
