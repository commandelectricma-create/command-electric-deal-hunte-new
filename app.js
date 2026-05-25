async function searchDeals() {
  const q = document.getElementById('search')?.value || 'electrical clearance';
  const box = document.getElementById('deals');

  box.innerHTML = '<p>Hunting deep deals...</p>';

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  const deals = data.deals || [];

  if (!deals.length) {
    box.innerHTML = '<p>No deep deals found. Try another search.</p>';
    return;
  }

  box.innerHTML = deals.map(item => `
    <div class="deal-card">
      <h3>${item.title}</h3>
      <p><strong>Store:</strong> ${item.store}</p>
      <p><strong>Now:</strong> ${item.price}</p>
      <p><strong>Was:</strong> ${item.old_price || 'N/A'}</p>
      <p><strong>Discount:</strong> ${item.discount}% OFF</p>
      <p><strong>Rating:</strong> ${item.score}</p>
      <a href="${item.link}" target="_blank">OPEN DEAL</a>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');

  if (search) {
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchDeals();
      }
    });
  }

  searchDeals();
});
