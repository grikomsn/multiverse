import cns from '@sindresorhus/class-names'
import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'

function Main({ className, ...props }: React.ComponentProps<'main'>) {
  const motionProps: HTMLMotionProps<'section'> = {
    initial: 'initial',
    animate: 'enter',
    exit: 'exit',
    variants: {
      initial: { opacity: 0, y: -80 },
      enter: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 80 },
    },
  }

  return (
    <motion.section {...motionProps}>
      <main className={cns('container mx-auto p-4', className)} {...props} />
    </motion.section>
  )
}

export default Main
