import items from './items.json'
import formatCurrency from './util/formatCurrency.js'
import addGlobalEventListener from './util/addGlobalEventListener.js'

const cartButton = document.querySelector('[data-cart-button]')
const carItemWrapper = document.querySelector('[data-cart-items-wrapper]')
const cartItemTemplate = document.querySelector('#cart-item-template')
const IMAGE_URL = "https://dummyimage.com/210x130"
let shoppingCart = []
const cartItemContainer = document.querySelector('[data-cart-items]')
const cartQuantity = document.querySelector('[data-cart-quantity]')
const cartTotal = document.querySelector('[data-cart-total]')
const cart = document.querySelector('[data-cart]')
const SESSION_STORAGE_KEY = 'SHOPPING_CART-cart'


export function setupShoppingCart() {
    addGlobalEventListener("click", "[data-remove-from-cart-button]", e => {
      const id = parseInt(e.target.closest("[data-item]").dataset.itemId)
      removeFromCart(id)
    })
    shoppingCart = loadCart()
    renderCart()
    cartButton.addEventListener('click', () => {
        carItemWrapper.classList.toggle('invisible')
    })
}


export function addToCart(id){
    const existingItem = shoppingCart.find(item => item.id === id)
    if (existingItem){
        existingItem.quantity++
    } else {
        shoppingCart.push({id:id, quantity:1})
    }
    renderCart()
    saveCart()
}

function removeFromCart(id){
    const existingItem = shoppingCart.find(item => item.id === id)
    if (existingItem == null ) return
    shoppingCart = shoppingCart.filter(entry => entry.id !== id)
    renderCart()
    saveCart()
}


function saveCart(){
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart(){
    const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return JSON.parse(cart) || []
}


function renderCart(){
    if(shoppingCart.length === 0){
        hideCart()
    } else {
        showCart()
        renderCartItems()
    }
}

function showCart(){
    cart.classList.remove('invisible')

}


function hideCart(){    
    cart.classList.add('invisible')
    carItemWrapper.classList.add('invisible')
}


function renderCartItems(){
    cartQuantity.innerText= shoppingCart.length

    const totalCents = shoppingCart.reduce((sum, entry) => {
        const item = items.find(i => entry.id === i.id)
        return sum + item.priceCents * entry.quantity
    }, 0)

    cartTotal.innerText = formatCurrency(totalCents/100)
    cartItemContainer.innerHTML = ""
    shoppingCart.forEach(entry => {
        const item = items.find(i => entry.id === i.id)
        const cartItem = cartItemTemplate.content.cloneNode(true)

        const container = cartItem.querySelector('[data-item]')
        container.dataset.itemId = item.id
    
        const name = cartItem.querySelector('[data-name]')
        name.innerHTML = item.name
    
        const image = cartItem.querySelector('[data-image]')
        image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

        if(entry.quantity > 1) {
            const quantity = cartItem.querySelector('[data-quantity]')
            quantity.innerHTML = `x${entry.quantity}`
        }

        const price = cartItem.querySelector('[data-price]')
        price.innerHTML = formatCurrency(item.priceCents*entry.quantity / 100)
    
        cartItemContainer.append(cartItem)
    })

}