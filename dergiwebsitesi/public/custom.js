$(window).ready(function(){
  $('.owl-carousel').owlCarousel({
      loop:true,
      margin:10,
      nav:false,
      responsive:{
          0:{
              items:1
          },
          600:{
              items:1
          },
          1000:{
              items:1
          }
      }
  });
});


/* header kısmı opaklık ve saydamlık ayarlama */
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('opaque');
      header.classList.remove('transparent');
    } 
    else {
      header.classList.add('transparent');
      header.classList.remove('opaque');
    }
    });
  });


function validateRegistrationForm() {
  var nameInput = document.forms[0]["name"];
  var emailInput = document.forms[0]["email"];
  var passwordInput = document.forms[0]["password"];
  var confirmPasswordInput = document.forms[0]["confirmPassword"];
  var errorMessage = document.getElementById('errorMessage');
  var successMessage = document.getElementById('successMessage');

  errorMessage.innerHTML = '';
  errorMessage.style.display = 'none';
  successMessage.innerHTML = ''; // Başarı mesajını sıfırla
  successMessage.style.display = 'none';

  if (nameInput.value.trim() === "") {
      errorMessage.innerHTML = 'Ad ve Soyad boş bırakılamaz.';
      errorMessage.style.display = 'block';
      return false;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
      errorMessage.innerHTML = 'Geçerli bir e-posta adresi girin.';
      errorMessage.style.display = 'block';
      return false;
  }

  if (passwordInput.value.length < 6) {
      errorMessage.innerHTML = 'Şifre en az 6 karakter olmalıdır.';
      errorMessage.style.display = 'block';
      return false;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
      errorMessage.innerHTML = 'Şifreler uyuşmuyor.....';
      errorMessage.style.display = 'block';
      return false;
  }

  // Sunucuya formu gönder
  fetch('/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
          confirmPassword: confirmPasswordInput.value,
      }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Başarı durumu
          successMessage.innerHTML = 'Başarıyla kaydedildi.';
          successMessage.style.display = 'block';
      } else {
          // Hata durumu
          errorMessage.innerHTML = data.message;
          errorMessage.style.display = 'block';
      }
  })

  .catch(error => {
      console.error('Hata oluştu:', error);
      errorMessage.innerHTML = 'Bir hata oluştu.';
      errorMessage.style.display = 'block';
  });


  // Formun sunucuya gönderilmesini engelle
  return false;
}


function showuye() {
  document.getElementById('uye').style.display = 'block';
}
function hideuye() {
  document.getElementById('uye').style.display = 'none';
  }

/* popup için script kısmı */
function showPopup() {
  document.getElementById('popup').style.display = 'block';
}
function hidePopup() {
  document.getElementById('popup').style.display = 'none';
}

function ozet1(){
  document.getElementById('ozet1').style.display = 'block';
}
function ozetkapama1(){
  document.getElementById('ozet1').style.display = 'none';
}
function ozet2(){
  document.getElementById('ozet2').style.display = 'block';
}
function ozetkapama2(){
  document.getElementById('ozet2').style.display = 'none';
}
function ozet3(){
  document.getElementById('ozet3').style.display = 'block';
}
function ozetkapama3(){
  document.getElementById('ozet3').style.display = 'none';
}

function showmakale() {
  document.getElementById('makaleForm').style.display = 'block';
}
function hidemakale() {
  document.getElementById('makaleForm').style.display = 'none';
  }

document.addEventListener('DOMContentLoaded', function() {
  // Üye listesini getir
  refreshUserList();
});