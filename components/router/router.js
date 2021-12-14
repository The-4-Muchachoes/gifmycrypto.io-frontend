import renderNavbar from '../navbar/navbar.js';
import renderMain from '../../pages/main/main.js';
import renderSignup from '../../pages/signup/signup.js';
import renderLogin from '../../pages/login/login.js';
import renderPortfolio from '../../pages/portfolio/portfolio.js';

export default () => {
  const router = new Navigo('/', { hash: true });
  window.router = router;
  router
    .on({
      '/': () => {
        renderMain().then(router.updatePageLinks);
      },
      login: () => {
        renderLogin().then(router.updatePageLinks);
      },
      signup: () => {
        renderSignup().then(router.updatePageLinks);
      },
      portfolio: () => {
        renderPortfolio().then(router.updatePageLinks);
      },
    })
    .on({
      '*': async () => {
        renderNavbar().then(router.updatePageLinks);
      },
    })
    .resolve();
};
