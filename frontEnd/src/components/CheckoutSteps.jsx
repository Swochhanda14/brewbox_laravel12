import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Lock } from 'lucide-react' // Optional icons

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { step: step1, label: 'Sign In', link: '/login' },
    { step: step2, label: 'Shipping', link: '/shipping' },
    { step: step3, label: 'Payment', link: '/payment' },
    { step: step4, label: 'Place Order', link: '/placeorder' },
  ]

  return (
    <div className="flex justify-center my-6 sm:my-8">
      <ul className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full max-w-md sm:max-w-none">
        {steps.map(({ step, label, link }, index) => (
          <li key={index} className="w-full sm:w-auto">
            {step ? (
              <Link
                to={link}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-all text-sm sm:text-base justify-center"
              >
                <CheckCircle size={18} /> {label}
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed text-sm sm:text-base justify-center">
                <Lock size={18} /> {label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CheckoutSteps
