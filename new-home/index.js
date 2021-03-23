// SET AFID 
document.querySelector('#AFID').value = document.referrer.split('AFID=')[1] || '465368'


// THE  FORM ELEMENT 
const form = document.querySelector('#lp_form')


// prevent default on enter key!!!!
window.addEventListener('keydown', preventSubmit)
function preventSubmit(e) {
    if (e.keyCode === 13) {
        e.preventDefault()
        e.stopPropagation()
    }
}

// handle questions with button 
const button = document.querySelectorAll('.question')
button.forEach(btn => btn.addEventListener('click', handleClick))

function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    // move progress bar
    moveProgress()
    const formElement = e.target.parentElement.parentElement
    const nextFormElement = formElement.nextElementSibling
    const field = formElement.dataset.field
    const formValue = e.target.dataset.value;
//    console.log({ field }, { formValue })
    const input = document.querySelector(`[name=${field}]`)

    // set the value to be submitted
    input.value = formValue
    // show next, hide current 
    formElement.style.display = 'none';
    nextFormElement.style.display = 'block'
}


// handle questions with their own field value
const setBtn = document.querySelectorAll('.next')
setBtn.forEach(btn => btn.addEventListener('click', setValue))

function setValue(e) {
    e.preventDefault()
    e.stopPropagation()

    // selectors 
    const formElement = e.target.parentElement.parentElement
    const nextFormElement = formElement.nextElementSibling

    if (formElement.dataset.field === 'propertyValue') {
        formElement.style.display = 'none';
        nextFormElement.style.display = 'block'
        moveProgress()
    }

    if (formElement.dataset.field === 'state') {
        const state = document.querySelector('#PROP_ST')
        const zip = document.querySelector('#PROP_ZIP')
        if (!zip.value) {
            zip.classList.add('select-styled-required')
            zip.classList.remove('select-styled')
            return
         } else if (!state.value) {
            state.classList.add('select-styled-required')
            state.classList.remove('select-styled')
             return
         } else {
            formElement.style.display = 'none';
            nextFormElement.style.display = 'block'
            document.querySelector('[name="PROP_ST"]').value = state.value
            moveProgress()
        }
     }
    if (formElement.dataset.field === 'address') {
        if (!form.address.value) {
            const addressInput = form.querySelector('#address')
            addressInput.placeholder = '* Address Required'
            addressInput.classList.add('required')
            addressInput.classList.remove('input-styled')
            return
        } else if (!form.city.value) {
            const cityInput = form.querySelector('#city')
            cityInput.placeholder = '* Required'
            cityInput.classList.add('required')
            cityInput.classList.remove('input-styled')
            return
        }
         else if (!form.state.value) {
            const stateInput = form.querySelector('#state')
            stateInput.classList.add('select-styled-required')
            stateInput.classList.remove('input-styled')
            return
        } else if (!form.zip_code.value) {
        const zip_code = document.querySelector('#zip_code')        
        zip_code.placeholder = '* Zip Code Required'
        zip_code.classList.add('required')
        zip_code.classList.remove('input-styled')
        return
        } else {
            formElement.style.display = 'none';
            nextFormElement.style.display = 'block'
            moveProgress()
        }
    }
    //  formElement.style.display = 'none';
    //  nextFormElement.style.display = 'block'
}

// set value for "I  agree to terms and conditions"
const agreeInput = form.querySelector('#opt_in-checkbox')
agreeInput.addEventListener('click', () => document.querySelector('#opt_in').value = 1)

// submit form
const submitBtn = document.querySelector('.submit')
submitBtn.addEventListener('click', sendSubmission)


function sendSubmission(e) {
    e.preventDefault()
    e.stopPropagation()

    const formElement = e.target.parentElement.parentElement
    const phoneInput = form.querySelector('#phone_home')

    // email validation
    function emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    function validatePhoneNumber(phoneNum) {
        const check = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        return check.test(phoneNum);
    }
    function simplifyPhone(number) {
        return number.replace(/\D/g, '')
    }
    if (formElement.dataset.field === 'contact') {
        if (!form.first_name.value) {
            const fNameInput = form.querySelector('#first_name')
            fNameInput.placeholder = '* First Name Required'
            fNameInput.classList.add('required')
            fNameInput.classList.remove('input-styled')
            return
        } else if (!form.last_name.value) {
            const lNameInput = form.querySelector('#last_name')
            lNameInput.placeholder = '* Last Name Required'
            lNameInput.classList.add('required')
            lNameInput.classList.remove('input-styled')
            return
        } else if (!emailIsValid(form.email_address.value)) {
            const emailInput = form.querySelector('#email_address')
            emailInput.placeholder = '* Email Required'
            emailInput.classList.add('required')
            emailInput.classList.remove('input-styled')
            return
        } else if (!validatePhoneNumber(form.phone_home.value)) {
            phoneInput.placeholder = '* XXX-XXX-XXXX'
            phoneInput.classList.add('required')
            phoneInput.classList.remove('input-styled')
            return
        } else if (!agreeInput.checked) {
            agreeInput.parentElement.classList.add('required-agree')
            agreeInput.classList.add('required-agree-terms')
            agreeInput.classList.remove('input-styled')
            return
        } else {
            phoneInput.value = simplifyPhone(phoneInput.value)
            form.phone_work.value = simplifyPhone(form.phone_work.value)
            form.phone_cell.value = simplifyPhone(form.phone_cell.value)
            // add spinner 
            document.querySelector('.pageloader').classList.add('show')
            form.submit()
        }
    }
}



// handle sliders 
const sliders = document.querySelectorAll(`[type='range']`)
sliders.forEach(slider => slider.addEventListener('input', displaySliderValue))

function displaySliderValue(e) {
// running slider function
    const displayValue = document.querySelector(`#${e.target.id}Text`)
    displayValue.innerHTML = `<span>$${Number(e.target.value).toLocaleString()}</span>`
}

//go back
const backBtn = document.querySelectorAll('.gold-btn')
backBtn.forEach(btn => btn.addEventListener('click', goBack))
function progressBack() {
    let theBar = document.querySelector('.the-bar')
    const amountToMove = document.querySelectorAll('.form-box')
    const distanceToMove = 100 / amountToMove.length
    theBar.style.width = `${moved -= distanceToMove}%`
}

function goBack(e) {
    e.preventDefault()

    const formElement = e.target.parentElement
    const prevElement = formElement.previousElementSibling;
    formElement.style.display = 'none'
    prevElement.style.display = 'block'
    progressBack()
}


// move progress bar
let moved = 1 // progress bar memory
function moveProgress() {
    let theBar = document.querySelector('.the-bar')
    const amountToMove = document.querySelectorAll('.form-box')
    const distanceToMove = 100 / amountToMove.length
    theBar.style.width = `${moved += distanceToMove}%`
}

// todo: progress indicator dots
// const progressIndicator = document.querySelectorAll('.progressIndicator')
// console.log([...progressIndicator]);

// progressIndicator.forEach(indicator => indicator.style.transform = 'translateX(30px)')
