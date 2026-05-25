async function searchDeals() {
  const searchInput = document.getElementById('search');
  const dealsContainer = document.getElementById('deals');

  const query = searchInput?.value || 'Milwaukee M18';

  dealsContainer.innerHTML = '<p>Searching real deals...</p>';

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    const results = data.shopping_results || [];

    if (!results.length) {
      dealsContainer.innerHTML = '<p>No real deals found. Try another search.</p>';
      return;
    }

    dealsContainer.innerHTML = results.slice(0, 20).map(item => `
      <div class="deal-card">
        <h3>${item.title || 'No title'}</h3>
        <p><strong>Store:</strong> ${item.source || 'Unknown'}</p>
        <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
        <a href="${item.link || item.product_link || '#'}" target="_blank" rel="noopener">
          Open Deal
        </a>
      </div>
    `).join('');
  } catch (error) {
    dealsContainer.innerHTML = '<p>Error loading deals.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const searchBtn = document.getElementById('searchBtn');

  if (searchBtn) searchBtn.addEventListener('click', searchDeals);

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchDeals();
    });
  }

  searchDeals();
});
