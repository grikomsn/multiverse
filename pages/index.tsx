import cns from '@sindresorhus/class-names'
import { motion } from 'framer-motion'
import React from 'react'

import Main from '../components/main'

function Mark({
  className,
  color = 'gray',
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <motion.div className="inline-block" whileHover={{ y: -4 }}>
      <a
        {...props}
        className={cns(
          'no-underline p-1 transition-colors',
          `bg-${color}-600 hover:bg-${color}-700`,
          className
        )}
        rel="noopener noreferrer"
        target="_blank"
      />
    </motion.div>
  )
}

function Home() {
  const [day, setDay] = React.useState('day')

  React.useEffect(() => {
    const days = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'
    setDay(days.split(' ')[new Date().getDay()])
  }, [])

  return (
    <Main>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <motion.img
          drag
          dragConstraints={{ bottom: 0, left: 0, right: 0, top: 0 }}
          dragElastic={0.2}
          whileHover={{ rotate: 2, scale: 1.05 }}
          whileTap={{ rotate: 1, scale: 1.025 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="cursor-move px-8 pb-8 md:pb-0 w-48 lg:w-64"
          src={require('../images/me.png')}
          alt="me"
        />

        <div>
          <div className="font-bold leading-tight mb-8 text-2xl sm:text-3xl lg:text-4xl tracking-tighter">
            Hey there. <br /> I make{' '}
            <Mark href="https://laravel.com" color="red" children="Laravel" />,{' '}
            <Mark href="https://nodejs.org" color="green" children="Node" />,
            and{' '}
            <Mark href="https://reactjs.org" color="blue" children="React" />{' '}
            things. <br />
            Busy with college and open source stuff. <br />
            Have a great {day}.
          </div>

          <div>
            Drop a mail at
            <Mark
              href="mailto:hello@griko.id"
              color="yellow"
              className="font-bold mx-1 tracking-tighter"
              children="hello@griko.id"
            />
            and let's talk business.
          </div>
        </div>
      </div>
    </Main>
  )
}

export default Home
