class CartItem{
    constructor(name, desc, img, precio){
        this.name = name
        this.desc = desc
        this.img=img
        this.precio = precio
        this.quantity = 1

   }
}

class LocalCart{
    static key = "cartItems"

    static getLocalCartItems(){
        let cartMap = new Map()
     const cart = localStorage.getItem(LocalCart.key)   
     if(cart===null || cart.length===0)  return cartMap
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            mapItem.quantity +=1
            cart.set(id, mapItem)
        }
        else
        cart.set(id, item)
       localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
       updateCartUI()
        
    }
    static removeItemFromCart(id) {
        let cart = LocalCart.getLocalCartItems();
        if (cart.has(id)) {
            let mapItem = cart.get(id);
            if (mapItem.quantity > 1) {
                mapItem.quantity -= 1;
                cart.set(id, mapItem);
            } else {
                cart.delete(id);
            }
        }
    
        if (cart.size === 0) {
            localStorage.removeItem(LocalCart.key);
            updateCartUI();
            const cartContainer = document.getElementById('cart');
            cartContainer.style.height = '250px'; // Ajustar la altura del carrito a 250px si está vacío
    
            const subtotal = document.querySelector('.subtotal');
            subtotal.innerHTML = 'Subtotal: $0'; // Actualizar el subtotal a cero cuando el carrito esté vacío
        } else {
            localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)));
            updateCartUI();
        }
    }
    
    
}


const cartIcon = document.querySelector('.bx-cart')
const wholeCartWindow = document.querySelector('.whole-cart-window')
wholeCartWindow.inWindow = 0
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn')
addToCartBtns.forEach( (btn)=>{
    btn.addEventListener('click', addItemFunction)
}  )

function addItemFunction(e){
    const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id")
    const img = e.target.parentElement.parentElement.previousElementSibling.src
    const name = e.target.parentElement.previousElementSibling.previousElementSibling.textContent
    const desc = e.target.parentElement.previousElementSibling.textContent
    let precio = e.target.parentElement.children[1].textContent
    precio = precio.replace("Precio: $", '')
    const item = new CartItem(name, desc, img, precio)
    LocalCart.addItemToLocalCart(id, item)
    const cart = document.getElementById('cart');
    cart.style.height = '575px';
 console.log(precio)
}


cartIcon.addEventListener('mouseover', ()=>{
if(wholeCartWindow.classList.contains('hide'))
wholeCartWindow.classList.remove('hide')
})

cartIcon.addEventListener('mouseleave', ()=>{
    // if(wholeCartWindow.classList.contains('hide'))
    setTimeout( () =>{
        if(wholeCartWindow.inWindow===0){
            wholeCartWindow.classList.add('hide')
        }
    } ,500 )
    
    })

 wholeCartWindow.addEventListener('mouseover', ()=>{
     wholeCartWindow.inWindow=1
 })  
 
 wholeCartWindow.addEventListener('mouseleave', ()=>{
    wholeCartWindow.inWindow=0
    wholeCartWindow.classList.add('hide')
})  
 

function updateCartUI(){
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=""
    const items = LocalCart.getLocalCartItems()
    if(items === null) return
    let count = 0
    let total = 0
    for(const [key, value] of items.entries()){
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let precio = value.precio*value.quantity
        precio = Math.round(precio*100)/100
        count+=1
        total += precio+0.00
        total = Math.round(total*100)/100
        cartItem.innerHTML =
        `
        <img src="${value.img}"> 
                       <div class="details">
                           <h3>${value.name}</h3>
                           <p>${value.desc}</p>
                           <input type="number" min="1" value="${value.quantity}" class="quantity-input">
                           <button class="increase-quantity">+</button>
                           <button class="decrease-quantity">-</button>
                               <span class="quantity">precio: $ ${precio}</span>
                       </div>
                       <div class="cancel" style="margin-left: -20px;"><i class="fas fa-window-close" style="color: red; font-size: 24px;"></i></div>
        `
       cartItem.lastElementChild.addEventListener('click', ()=>{
           LocalCart.removeItemFromCart(key)
       })
        cartWrapper.append(cartItem)
            // Después de cartWrapper.append(cartItem)
const increaseBtn = cartItem.querySelector('.increase-quantity');
const decreaseBtn = cartItem.querySelector('.decrease-quantity');
const quantityInput = cartItem.querySelector('.quantity-input');

increaseBtn.addEventListener('click', () => {
    quantityInput.value++;
    updateCartItem(key, quantityInput.value);
});

decreaseBtn.addEventListener('click', () => {
    if (quantityInput.value > 1) {
        quantityInput.value--;
        updateCartItem(key, quantityInput.value);
    }
});

    }
    if(count > 0){
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `SubTotal: $${total}`
    }
    else
    cartIcon.classList.remove('non-empty')
}
// Fuera de las funciones existentes
function updateCartItem(itemId, newQuantity) {
    const items = LocalCart.getLocalCartItems();
    if (items.has(itemId)) {
        let mapItem = items.get(itemId);
        mapItem.quantity = newQuantity;
        items.set(itemId, mapItem);
        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(items)));
        updateCartUI();
    }
}
document.addEventListener('DOMContentLoaded', ()=>{updateCartUI()})


function Pagar() {
    
}