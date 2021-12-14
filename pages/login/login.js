import fetchPortfolio from '../../components/portfolio/fetch-portfolio.js';

export default () => {
  const content = document.querySelector('.content');

  redirectIfLoggedIn();

  return fetch('./pages/login/login.html')
    .then((response) => response.text())
    .then((loginHtml) => {
      content.innerHTML = loginHtml;

      handleLoginFunctionality();
    });
};

function handleLoginFunctionality() {
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    // Make sure the form is not submitted
    event.preventDefault();

    fetch(`${window.apiUrl}/api/public/login`, {
      // changed to our api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: document.querySelector('input.username').value,
        password: document.querySelector('input.password').value,
      }),
    })
      .then((Response) => Response.json())
      .then(async (data) => {
        if (data.accessToken) {
          localStorage.setItem('user', JSON.stringify(data));
          await fetchPortfolio();
          window.router.navigate(`/`);
        } else if (data.error) {
          if (data.status == 401) displayMessage(data.message, 'error-message');
          else displayMessage('something went wrong', 'error-message');
        }
      })
      .catch((error) => {
        console.log(error);
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
    if (user && user.accessToken) window.router.navigate('/');
  }
}
