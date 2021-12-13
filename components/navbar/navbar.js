// Written by Lars and Periklis

export default () => {
  const header = document.querySelector('.header');

  return fetch('./components/navbar/navbar.html')
    .then((Response) => Response.text())
    .then((navbarHtml) => {
      header.innerHTML = navbarHtml;
      renderNavbar();
    });
};

function renderNavbar() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}

  if (user && user.accessToken) renderLoggedIn();
  else renderLoggedOut();
}

function renderLoggedOut() {
  const navOptions = document.querySelector('.nav-options');

  navOptions.innerHTML = `
        <div class="flex logged-out">
            <div>
                <a href="" class="signup-nav nav-option" data-navigo>Signup</a>
            </div>
            <div>
                <a href="" class="login-nav nav-option" data-navigo>Login</a>
            </div>
         </div>`;

  const signup = document.querySelector('.signup-nav');
  const login = document.querySelector('.login-nav');
  signup.setAttribute('href', '/signup');
  login.setAttribute('href', '/login');
}

function renderLoggedIn() {
  const navOptions = document.querySelector('.nav-options');

  navOptions.innerHTML = `
      <div class="flex logged-in">
        <div>
          <a href="" class="portfolio-nav nav-option" data-navigo>Portfolio</a>
        </div>
        <div>
          <a class="logout-nav nav-option">Logout</a>
        </div>
      </div>`;

  const portfolio = document.querySelector('.portfolio-nav');
  const logout = document.querySelector('.logout-nav');
  portfolio.setAttribute('href', '/portfolio');
  logout.setAttribute('href', window.location.hash);

  logout.addEventListener('click', () => {
    localStorage.setItem('user', null);
    window.router.navigate('/');
  });
}
