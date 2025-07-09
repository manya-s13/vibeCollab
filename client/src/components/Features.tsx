import {Users2, SlidersHorizontal, Shapes } from 'lucide-react'
import {motion} from 'framer-motion'

function Features() {

    const cards = [
        {
            icon: <Users2 />,
            title: "Real-Time Collaboration",
            desc: "Work together on a shared canvas in real time"
        },
        {
            icon: <SlidersHorizontal />,
            title: "Customizable Styles",
            desc: "Change colors, stroke width, fill, opacity, to match your vision perfectly."
        },
        {
            icon: <Shapes />,
            title: "Rich Drawing Tools",
            desc: "Draw with precision using a variety of shapes and freehand drawing."
        },
    ]

  return (
    <div className="pt-16 pb-10">
        <div className="flex flex-col justify-center items-center">

        <h1 className="text-3xl font-semibold">Why Choose Vibe Collab ?</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 px-20 gap-6">
            {cards.map((card, i)=> (
                <motion.div
                initial={{opacity: 0, y: 40}}
                whileInView={{opacity: 1, y:0}}
                transition={{ duration: 1, delay: i * 0.2 }} >
                <div className="py-10 px-5 border border-gray-300 rounded-xl flex flex-col items-start gap-2 hover:scale-105">
                
                <h1 className="flex items-center text-xl text-black font-semibold gap-6">{card.icon}{card.title}</h1>
                <h1 className="text-md text-gray-600">{card.desc}</h1>
                </div>
                </motion.div>
            ))}
        </div>
        
        
        </div>
    </div>
  )
}

export default Features