export default async () => {
  const wrapper = document.querySelector('.legend-wrapper');
  if (wrapper)
    return fetch('./components/legend/legend.html')
      .then((Response) => Response.text())
      .then((legendHtml) => {
        wrapper.innerHTML = legendHtml;
      });
};
