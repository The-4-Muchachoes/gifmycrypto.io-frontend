export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/main/main.html')
    .then((Response) => Response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      run();
    });
};

async function run() {
  const marketData = await fetchMarketData();
  renderTopTenCryptos(marketData);
}

async function fetchMarketData() {
  const vsCurrency = `vs_currency=usd`;
  const perPage = 'per_page=100';
  const priceChange = 'price_change_percentage=1h,24h,7d';

  return await fetch(
    `${window.cryptoApi}/coins/markets?${vsCurrency}&${perPage}&${priceChange}`
  )
    .then((Response) => Response.json())
    .then((topTen) => {
      return topTen;
    });
}

async function fetchGifData(performance) {
  return await fetch(`${window.apiUrl}/api/public/gif/${performance}`)
    .then((Response) => Response.json())
    .then((gifData) => {
      return gifData;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

async function renderTopTenCryptos(marketData) {
  const topTen = document.querySelector('.top-10');
  topTen.innerHTML = await buildTopTenHtml(marketData);
}

async function buildTopTenHtml(marketData) {
  let html = `<table><tbody>`;

  await asyncForEach(marketData, async (coin) => {
    const performance = getCoinPerformance(coin, '24h');
    const symbol = coin.symbol.toUpperCase();
    const border = getGifBorderClass(performance);

    html += `
      <tr>
        <td>#${coin.market_cap_rank}</td>
        <td><img src="${coin.image}" class="fp-coin-logo"></td>
        <td>${coin.name}</td>
        <td>${symbol}</td>
        ${await getGifHtml(performance, border)}
        ${getPortfolioButtonIfAuthenticated()}
      </tr>`;
  });

  html += '</tbody></table>';
  return html;
}

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
}

function getPortfolioButtonIfAuthenticated() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } finally {
    if (user && user.accessToken) {
      return `<td>{add}</td>`;
    } else return '';
  }
}

function getCoinPerformance(coin, time) {
  let priceChange;
  switch (time) {
    case '1h':
      priceChange = coin.price_change_percentage_1h_in_currency;
    case '24h':
      priceChange = coin.price_change_percentage_24h_in_currency;
    case '7d':
      priceChange = coin.price_change_percentage_24h_in_currency;
  }

  if (priceChange > 1) return 1;
  else if (priceChange < -1) return -1;
  else return 0;
}

async function getGifHtml(performance, border) {
  const gifData = await fetchGifData(performance);
  let html;
  gifData == null
    ? (html = `<td><img class="fp-gif ${border}" alt="error">`)
    : (html = `</td><td><img src="${gifData.gifURL}" class="fp-gif ${border}" alt="${gifData.description}"></td>`);

  return html;
}

function getGifBorderClass(performance) {
  if (performance == 1) return 'green-border';
  if (performance == 0) return 'gray-border';
  if (performance == -1) return 'red-border';
}
