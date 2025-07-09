import { Video, Mic, MonitorUp, Brush, Shapes, Users, Users2, Palette } from 'lucide-react'

function Design() {

    const images = [
        {
            href: "c1.avif",
        },
        {
            href: "c2.avif",
        },
        {
            href: "c3.avif",
        },
        {
            href: "c4.avif",
        },
        {
            href: "c5.webp",
        },
        {
            href: "c6.avif",
        },
    ] 

  return (
    <div className="px-16 flex justify-center items-center">
        <div className='w-1/2 flex'>
        <div className="w-50 md:w-100 pl-5 pt-3 h-50 md:h-70 border border-blue-300 rounded-2xl bg-blue-50">
            <div className="grid grid-cols-3 gap-2">
                {images.map((im, i)=> (
                    <div >
                        <img src={im.href} width={100} height={100} className="rounded-2xl hover:scale-105" />
                    </div>
                ))}
            </div>
           <div className='flex items-center justify-around text-black pt-5 p-3'>
           <Shapes className='hover:scale-115' />
            <Users2 className='hover:scale-115' />
            <Palette className='hover:scale-115' />
            <Brush className='hover:scale-115' />
           </div>
        </div>
        </div>
        <div className='w-1/2 flex ml-5 md:ml-0'>
            <div>
                <h1 className='text-2xl md:text-4xl font-semibold pb-5'>Ready to bring your Ideas to life?</h1>
                <p className='text-gray-800 pb-2'>Join Now and start creating with your team and friends in real time.</p>
                <p className='text-gray-800'>Sketch together. Think together.</p>
            </div>
        </div>
    </div>
  )
}

export default Design