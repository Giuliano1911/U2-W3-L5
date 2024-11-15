const apiKey =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MDBhMDhhZDEyOTAwMTU4NzZiYjEiLCJpYXQiOjE3MzE2NTc4ODgsImV4cCI6MTczMjg2NzQ4OH0.xQK6uAb_sB0o0F3MwMso74u56QBkTHd7Yggrfk3SM8Y'
const url = 'https://striveschool-api.herokuapp.com/api/product/'

class Vettura {
  constructor(brand, name, description, imageUrl, price) {
    this.brand = brand
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.price = price
  }
}

const brandInput = document.getElementById('brand')
const nameInput = document.getElementById('name')
const descriptionInput = document.getElementById('description')
const imageUrlInput = document.getElementById('imageUrl')
const priceInput = document.getElementById('price')

const addressBarContent = new URLSearchParams(window.location.search)
const id = addressBarContent.get('id')

if (id) {
  fetch(url + id, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('No ok')
      }
    })
    .then((vettura) => {
      document.getElementById('brand').value = vettura.brand
      document.getElementById('name').value = vettura.name
      document.getElementById('description').value = vettura.description
      document.getElementById('imageUrl').value = vettura.imageUrl
      document.getElementById('price').value = vettura.price
      const buttons = document.getElementById('buttons')
      const deleteButton = document.createElement('button')
      deleteButton.setAttribute('type', 'button')
      deleteButton.classList.add('btn', 'btn-danger', 'mt-3')
      deleteButton.innerText = 'ELIMINA VETTURA'
      deleteButton.setAttribute('data-bs-toggle', 'modal')
      deleteButton.setAttribute('data-bs-target', '#delete-modal')
      const yesDelete = document.getElementById('yes-delete')
      yesDelete.addEventListener('click', () => {
        deleteVettura(vettura._id)
        window.location.replace('backoffice.html')
        // reset della pagina per poter subito creare una vettura nuova senza conflitti di id
      })
      buttons.appendChild(deleteButton)
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
} else {
}

const deleteVettura = function (id) {
  fetch(url + id, {
    method: 'DELETE',
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log('Eliminato')
      } else {
        if (response.status === 500) {
          alert('Problema del server')
        }
        throw new Error('No ok')
      }
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
}

const yesReset = document.getElementById('yes-reset')
yesReset.addEventListener('click', () => {
  brandInput.value = ''
  nameInput.value = ''
  descriptionInput.value = ''
  imageUrlInput.value = ''
  priceInput.value = ''
})

const form = document.getElementById('creation-form')
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const newVettura = new Vettura(
    brandInput.value,
    nameInput.value,
    descriptionInput.value,
    imageUrlInput.value,
    priceInput.value
  )
  console.log(newVettura)

  let putOrPost = id ? 'PUT' : 'POST'

  let idOrNotIdUrl = id ? url + id : url

  fetch(idOrNotIdUrl, {
    method: putOrPost,
    body: JSON.stringify(newVettura),
    headers: {
      'Content-Type': 'application/JSON',
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log('ok')
        brandInput.value = ''
        nameInput.value = ''
        descriptionInput.value = ''
        imageUrlInput.value = ''
        priceInput.value = ''
        window.location.replace('backoffice.html')
        // reset della pagina per poter subito creare una vettura nuova senza conflitti di id
      } else {
        if (response.status === 500) {
          alert('Problema del server')
        }
        throw new Error('No ok')
      }
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
})
