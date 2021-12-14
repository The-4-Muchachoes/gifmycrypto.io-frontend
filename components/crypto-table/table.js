import createButton from '../ar-button/ar-button.js';
import asyncForEach from '../async-foreach/async-foreach.js';

export default async (cryptoList) => {
  const table = document.querySelector('.crypto-table');
  if (table)
    return fetch('./components/crypto-table/table.html')
      .then((Response) => Response.text())
      .then(async (tableHtml) => {
        table.innerHTML = tableHtml;
        await buildCryptoTable(cryptoList, table);
      });
};

async function buildCryptoTable(cryptoList, table) {
  const tbody = document.querySelector('.crypto-tbody');
  table.appendChild(tbody);

  await asyncForEach(
    cryptoList,
    async (coin) => await buildCryptoRow(coin, tbody)
  );
}

async function buildCryptoRow(coin, tbody) {
  const tr = document.createElement('tr');
  const period = window.localStorage['selected-period'];
  const performance = getCoinPerformance(coin, period);
  const symbol = coin.symbol.toUpperCase();
  const border = getGifBorderClass(performance);

  tr.setAttribute('id', coin.id);

  tr.innerHTML = `
      <td>#${coin.market_cap_rank}</td>
      <td><img src="${coin.image}" class="fp-coin-logo"></td>
      <td>${coin.name}</td>
      <td>${symbol}</td>
      ${await getGifHtml(performance, border)}`;

  appendAddRemoveBtnIfAuthenticated(tr, coin);

  tbody.appendChild(tr);
}

function getCoinPerformance(coin, time) {
  let priceChange;
  switch (time) {
    case '1h':
      priceChange = coin.price_change_percentage_1h_in_currency;
      break;
    case '24h':
      priceChange = coin.price_change_percentage_24h_in_currency;
      break;
    case '7d':
      priceChange = coin.price_change_percentage_7d_in_currency;
      break;
  }

  if (priceChange > 1) return 1;
  else if (priceChange < -1) return -1;
  else return 0;
}

function getGifBorderClass(performance) {
  if (performance == 1) return 'green-border';
  if (performance == 0) return 'gray-border';
  if (performance == -1) return 'red-border';
}

async function getGifHtml(performance, border) {
  const gifData = await fetchGifData(performance);
  let html;
  gifData == null
    ? (html = `<td><img class="fp-gif ${border}" alt="error">`)
    : (html = `</td><td><img src="${gifData.gifURL}" class="fp-gif ${border}" alt="${gifData.description}"></td>`);

  return html;
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

function appendAddRemoveBtnIfAuthenticated(tr, coin) {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } finally {
    if (user && user.accessToken) {
      const button = createButton(coin);
      const td = document.createElement('td');
      td.appendChild(button);
      tr.appendChild(td);
    }
  }
}
