'use client'
import {Video, Mic, Brush, User} from 'lucide-react'
import FloatIcons from './FloatingIcons'

function Hero() {
  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-between px-20 bg-gradient-to-b from-pink-100 via-pink-50 to-white">

      <div className="w-1/2 flex flex-col justify-center space-y-6">
        <h1 className="text-6xl font-bold text-black leading-tight">
          Idea to Design
        </h1>
        <p className="text-gray-500 text-xl">
        Where thoughts and visuals sync <br></br> in real time
        </p>
        <button className="mt-4 w-fit px-6 py-3 text-white text-lg font-medium rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 cursor-pointer">
          Join Now
        </button>
      </div>

      <div className="w-1/2 flex justify-center items-center">
      <FloatIcons Icon={Video} top='20%' left='87%' bgColor='#E0B2FF' />
      <FloatIcons Icon={Mic} top='20%' left='55%' bgColor='#cbe6ff' />
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
