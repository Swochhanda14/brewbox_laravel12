import React from 'react'

const BreadCrumb = ({product}) => {
  return (
    <div>
      <p className='capitalize text-gray-600 font-Poppins'>Home / {product.category} / <span className='text-black'> {product.product_name}</span></p>
    </div>
  )
}

export default BreadCrumb
