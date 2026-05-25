async function searchDeals() {
  const query = document.getElementById('search').value || 'electrical supplies';

  const response = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_API_KEY}`);
  const data = await response.json();

  const dealsContainer = document.getElementById('deals');
  dealsContainer.innerHTML = '';

  if (!data.shopping_results) {
    dealsContainer.innerHTML = '<p>No deals found.</p>';
    return;
  }

  data.shopping_results.slice(0, 20).forEach(item => {
    dealsContainer.innerHTML += `
      <div class="deal-card">
        <h3>${item.title}</h3>
        <p><strong>Store:</strong> ${item.source}</p>
        <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
        <a href="${item.link}" target="_blank">BUY NOW</a>
      </div>
    `;
  });
}

document.getElementById('searchBtn').addEventListener('click', searchDeals);
window.onload = searchDeals;
