import {useState} from 'react'
import Banner from '../components/Banner';
import {useDispatch , useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

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
    <div>
        <Banner title={props.title} />
        <div className='flex flex-col items-center gap-5 mb-10 px-2 sm:px-0'>
            <CheckoutSteps step1 step2 />
            <form onSubmit={submitHandler} className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                    <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="address">Address</label>
                    <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='Enter Address' value={address} onChange={(e)=>setAddress(e.target.value)} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="city">City</label>
                    <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='Enter City' value={city} onChange={(e)=>setCity(e.target.value)} />
                </div>
            <button type='submit' className='py-3 px-7 bg-green-800 text-base sm:text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer'>Continue</button>

            </form>
        </div>
    </div>
  )
}

export default ShippingPage
