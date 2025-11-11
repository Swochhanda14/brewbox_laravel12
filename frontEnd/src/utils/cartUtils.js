export const updateCart= (state)=>{
    //Calculate items price
    state.itemsPrice=state.cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0);

    //Calculate shipping price
    state.shippingPrice = state.itemsPrice > 1000 ? 0 : 100;

    //Calculate tax price
    state.taxPrice = Number(state.itemsPrice * 0.13).toFixed(2);

    //Calculate total price
    state.totalPrice = (Number(state.itemsPrice)+Number(state.shippingPrice)+Number(state.taxPrice)).toFixed(2);

    localStorage.setItem('cart',JSON.stringify(state));
}