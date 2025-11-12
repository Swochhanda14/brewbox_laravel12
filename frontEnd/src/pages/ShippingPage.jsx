import {useState} from 'react'
import Banner from '../components/Banner';
import {useDispatch , useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaMapMarkerAlt, FaCity, FaArrowRight } from 'react-icons/fa';

const ShippingPage = (props) => {
    const cart = useSelector((state)=>state.cart);
    const {shippingAddress} = cart;


    const [address,setAddress]=useState(shippingAddress?.address || '');
    const [city,setCity]=useState(shippingAddress?.city || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(saveShippingAddress({address,city}));
        navigate('/payment');
    }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Banner title={props.title} />
        <div className='flex flex-col items-center gap-8 mb-10 px-4 sm:px-0 pb-12'>
            <CheckoutSteps step1 step2 />
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Shipping Address
                  </h2>
                  <p className="text-gray-600">Enter your delivery details</p>
                </div>
                <form onSubmit={submitHandler} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="address">
                          <FaMapMarkerAlt className="text-green-700" />
                          Address
                        </label>
                        <input 
                          className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                          type="text" 
                          placeholder='Enter your full address' 
                          value={address} 
                          onChange={(e)=>setAddress(e.target.value)} 
                          required
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="city">
                          <FaCity className="text-green-700" />
                          City
                        </label>
                        <input 
                          className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                          type="text" 
                          placeholder='Enter your city' 
                          value={city} 
                          onChange={(e)=>setCity(e.target.value)} 
                          required
                        />
                    </div>
                    <button 
                      type='submit' 
                      className='w-full py-3 px-7 bg-gradient-to-r from-green-700 to-green-800 text-base sm:text-lg text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2'
                    >
                      Continue
                      <FaArrowRight />
                    </button>
                </form>
              </div>
            </div>
        </div>
    </div>
  )
}

export default ShippingPage
