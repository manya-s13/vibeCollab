import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react';

interface FloatIconsProps {
    Icon: LucideIcon; 
    top: string;
    left: string;
    bgColor: string;
  }

function FloatIcons({ Icon, top, left, bgColor }: FloatIconsProps) {
  return (
    <motion.div
    className='absolute text-white'
    style={{top, left}}
    animate={{ y: [0, -12, 0] }}
    transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
    }}
    >
        <div
        className={`rounded-full p-2`}
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={24} />
        </div>
    </motion.div>
  )
}

export default FloatIcons