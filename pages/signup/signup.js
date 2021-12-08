export default () => {
    const content = document.querySelector('.content');
  
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
        .then((data) => {
          // navigating to the users route. Using the global window.router
          // window.router.navigate(`/user/${data.id}`);
          window.router.navigate('/');
        });
    });
  }
  