function sendUpdateReq(){
  const data = document.getElementById('change-button').dataset.url;
  const url = 'http://localhost:4000/admin/user/' + data;
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fname: document.getElementById('fname').value,
      lname: document.getElementById('lname').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  }).then((response)=> response.json())
  .then(data => window.location.href = data.redirect)
  .catch(err => console.log(err));
}

function sendDeleteReq(){
  const data = document.getElementById('delete-button').dataset.url;
  console.log(data)
  const url = 'http://localhost:4000/admin/' + data;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      id: data
    })
  })
  .then((response) => response.json())
  .then(data => window.location.href = data.redirect)
  .catch(err => console.log(err))
}