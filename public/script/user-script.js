function validateEmail(){
  const email = document.getElementById('email');
  const message = document.getElementById('email-error');
  checkEmail(email, message);
}
function validatePassword(){
  const password = document.getElementById('password');
  const message = document.getElementById('password-error');
  checkField(password, message);
}
function validateFname(){
  const name = document.getElementById('fname');
  const message = document.getElementById('fname-error')
  checkField(name, message);
}
function validateLname(){
  const name = document.getElementById('lname');
  const message = document.getElementById('lname-error');
  checkField(name, message);
}
function validateUsername(){
  const name = document.getElementById('username');
  const message = document.getElementById('username-error');
  checkField(name, message);
}
function confirmPassword(){
  const password1 = document.getElementById('confirm-password');
  const password2 = document.getElementById('password');
  if(password1.value != password2.value){
    const parent = password1.parentElement;
    if(!parent.classList.contains('error')){
      parent.classList.add('error');
    }
    document.getElementById('confirm-password-error').innerHTML = "Password does not match"
  }else{
    const parent = password1.parentElement;
    if(parent.classList.contains('error')){
      parent.classList.remove('error');
    }
  }
}

function checkEmail(email, message){
  const parent = email.parentElement;
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(email.value == ""){
    parent.classList.add('error');
    message.innerHTML = "This field cannot be empty";
  }else if(reg.test(email.value)){
    if(parent.classList.contains('error')){
      parent.classList.remove('error');
    }
  }else{
    parent.classList.add('error');
    message.innerHTML = "Please enter valid email";
  }
}
function checkField(element, message){
  const parent = element.parentElement;
  if(element.value == ""){
    message.innerHTML = "This field cannot be empty";
    parent.classList.add('error');
  }else{
    parent.classList.remove('error');
  }
}
const form = document.querySelector('#form');
form.addEventListener('submit', (event)=>{
  if(isFormValid()==true){
    form.submit();
  }else{
    event.preventDefault();
  }
});

function isFormValid(){
  const check = document.querySelectorAll('form div');
  let result = true;
  check.forEach(item => {
    if(item.classList.contains('error')){
      result = false;
    }
  });
  return result;
}

function validateLogin(){
  validateEmail();
  validatePassword();
}
function validateRegister(){
  validateFname();
  validateLname();
  validateEmail();
  validatePassword();
  confirmPassword();
}
function validateAdminLogin(){
  validateUsername();
  validatePassword();
}