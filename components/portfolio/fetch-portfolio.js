export default async () => {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } finally {
    if (user && user.accessToken) {
      let portfolio;
      try {
        portfolio = JSON.parse(sessionStorage.getItem('portfolio'));
      } finally {
        if (!portfolio) await fetchPortfolio(user);
      }
    }
  }
};

async function fetchPortfolio(user) {
  await fetch(`${window.apiUrl}/api/portfolio`, {
    headers: {
      Authorization: 'Bearer ' + user.accessToken,
    },
  })
    .then((Response) => Response.json())
    .then((portfolioData) => {
      if (!portfolioData.error)
        sessionStorage.setItem('portfolio', JSON.stringify(portfolioData));
    });
}
