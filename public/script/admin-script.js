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
  }).then()
}