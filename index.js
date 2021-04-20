import { emailIsValid, validatePhoneNumber } from './utils.js';

// SET AFID
// document.querySelector('#AFID').value = document.referrer.split('AFID=')[1] || '465368'
document.querySelector('#AFID').value =
  Array.from(
    window.location.search.replace('?zipcode=', '').replace('&AFID=', '')
  )
    .slice(5)
    .join('') || '465368';

// SET ZIP CODE
document.querySelector('#zip_code').value =
  Array.from(window.location.search.replace('?zipcode=', ''))
    .splice(0, 4)
    .join('') || '55555';

// THE FORM ELEMENT
const form = document.querySelector('#lp_form');

// prevent default on enter key!!!!
// form.addEventListener('keydown', preventSubmit)
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
  moveProgress();

  const formElement = e.target.parentElement.parentElement;
  const nextFormElement = formElement.nextElementSibling;
  const field = formElement.dataset.field;
  const formValue = e.target.dataset.value;
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
  if (
    formElement.dataset.field === 'propertyValue' ||
    formElement.dataset.field === 'additionalCash'
  ) {
    formElement.style.display = 'none';
    nextFormElement.style.display = 'block';
    moveProgress();
  }
  if (formElement.dataset.field === 'state') {
    const state = document.querySelector('#state');
    state.addEventListener('input', (e) => {
      e.target.value.length === 2
        ? state.classList.remove('required')
        : state.classList.add('required');
    });
    if (!state.value) {
      state.classList.add('required');
    }
    if (state.value) {
      formElement.style.display = 'none';
      nextFormElement.style.display = 'block';
      document.querySelector('[name="PROP_ST"]').value = state.value;
      moveProgress();
    }
  }
  if (formElement.dataset.field === 'address') {
    const addressInput = form.querySelector('#address');
    const cityInput = form.querySelector('#city');
    addressInput.addEventListener('input', (e) => {
      e.target.value.length >= 5
        ? addressInput.classList.remove('required')
        : addressInput.classList.add('required');
    });
    cityInput.addEventListener('input', (e) => {
      e.target.value.length >= 3
        ? cityInput.classList.remove('required')
        : cityInput.classList.add('required');
    });
    if (!form.address.value) {
      addressInput.classList.add('required');
    }
    if (!form.city.value) {
      cityInput.classList.add('required');
    }
    if (form.address.value && form.city.value) {
      formElement.style.display = 'none';
      nextFormElement.style.display = 'block';
      moveProgress();
    }
  }
  //  formElement.style.display = 'none';
  //  nextFormElement.style.display = 'block'
}

// set value for "I agree to terms and conditions"
const agreeInput = form.querySelector('#opt_in-checkbox');
agreeInput.addEventListener('change', (e) => {
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

  const formElement = e.target.parentElement.parentElement;

  if (formElement.dataset.field === 'contact') {
    const fNameInput = form.querySelector('#first_name');
    const lNameInput = form.querySelector('#last_name');
    const phoneInput = form.querySelector('#phone_primary');
    const emailInput = form.querySelector('#email_address');
    const phoneError = form.querySelector('#phone-error');
    let formIsValid = true;

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
    phoneInput.addEventListener('input', (e) => {
      phoneError.classList.add('hidden');
      e.target.value.length >= 10
        ? phoneInput.classList.remove('required')
        : phoneInput.classList.add('required');
    });
    emailInput.addEventListener('input', (e) => {
      emailIsValid(e.target.value)
        ? emailInput.classList.remove('required')
        : emailInput.classList.add('required');
    });

    if (!form.first_name.value) {
      fNameInput.classList.add('required');
      formIsValid = false;
    }
    if (!form.last_name.value) {
      lNameInput.classList.add('required');
      formIsValid = false;
    }
    if (!emailIsValid(form.email_address.value)) {
      emailInput.classList.add('required');
      formIsValid = false;
    }
    if (!validatePhoneNumber(form.phone_primary.value)) {
      phoneInput.classList.add('required');
      formIsValid = false;
    }
    if (!agreeInput.checked) {
      agreeInput.parentElement.classList.add('required-agree-terms');
      formIsValid = false;
    }

    (async () => {
      const validatedPhone = await validatePhoneNumber(
        form.phone_primary.value
      );

      if (formIsValid && validatedPhone.phoneNumber) {
        console.log('Phone number confirmed...', validatedPhone.phoneNumber);
        form.phone_primary.value = validatedPhone.phoneNumber;
        document.querySelector('.pageloader').classList.add('show');
        form.submit();
      } else {
        console.log('Phone number invalid...', validatedPhone);
        formIsValid = false;
        phoneInput.classList.add('required');
        phoneError.classList.remove('hidden');
        form.scrollIntoView(true);
      }
    })();
  }
}

// handle sliders
const sliders = document.querySelectorAll(`[type='range']`);
sliders.forEach((slider) =>
  slider.addEventListener('input', displaySliderValue)
);

function displaySliderValue(e) {
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
// // console.log([...progressIndicator]);

// progressIndicator.forEach(indicator => indicator.style.transform = 'translateX(30px)')
