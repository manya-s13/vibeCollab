'use client'
import {Shapes, Palette, Brush, User} from 'lucide-react'
import FloatIcons from './FloatingIcons'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-between px-20 bg-gradient-to-b from-pink-100 via-pink-50 to-white">

      <div className="w-1/2 flex flex-col justify-center space-y-6">
        <h1 className="text-6xl font-bold text-black leading-tight">
          Idea to Design
        </h1>
        <p className="text-gray-500 text-xl">
        Where thoughts and visuals sync <br></br> in real time
        </p>
        <button onClick={() => navigate('/wb')} className="mt-4 w-fit px-6 py-3 text-white text-lg font-medium rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 cursor-pointer">
          Create
        </button>
      </div>

      <div className="w-1/2 flex justify-center items-center">
      <FloatIcons Icon={Shapes} top='20%' left='87%' bgColor='#E0B2FF' />
      <FloatIcons Icon={Palette} top='20%' left='55%' bgColor='#90D5FF' />
      <FloatIcons Icon={Brush} top='80%' left='65%' bgColor='#FFA5D6' />
      <FloatIcons Icon={User} top='65%' left='90%' bgColor='#ff8fab' />

        <img
          src="/side.png"
          alt="designing"
          className="max-w-[180%] h-auto object-contain"
        />
      </div>
    </div>
  )
}

export default Hero
