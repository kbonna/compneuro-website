// Grab DOM elements
const formElement = document.querySelector('.contact');
const nameInput = document.getElementById('contact__name');
const nameError = document.getElementById('contact__name-error');
const emailInput = document.getElementById('contact__email');
const emailError = document.getElementById('contact__email-error');
const titleInput = document.getElementById('contact__title');
const titleError = document.getElementById('contact__title-error');
const messageInput = document.getElementById('contact__message');
const messageError = document.getElementById('contact__message-error');

function clearErrors() {
    const inputArray = [nameInput, emailInput, titleInput, messageInput];
    inputArray.forEach(element => {
        element.classList.remove('contact__input--error');
    });
    const errorArray = [nameError, emailError, titleError, messageError];
    errorArray.forEach(element => {
        element.innerText = '';
    });
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

formElement.addEventListener('submit', event => {
    clearErrors();

    if (nameInput.value.length === 0) {
        event.preventDefault();
        nameError.innerText = 'Enter your name.';
        nameInput.classList.add('contact__input--error');
    }

    if (emailInput.value.length === 0) {
        event.preventDefault();
        emailError.innerText = 'Enter your email.';
        emailInput.classList.add('contact__input--error');
    } else if (!validateEmail(emailInput.value)) {
        event.preventDefault();
        emailError.innerText = 'Provided email is invalid.';
        emailInput.classList.add('contact__input--error');
    }

    if (titleInput.value.length === 0) {
        event.preventDefault();
        titleError.innerText = 'Enter the title of your message.';
        titleInput.classList.add('contact__input--error');
    }

    if (messageInput.value.length === 0) {
        event.preventDefault();
        messageError.innerText = 'Enter your message.';
        messageInput.classList.add('contact__input--error');
    } else if (messageInput.value.length <= 10) {
        event.preventDefault();
        messageError.innerText =
            'Your message have to be at least 10 characters long.';
        messageInput.classList.add('contact__input--error');
    }
});
