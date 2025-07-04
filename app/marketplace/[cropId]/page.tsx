import { Footer } from '@/components'
import { CropId } from '@/features/marketplaceCropId'
import React from 'react'

const page = () => {
  return (
    <div className={`bg-white`}>
      {/* <Navbar /> */}
      {/* <FilterSection />
      <Products /> */}
      <CropId />
      <Footer />
    </div>
  )
}

export default page