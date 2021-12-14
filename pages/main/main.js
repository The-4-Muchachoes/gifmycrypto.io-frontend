import renderPeriodButtons from '../../components/period-changer/period-changer.js';
import renderLegend from '../../components/legend/legend.js';
import renderCryptoTable from '../../components/crypto-table/table.js';

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
  renderPeriodButtons(() => renderCryptoTable(marketData, () => {}));
  renderLegend();
  renderCryptoTable(marketData, () => {});
}

async function fetchMarketData() {
  const vsCurrency = `vs_currency=usd`;
  const perPage = 'per_page=10';
  const priceChange = 'price_change_percentage=1h,24h,7d';

  return await fetch(
    `${window.cryptoApi}/coins/markets?${vsCurrency}&${perPage}&${priceChange}`
  )
    .then((Response) => Response.json())
    .then((topTen) => {
      return topTen;
    });
}
