// publications.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('publications');
  
    // utility: make an element with attrs
    function el(tag, attrs = {}, ...children) {
      const e = document.createElement(tag);
      for (let [k,v] of Object.entries(attrs)) {
        if (k.startsWith('data-')) e.setAttribute(k, v);
        else if (k === 'class') e.className = v;
        else e[k] = v;
      }
      children.forEach(c => {
        if (typeof c === 'string') e.appendChild(document.createTextNode(c));
        else if (c) e.appendChild(c);
      });
      return e;
    }
  
    // build one pub-card (media or details) from JSON
    function buildCard(pub, isMedia) {
      const card = el(
        'div', 
        {
          class: isMedia
            ? 'col-4 col-4-medium col-4-small vertically_aligned pub-card'
            : 'col-8 col-8-medium col-8-small vertically_aligned pub-card',
          'data-selected': String(pub.selected),
          'data-topic': pub.topic
        }
      );
  
      const art = el('article', {});
  
      if (isMedia) {
        const m = pub.media;
        if (m.type === 'video') {
          const video = el('video', { autoplay: true, muted: true, playsInline: true, loop: true, preload: 'metadata' });
          video.appendChild(el('source', { src: m.src, type: m.format }));
          art.appendChild(el('div', { class: 'image fit' }, video));
        } else {
          art.appendChild(el('div', { class: 'image fit' }, el('img', { src: m.src, alt: '' })));
        }
      } else {
        const d = pub.details;
        const h3 = el('h3', {}, d.title);
        const authorSpans = [];
        d.authors.forEach((a, i) => {
          let link;
          if (a.href) {
            link = el('a', { href: a.href, target: '_blank' }, a.name);
          } else {
            link = document.createTextNode(a.name);
          }
          const span = a.strong 
            ? el('span', { class: 'strong' }, link)
            : link;
          authorSpans.push(span);
          if (i < d.authors.length - 1) authorSpans.push(document.createTextNode(', '));
        });
  
        const links = d.links.map((l,i) => {
          const a = el('a', { href: l.href, target: '_blank', class: 'links' }, l.label);
          if (i < d.links.length - 1) a.after(document.createTextNode(' | '));
          return a;
        });
  
        art.style.textAlign = 'left';
        art.append(
          h3,
          el('span', {}, ...authorSpans),
          el('br'),
          el('span', { class: 'venue' }, d.venue),
          el('br'),
          ...links
        );
      }
  
      card.appendChild(art);
      return card;
    }
  
    // load JSON, render all
    fetch('assets/data/publications.json')
      .then(r => r.json())
      .then(data => {
        data.forEach(pub => {
          container.appendChild(buildCard(pub, true));
          container.appendChild(buildCard(pub, false));
        });
      })
      .catch(console.error);
  
    // toggle filters
    document.getElementById('show-selected').addEventListener('click', () => {
      document.querySelectorAll('.pub-card').forEach(c => {
        c.style.display = c.dataset.selected === 'true' ? '' : 'none';
      });
    });
    document.getElementById('show-all').addEventListener('click', () => {
      document.querySelectorAll('.pub-card').forEach(c => {
        c.style.display = '';
      });
    });
  });
  