import fetchPortfolio from '../../components/portfolio/fetch-portfolio.js';

export default () => {
  const content = document.querySelector('.content');

  redirectIfLoggedIn();

  return fetch('./pages/signup/signup.html')
    .then((response) => response.text())
    .then((signupHtml) => {
      content.innerHTML = signupHtml;

      handleSignInFunctionality();
    });
};

function handleSignInFunctionality() {
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    // Make sure the form is not submitted
    event.preventDefault();

    fetch(`${window.apiUrl}/api/public/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: document.querySelector('input.username').value,
        password: document.querySelector('input.password').value,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.accessToken) {
          // Saving the JWT to local storage
          localStorage.setItem('user', JSON.stringify(data));
          displayMessage('User signup successful', 'success-message');
          await fetchPortfolio();
          window.history.go(-1);
        } else if (data.error) {
          if (data.status == 302) {
            displayMessage('Username already taken', 'error-message');
          } else displayMessage('something went wrong', 'error-message');
        }
      });
  });
}

function displayMessage(message, type) {
  const messageP = document.querySelector('.message');
  messageP.setAttribute('class', `message ${type}`);
  messageP.innerHTML = message;
}

function redirectIfLoggedIn() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } finally {
    if (user && user.accessToken) window.history.back('/');
  }
}
