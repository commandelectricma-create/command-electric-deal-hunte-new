async function searchDeals() {
  const q = document.getElementById('search')?.value || 'Milwaukee M18 near Westborough MA';

  const trustedStores = [
    'Home Depot', 'Lowe', 'Amazon', 'Grainger', 'SupplyHouse',
    'Zoro', 'Ace Hardware', 'Acme Tools', 'Walmart'
  ];

  const box = document.getElementById('deals');
  box.innerHTML = '<p>Searching trusted deals...</p>';

  const res = await fetch(`/api/search?q=${encodeURIComponent(q + ' near Westborough MA')}`);
  const data = await res.json();

  let results = data.shopping_results || [];

  results = results.filter(item =>
    trustedStores.some(store =>
      (item.source || '').toLowerCase().includes(store.toLowerCase())
    )
  );

  if (!results.length) {
    box.innerHTML = '<p>No trusted local/online deals found. Try another search.</p>';
    return;
  }

  box.innerHTML = results.slice(0, 20).map(item => `
    <div class="deal-card">
      <h3>${item.title || ''}</h3>
      <p><strong>Store:</strong> ${item.source || 'Unknown'}</p>
      <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
      <a href="${item.link || item.product_link || '#'}" target="_blank">Open Deal</a>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  if (search) {
    search.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchDeals();
    });
  }
  searchDeals();
});
