export default (coin) => {
  const button = document.createElement('button');
  const icon = document.createElement('i');
  button.setAttribute('class', 'ar-btn');
  button.setAttribute('id', coin.id);
  button.appendChild(icon);

  setButtonIcon(coin, icon);
  addButtonEventlistener(button, coin, icon);

  return button;
};

function getPortfolio() {
  let portfolio;
  try {
    portfolio = JSON.parse(sessionStorage.getItem('portfolio'));
  } finally {
    if (portfolio) return portfolio;
    else return [];
  }
}

function setPortfolio(portfolio) {
  sessionStorage.setItem('portfolio', JSON.stringify(portfolio));
}

function setButtonIcon(coin, icon) {
  const isInPortfolio = coinIsInPortfolio(coin);
  const iconClass = isInPortfolio ? 'fa fa-trash' : 'fa fa-plus';
  icon.setAttribute('class', iconClass);
}

function addButtonEventlistener(button, coin, icon) {
  button.addEventListener('click', async () => {
    button.disabled = true;
    coinIsInPortfolio(coin)
      ? await removeFromPortfolio(coin, icon)
      : await addToPortfolio(coin, icon);
    button.disabled = false;
  });
}

function coinIsInPortfolio(coin) {
  const portfolio = getPortfolio();
  let isInPortfolio;

  for (let i = 0; i < portfolio.length; i++) {
    isInPortfolio = portfolio[i].id == coin.id;
    if (isInPortfolio) break;
  }
  return isInPortfolio;
}

async function addToPortfolio(coin, icon) {
  const user = getUser();

  await fetch(`${window.apiUrl}/api/portfolio/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.accessToken,
    },
    body: JSON.stringify({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    }),
  })
    .then((Response) => Response.json())
    .then((portfolioData) => {
      if (portfolioData.error) {
      } else {
        setPortfolio(portfolioData);
        setButtonIcon(coin, icon);
      }
    });
}

async function removeFromPortfolio(coin, icon) {
  const user = getUser();

  await fetch(`${window.apiUrl}/api/portfolio/remove/${coin.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
  })
    .then((Response) => Response.json())
    .then((portfolioData) => {
      if (portfolioData.error) {
      } else {
        setPortfolio(portfolioData);
        setButtonIcon(coin, icon);
      }
    });
}

function getUser() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    return user;
  } catch {
    window.router.navigate('/');
  }
}
