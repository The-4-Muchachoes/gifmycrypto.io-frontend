export default async (callback) => {
  const wrapper = document.querySelector('.period-wrapper');

  if (wrapper)
    return fetch('./components/period-changer/period-changer.html')
      .then((Response) => Response.text())
      .then((periodHtml) => {
        wrapper.innerHTML = periodHtml;
        run(callback);
      });
};

function run(callback) {
  const buttons = document.querySelectorAll('.period-changer');

  renderActiveButton(buttons);
  addEventListeners(buttons, callback);
}

function addEventListeners(buttons, callback) {
  const periods = ['1h', '24h', '7d'];
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      if (buttons[i].getAttribute('class').includes('inactive-button')) {
        window.localStorage['selected-period'] = periods[i];
        renderActiveButton(buttons);
        callback();
      }
    });
  }
}

function renderActiveButton(buttons) {
  const selectedPeriod = window.localStorage.getItem('selected-period');

  if (!selectedPeriod) window.localStorage['selected-period'] = '24h';
  buttons.forEach((button) => {
    button.setAttribute(
      'class',
      button.name == selectedPeriod
        ? 'period-changer active-button'
        : 'period-changer inactive-button'
    );
  });
}
