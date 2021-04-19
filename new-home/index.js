// SET AFID
document.querySelector('#AFID').value =
  document.referrer.split('AFID=')[1] || '465368';

// THE  FORM ELEMENT
const form = document.querySelector('#lp_form');

// prevent default on enter key!!!!
window.addEventListener('keydown', preventSubmit);
function preventSubmit(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.stopPropagation();
  }
}

// handle questions with button
const button = document.querySelectorAll('.question');
button.forEach((btn) => btn.addEventListener('click', handleClick));

function handleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  // move progress bar
  moveProgress();
  const formElement = e.target.parentElement.parentElement;
  const nextFormElement = formElement.nextElementSibling;
  const field = formElement.dataset.field;
  const formValue = e.target.dataset.value;
  //    console.log({ field }, { formValue })
  const input = document.querySelector(`[name=${field}]`);

  // set the value to be submitted
  input.value = formValue;
  // show next, hide current
  formElement.style.display = 'none';
  nextFormElement.style.display = 'block';
}

// handle questions with their own field value
const setBtn = document.querySelectorAll('.next');
setBtn.forEach((btn) => btn.addEventListener('click', setValue));

function setValue(e) {
  e.preventDefault();
  e.stopPropagation();

  // selectors
  const formElement = e.target.parentElement.parentElement;
  const nextFormElement = formElement.nextElementSibling;

  if (formElement.dataset.field === 'propertyValue') {
    formElement.style.display = 'none';
    nextFormElement.style.display = 'block';
    moveProgress();
  }

  if (formElement.dataset.field === 'state') {
    const zip = document.querySelector('#PROP_ZIP');
    const state = document.querySelector('#PROP_ST');
    zip.addEventListener('input', (e) => {
      e.target.value.length === 5
        ? zip.classList.remove('required')
        : zip.classList.add('required');
    });
    state.addEventListener('input', (e) => {
      e.target.value.length === 2
        ? state.classList.remove('required')
        : state.classList.add('required');
    });

    if (!zip.value) {
      zip.classList.add('select-styled-required');
    } else if (!state.value) {
      state.classList.add('select-styled-required');
    } else {
      formElement.style.display = 'none';
      nextFormElement.style.display = 'block';
      document.querySelector('[name="PROP_ST"]').value = state.value;
      moveProgress();
    }
  }
  const addressInput = form.querySelector('#address');
  const cityInput = form.querySelector('#city');
  const stateInput = form.querySelector('#state');
  const zip_code = document.querySelector('#zip_code');

  addressInput.addEventListener('input', (e) => {
    e.target.value.length > 5
      ? addressInput.classList.remove('required')
      : addressInput.classList.add('required');
  });
  city.addEventListener('input', (e) => {
    e.target.value.length > 2
      ? cityInput.classList.remove('required')
      : cityInput.classList.add('required');
  });
  stateInput.addEventListener('input', (e) => {
    e.target.value.length === 2
      ? addressInput.classList.remove('select-styled-required')
      : addressInput.classList.add('select-styled-required');
  });
  zip_code.addEventListener('input', (e) => {
    e.target.value.length === 5
      ? zip_code.classList.remove('required')
      : zip_code.classList.add('required');
  });

  if (formElement.dataset.field === 'address') {
    if (!form.address.value) {
      addressInput.classList.add('required');
    }
    if (!form.city.value) {
      cityInput.classList.add('required');
    }
    if (!form.state.value) {
      stateInput.classList.add('select-styled-required');
    }
    if (!form.zip_code.value) {
      zip_code.classList.add('required');
    }
    if (
      form.address.value &&
      form.city.value &&
      form.state.value &&
      form.zip_code.value
    ) {
      formElement.style.display = 'none';
      nextFormElement.style.display = 'block';
      moveProgress();
    }
  }
  //  formElement.style.display = 'none';
  //  nextFormElement.style.display = 'block'
}

// set value for "I  agree to terms and conditions"
const agreeInput = form.querySelector('#opt_in-checkbox');
agreeInput.addEventListener('click', (e) => {
  if (e.target.checked) {
    document.querySelector('#opt_in').value = 1;
    agreeInput.parentElement.classList.remove('required-agree-terms');
  } else {
    document.querySelector('#opt_in').value = 0;
    agreeInput.parentElement.classList.add('required-agree-terms');
  }
});

