async function searchDeals() {
  const search = document.getElementById('search');
  const box = document.getElementById('deals');

  const query = search.value.trim() || 'Milwaukee clearance';

  box.innerHTML = '<p>Searching clearance deals...</p>';

  try {
    const response = await fetch('/api/search?q=' + encodeURIComponent(query));
    const data = await response.json();
    const deals = data.deals || [];

    if (!deals.length) {
      box.innerHTML = '<p>No clearance deals found. Try: Milwaukee clearance, breaker clearance, Romex clearance.</p>';
      return;
    }

    box.innerHTML = deals.map(item => `
      <div style="border:1px solid #ddd; padding:16px; margin:14px 0; border-radius:12px;">
        <h3>${item.title}</h3>
        <p><b>Store:</b> ${item.store}</p>
        <p><b>Now:</b> ${item.price}</p>
        <p><b>Was:</b> ${item.old_price || 'N/A'}</p>
        <p><b>Discount:</b> ${item.discount}% OFF</p>
        <p><b>Rating:</b> ${item.score}</p>
        <a href="${item.link}" target="_blank">OPEN DEAL</a>
      </div>
    `).join('');
  } catch (e) {
    box.innerHTML = '<p>Error loading deals.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('searchBtn');
  const search = document.getElementById('search');

  btn.addEventListener('click', searchDeals);

  search.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') searchDeals();
  });
});
