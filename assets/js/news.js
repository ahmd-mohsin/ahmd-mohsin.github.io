// news.js
document.addEventListener('DOMContentLoaded', () => {
    const ul = document.querySelector('.wrapper.style3 .container ul');
    fetch('assets/data/news.json')
      .then(res => res.json())
      .then(items => {
        ul.innerHTML = '';
        items.forEach(item => {
          const li = document.createElement('li');
          const span = document.createElement('span');
          span.className = 'date';
          span.textContent = `[${item.date}]`;
          li.appendChild(span);
          // use innerHTML for the rest
          li.insertAdjacentHTML('beforeend', ' ' + item.html);
          ul.appendChild(li);
        });
      })
      .catch(err => console.error('Failed to load news:', err));
  });
  