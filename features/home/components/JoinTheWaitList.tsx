import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const JoinTheWaitList = () => {
  return (
    <div className={`py-15 px-3 md:px-10 bg-primary text-white`}>
      <div className={`max-w-7xl w-full mx-auto flex gap-4 flex-col sm:flex-row`}>
        <Image src={`/waitlistPhone.png`} alt='A phone with a waitlist button' width={500} height={800} className={`rounded-2xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px]`} />
      <div className={`flex flex-col items-center sm:items-start sm:justify-center gap-8 px-3 md:px-5`}>
        <h3 className={`font-square text-5xl max-w-[200px] text-white`}>Join The WaitList</h3>
        <Link className={`font-square text-lg border border-gray-300 hover:bg-white/90 hover:text-primary rounded-full py-2 text-center w-max px-5 uppercase`} href={`#`}>Click to Join</Link>
      </div>
      </div>
    </div>
  )
}

export default JoinTheWaitList