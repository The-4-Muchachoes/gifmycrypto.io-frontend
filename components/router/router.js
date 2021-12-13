import renderNavbar from '../navbar/navbar.js';
import renderMain from '/pages/main/main.js';
import renderSignup from '/pages/signup/signup.js';
import renderLogin from '../../pages/login/login.js';
// import renderProfile from '../../pages/profile/profile.js';
// import renderRequest from '../../pages/send-friend-request/request.js';

export default () => {
  const router = new Navigo('/', { hash: true });
  window.router = router;
  router
    .on({
      '/': () => {
        renderMain().then(router.updatePageLinks);
        console.log('User requested main page');
      },
      login: () => {
        renderLogin().then(router.updatePageLinks);
        console.log('User requested login page');
      },
      signup: () => {
        renderSignup().then(router.updatePageLinks);
        console.log('User requested signup page');
      },
      // portfolio: () => {
      //   renderPortfolio().then(router.updatePageLinks);
      // },
      // requests: () => {
      //   renderRequest().then(router.updatePageLinks);
      // },
    })
    .on({
      '*': async () => {
        renderNavbar().then(router.updatePageLinks);
      },
    })
    .resolve();
};
