import renderPeriodButtons from '../../components/period-changer/period-changer.js';
import renderLegend from '../../components/legend/legend.js';
import renderCryptoTable from '../../components/crypto-table/table.js';

export default () => {
  redirectIfLoggedOut();

  const content = document.querySelector('.content');

  return fetch('./pages/portfolio/portfolio.html')
    .then((Response) => Response.text())
    .then((portfolioHtml) => {
      content.innerHTML = portfolioHtml;
      run();
    });
};

async function run() {
  const marketData = await fetchMarketData();

  if (marketData.length == 0) displayEmptyPortfolioMessage();
  else {
    await renderPeriodButtons(() => renderCryptoTable(marketData));
    await renderLegend();
    await renderCryptoTable(marketData);

    addRemoveCoinFromTableEventListeners();
  }
}

async function fetchMarketData() {
  const portfolio = JSON.parse(sessionStorage.getItem('portfolio'));
  if (!portfolio || portfolio.length == 0) return [];

  const ids = `ids=${portfolio.map((coin) => coin.id).toString()}`;
  const vsCurrency = `vs_currency=usd`;
  const priceChange = 'price_change_percentage=1h,24h,7d';

  return await fetch(
    `${window.cryptoApi}/coins/markets?${vsCurrency}&${ids}&${priceChange}`
  )
    .then((Response) => Response.json())
    .then((coinData) => {
      return coinData;
    });
}

function addRemoveCoinFromTableEventListeners() {
  const buttons = document.querySelectorAll('.ar-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      setTimeout(() => {
        const tr = document.querySelector(`#${button.id}`);
        tr.outerHTML = '';
        if (JSON.parse(sessionStorage.getItem('portfolio')).length == 0)
          displayEmptyPortfolioMessage();
      }, 1500);
    });
  });
}

function displayEmptyPortfolioMessage() {
  const wrapper = document.querySelector('.top-10');
  wrapper.innerHTML = `
          <div class="empty-message">
            <p>Your portfolio is empty</p>
            <img src="https://media.giphy.com/media/4mbL3aNbIHmP6/giphy.gif">
          </div>`;
}

function redirectIfLoggedOut() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } finally {
    if (!user || !user.accessToken) window.location.href = '/';
  }
}
