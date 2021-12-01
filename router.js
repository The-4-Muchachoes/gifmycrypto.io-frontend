import renderMain from '/pages/main/main.js';

export default () => {
  const router = new Navigo('/', { hash: true });
  const contentDiv = document.querySelector('.content');
  router
    .on({
      '/': () => {
        renderMain().then(router.updatePageLinks);
        console.log('User requested main page');
      },
    })
    .resolve();
};