// submit form
const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click', sendSubmission);

function sendSubmission(e) {
  e.preventDefault();
  e.stopPropagation();

  let formIsValid = true;
  const formElement = e.target.parentElement.parentElement;
  const fNameInput = form.querySelector('#first_name');
  const lNameInput = form.querySelector('#last_name');
  const emailInput = form.querySelector('#email_address');
  const phoneInput = form.querySelector('#phone_primary');

  fNameInput.addEventListener('input', (e) => {
    e.target.value.length >= 2
      ? fNameInput.classList.remove('required')
      : fNameInput.classList.add('required');
  });
  lNameInput.addEventListener('input', (e) => {
    e.target.value.length >= 2
      ? lNameInput.classList.remove('required')
      : lNameInput.classList.add('required');
  });

  emailInput.addEventListener('input', (e) => {
    emailIsValid(e.target.value)
      ? emailInput.classList.remove('required')
      : emailInput.classList.add('required');
  });
  phoneInput.addEventListener('input', (e) => {
    validatePhoneNumber(e.target.value)
      ? phoneInput.classList.remove('required')
      : phoneInput.classList.add('required');
  });

  // Validation Functions
  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhoneNumber(phoneNum) {
    const check = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return check.test(phoneNum);
  }

  function simplifyPhone(number) {
    return number.replace(/\D/g, '');
  }

  if (formElement.dataset.field === 'contact') {
    if (!form.first_name.value) {
      formIsValid = false;
      fNameInput.classList.add('required');
    }
    if (!form.last_name.value) {
      formIsValid = false;
      lNameInput.classList.add('required');
    }
    if (!emailIsValid(form.email_address.value)) {
      formIsValid = false;
      emailInput.classList.add('required');
    }
    if (!validatePhoneNumber(form.phone_primary.value)) {
      formIsValid = false;
      phoneInput.classList.add('required');
    }
    if (!agreeInput.checked) {
      formIsValid = false;
      agreeInput.parentElement.classList.add('required-agree-terms');
      agreeInput.classList.add('required-agree-terms');
    }
    if (formIsValid) {
      phoneInput.value = simplifyPhone(phoneInput.value);
      form.phone_primary.value = simplifyPhone(form.phone_primary.value);
      // add spinner
      document.querySelector('.pageloader').classList.add('show');
      form.submit();
    }
  }
}

// handle sliders
const sliders = document.querySelectorAll(`[type='range']`);
sliders.forEach((slider) =>
  slider.addEventListener('input', displaySliderValue)
);

function displaySliderValue(e) {
  // running slider function
  const displayValue = document.querySelector(`#${e.target.id}Text`);
  displayValue.innerHTML = `<span>$${Number(
    e.target.value
  ).toLocaleString()}</span>`;
}

//go back
const backBtn = document.querySelectorAll('.gold-btn');
backBtn.forEach((btn) => btn.addEventListener('click', goBack));
function progressBack() {
  let theBar = document.querySelector('.the-bar');
  const amountToMove = document.querySelectorAll('.form-box');
  const distanceToMove = 100 / amountToMove.length;
  theBar.style.width = `${(moved -= distanceToMove)}%`;
}

function goBack(e) {
  e.preventDefault();

  const formElement = e.target.parentElement;
  const prevElement = formElement.previousElementSibling;
  formElement.style.display = 'none';
  prevElement.style.display = 'block';
  progressBack();
}

// move progress bar
let moved = 1; // progress bar memory
function moveProgress() {
  let theBar = document.querySelector('.the-bar');
  const amountToMove = document.querySelectorAll('.form-box');
  const distanceToMove = 100 / amountToMove.length;
  theBar.style.width = `${(moved += distanceToMove)}%`;
}

// todo: progress indicator dots
// const progressIndicator = document.querySelectorAll('.progressIndicator')
// console.log([...progressIndicator]);

// progressIndicator.forEach(indicator => indicator.style.transform = 'translateX(30px)')
