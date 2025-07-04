import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:3002/api/signup', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });          

        if(response.status === 200){
            alert('signup successful'); 
            navigate('/signin');
        }
    }catch(error: any){
        console.error(error.response ? error.response.data.message : error.message);
        alert('Signup failed: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-rose-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-pink-100 rounded-full opacity-20 blur-xl"></div>
      </div>

      <div className="max-w-md w-full relative">
        <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Join us
            </h1>
            <p className="text-gray-500 mt-2">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                className="w-full px-4 py-3 bg-white/50 border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-300 transition-all duration-300"
                placeholder="Full Name"
                required
              />
              <div 
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-300 to-rose-300 transition-all duration-300
                  ${isNameFocused ? 'w-full' : 'w-0'}`}
              ></div>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full px-4 py-3 bg-white/50 border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-300 transition-all duration-300"
                placeholder="Email"
                required
              />
              <div 
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-300 to-rose-300 transition-all duration-300
                  ${isEmailFocused ? 'w-full' : 'w-0'}`}
              ></div>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full px-4 py-3 bg-white/50 border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-300 transition-all duration-300"
                placeholder="Password"
                required
              />
              <div 
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-300 to-rose-300 transition-all duration-300
                  ${isPasswordFocused ? 'w-full' : 'w-0'}`}
              ></div>
            </div>

            <button
              type="submit"
              className="w-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl"></div>
              <div className="relative px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl group-hover:opacity-90 transition-opacity">
                <span className="text-white font-medium">Create Account</span>
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <a href="/signin" className="text-pink-500 hover:text-pink-600 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;