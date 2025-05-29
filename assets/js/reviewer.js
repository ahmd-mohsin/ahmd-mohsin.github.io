// reviews.js
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------
   * 1. Pick the <ul> that lives in the “Reviewer” box
   *    (give that <ul> the id="reviewer-list" in the HTML).
   * ------------------------------------------- */
  const ul = document.getElementById('reviewer-list');
  if (!ul) {
    console.error('Reviewer list element not found — check the id="reviewer-list" in your HTML.');
    return;
  }

  /* ---------------------------------------------
   * 2. Fetch the data file (assets/data/reviews.json)
   *    Expected structure - choose ONE of the two:
   *
   *    a) Array of plain strings:
   *       [
   *         "Conferences: AAAI, ICDAR, Globecom, WCNC, ICASSP, ICC",
   *         "Journals: IEEE TVT, IEEE Green Communications and Networks, ..."
   *       ]
   *
   *    b) Object with categorical keys:
   *       {
   *         "Conferences": ["AAAI", "ICDAR", ...],
   *         "Journals": ["IEEE TVT", "IEEE Green Communications and Networks", ...]
   *       }
   * ------------------------------------------- */
  fetch('assets/data/reviews.json')
    .then(res => res.json())
    .then(data => {
      ul.innerHTML = '';

      // ­--- case (a): array of strings ---
      if (Array.isArray(data)) {
        data.forEach(text => {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        });
        return;
      }

      /* ­--- case (b): key/value object --- */
      Object.entries(data).forEach(([category, list]) => {
        const li = document.createElement('li');
        li.innerHTML =
          `<strong>${category}:</strong> ${Array.isArray(list) ? list.join(', ') : list}`;
        ul.appendChild(li);
      });
    })
    .catch(err => console.error('Failed to load reviews:', err));
});
