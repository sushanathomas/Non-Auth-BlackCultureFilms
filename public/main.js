const statusButtons = document.querySelectorAll('.status-button');
const deleteButtons = document.querySelectorAll('.delete-button');

Array.from(statusButtons).forEach(function(button) {
  button.addEventListener('click', function() {
    const id = this.dataset.id
    const status = this.dataset.status

    const newStatus = status === 'watched' ? 'unwatched' : 'watched'

    fetch('/movies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        status: newStatus
      })
    })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Could not update watched status')
        }

        window.location.reload()
      })
      .catch(function(error) {
        console.error(error)
        alert('Could not update watched status. Please try again.')
      })
  })
})

Array.from(deleteButtons).forEach(function(button) {
  button.addEventListener('click', function() {
    const id = this.dataset.id

    fetch('/movies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id
      })
    })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Could not delete film')
        }

        window.location.reload()
      })
      .catch(function(error) {
        console.error(error)
        alert('Could not delete film. Please try again.')
      })
  })
})
