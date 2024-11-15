const apiKey =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MDBhMDhhZDEyOTAwMTU4NzZiYjEiLCJpYXQiOjE3MzE2NTc4ODgsImV4cCI6MTczMjg2NzQ4OH0.xQK6uAb_sB0o0F3MwMso74u56QBkTHd7Yggrfk3SM8Y'
const url = 'https://striveschool-api.herokuapp.com/api/product/'

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
    console.log('RESPONSE', response)
    if (response.ok) {
      const spinner = document.getElementById('spinner')
      spinner.classList.add('d-none')
      return response.json()
    } else {
      throw new Error('No ok')
    }
  })
  .then((arrayOfCars) => {
    console.log(arrayOfCars)
    const row = document.getElementById('shop')
    arrayOfCars.forEach((vettura) => {
      // genera tante colonne card quanti elementi ci sono nel server
      const newCol = document.createElement('div')
      newCol.classList.add(
        'col',
        'col-12',
        'col-md-6',
        'col-lg-4',
        'd-flex',
        'align-items-stretch'
      )
      newCol.innerHTML = `
            <div class="card mt-3 w-100">
                <img onclick="window.location.href = 'details.html?id=${
                  '' + vettura._id
                }'" src=" ${
        vettura.imageUrl
      }" class="card-img-top h-50 object-fit-fill transition" alt="${
        vettura.brand
      } ${vettura.name}">
                <div class="card-body">
                    <h5 class="card-title"><a class="text-decoration-none text-black" href="details.html?id=${
                      '' + vettura._id
                    }">${vettura.brand} ${vettura.name}</a></h5>
                    <p class="card-text">Potenza : ${vettura.description} hp</p>
                    <p class="card-text">${vettura.price}€
                </div>    
                <div class="card-footer d-flex justify-content-between">
                    <a href="details.html?id=${
                      '' + vettura._id
                    }" class="btn btn-outline-success">Dettagli</a>
                    <a href="backoffice.html?id=${
                      '' + vettura._id
                    }" class="btn btn-outline-warning">Modifica</a>
                </div>    
            </div>
        `
      row.appendChild(newCol)
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
