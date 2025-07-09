import {motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react'

function Content() {

    const containerRef = useRef<HTMLDivElement>(null);

    const {scrollYProgress} = useScroll({
        target: containerRef,

    });

    const textScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8])
    const textTranslate = useTransform(scrollYProgress, [0, 0.1], [0, 100])

    const rotateX = useTransform(scrollYProgress, [0, 0.1], [10, 0]);
    const translateY = useTransform(scrollYProgress, [0, 0.1] , [0, 200]);

  return (
    <div ref={containerRef} className='h-[150vh] w-full flex flex-col items-center py-40 [perspective:800px]
  [transform-style:preserve-3d]'>
        <motion.h1
        style={{
            scale: textScale,
            y: textTranslate,
        }}
        className='text-6xl font-bold text-center'>
            Connect. Collab. Create
        </motion.h1>

        <motion.div 
        style=
        {{rotateX: rotateX,
            translateZ: "50px",
            y: translateY
        }}
        className='w-[70%] rounded-3xl -mt-6 h-[500px] bg-white shadow-2xl p-2 border border-neutral-100'>
            <div className='h-full w-full rounded-[16px]'>
                <div className='bg-neutral-100 h-full w-full rounded-[16px]'>
                    <img src='/design.png'
                    alt='demo'
                    height={50}
                    width={50}
                    className='h-full w-full object-cover' />
                </div>
            </div>
        </motion.div>
    </div>
  )
}

export default Content