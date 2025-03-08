const apiKey =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzlmZjdiNmYxZGM5MDAwMTVmMWViYTUiLCJpYXQiOjE3Mzg1MzY4ODYsImV4cCI6MTczOTc0NjQ4Nn0.d68fRp0z3X7EO6NPxdyqY_tFe1CE25lJf_5kmNrRRC0'

const addressBarContent = new URLSearchParams(window.location.search)
const id = addressBarContent.get('id')
const url = `https://striveschool-api.herokuapp.com/api/product/${id}`
const img = document.getElementsByTagName('img')[1]
const title = document.getElementsByClassName('card-title')[0]
const p1 = document.getElementsByClassName('card-text')[0]
const p2 = document.getElementsByClassName('card-text')[1]
const main = document.getElementsByTagName('main')[0]
const redButton = document.querySelector('.btn-danger')
const buyButton = document.querySelector('.btn-success')
const key = 'cars'
let cart = JSON.parse(localStorage.getItem(key))

// Carrello con localStorage
const newShoppingCart = function () {
  const shoppingCartDiv = document.getElementById('shopping-cart')
  shoppingCartDiv.innerText = ''
  const cart = JSON.parse(localStorage.getItem(key))
  if (cart) {
    for (let i = 0; i < cart.length; i++) {
      // creo div dentro offcanvas
      const newItem = document.createElement('div')
      newItem.classList.add('d-flex', 'justify-content-between')
      newItem.innerHTML = `
      <p class="mb-0">${cart[i].name}</p>
      <div class="d-flex mb-3">
        <p class="text-nowrap mb-0">€ ${cart[i].price}</p>
        <button class="border border-0 bg-white delete"><i class="fas fa-trash-alt"></i></button>
      </div>`
      shoppingCartDiv.appendChild(newItem)

      const button = document.getElementsByClassName('delete')[i]
      button.addEventListener('click', () => {
        // ogni bottone "trash" elimina il corrispondente elemento dal localStorage
        cart.splice(i, 1)
        localStorage.setItem(key, JSON.stringify(cart))
        newShoppingCart()
      })

      totalPrice = 0
      if (localStorage.getItem(key)) {
        let partial = JSON.parse(localStorage.getItem(key))
        for (let i = 0; i < partial.length; i++) {
          totalPrice += Number(partial[i].price)
          //   calcolo prezzo aggiornato ad ogni cambiamento del carrello
        }
      }
      const total = document.getElementById('total')
      total.innerText = `€ ${totalPrice.toFixed(2)}`
    }
  } else {
    const total = document.getElementById('total')
    total.innerText = '€ 0'
  }
}

if (cart) {
} else {
  cart = []
}

newShoppingCart()

fetch(url, {
  headers: {
    Authorization: apiKey,
  },
})
  .then((response) => {
    console.log(response)
    if (response.ok) {
      const spinner = document.getElementById('spinner')
      spinner.classList.add('d-none')
      return response.json()
    } else {
      throw new Error('No ok')
    }
  })
  .then((vettura) => {
    // genera card dettaglio
    img.src = vettura.imageUrl
    title.textContent = vettura.brand + ' ' + vettura.name
    p1.textContent = 'Potenza: ' + vettura.description + ' hp'
    p2.textContent = vettura.price + '€'
    redButton.addEventListener('click', function () {
      window.location.href = `./backoffice.html?id=${vettura._id}`
    })
    buyButton.addEventListener('click', () => {
      cart.push(vettura)
      localStorage.setItem(key, JSON.stringify(cart))
      newShoppingCart()
    })
  })
  .catch((error) => {
    console.log('ERROR', error)
    if (response.status === 500) {
      alert('Problema del server')
    }
    if (response.status === 429) {
      alert('Server overloadaed')
    }
    alert('Assenza di connessione...')
  })

// localStorage.clear()
