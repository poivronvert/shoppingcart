import items from "./items.json"
import formatCurrency from "./util/formatCurrency.js"
import { addToCart } from "./shoppingCart.js"
import addGlobalEventListener from "./util/addGlobalEventListener.js"
 
const storeItemTemplate = document.querySelector("#store-item-template")
const storeItemContainer = document.querySelector("[data-store-container]")
const IMAGE_URL = "https://dummyimage.com/420x260"

console.log(items)

export function setupStore(){
    if (storeItemContainer == null) return


    addGlobalEventListener("click", "[data-add-to-cart-button]", e => {
        const id = e.target.closest("[data-store-item]").dataset.itemId
        addToCart(parseInt(id))
      })
    
    items.forEach(renderStoreItems)
}

function renderStoreItems(item){
    const storeItem = storeItemTemplate.content.cloneNode(true)

    const container = storeItem.querySelector('[data-store-item]')
    container.dataset.itemId = item.id

    const name = storeItem.querySelector('[data-name]')
    name.innerHTML = item.name

    const category = storeItem.querySelector('[data-category]')
    category.innerHTML = item.category

    const image = storeItem.querySelector('[data-image]')
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

    const price = storeItem.querySelector('[data-price]')
    price.innerHTML = formatCurrency(item.priceCents / 100)

    storeItemContainer.append(storeItem)
}