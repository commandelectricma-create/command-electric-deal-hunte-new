7const CATEGORIES = {
  "All": "electrical clearance construction tools",
  "Breakers": "electrical breaker clearance Square D Eaton Siemens",
  "Wire / Cable": "romex wire cable MC THHN clearance electrical",
  "GFCI / AFCI": "GFCI AFCI outlet breaker clearance Leviton Square D",
  "Tools": "Milwaukee DeWalt Klein tool clearance",
  "Batteries": "Milwaukee M18 DeWalt battery clearance",
  "Fans": "Panasonic bathroom exhaust fan clearance",
  "Lighting": "recessed light wafer LED clearance",
  "Connectors": "electrical connectors fittings clearance"
};

let selectedCategory = "All";
let minDiscount = 35;
let blockRyobi = true;

function buildControls() {
  const rulesBox = document.getElementById('rules');
  if (rulesBox) {
    rulesBox.innerHTML = Object.keys(CATEGORIES).map(cat => `
      <button class="filter-chip ${cat === selectedCategory ? 'active' : ''}" onclick="setCategory('${cat}')">
        ${cat}
      </button>
    `).join('');
  }

  const scoreSelect = document.getElementById('score');
  if (scoreSelect) {
    scoreSelect.innerHTML = `
      <option value="25">25%+ Deals</option>
      <option value="35" selected>35%+ Strong Deals</option>
      <option value="45">45%+ Surreal Deals</option>
      <option value="55">55%+ Crazy Clearance</option>
    `;
    scoreSelect.addEventListener('change', () => {
      minDiscount = Number(scoreSelect.value);
      searchDeals();
    });
  }
}

function setCategory(cat) {
  selectedCategory = cat;
  buildControls();
  searchDeals();
}

function scoreLabel(discount) {
  if (discount >= 55) return "Crazy Clearance";
  if (discount >= 45) return "Surreal Deal";
  if (discount >= 35) return "Strong Buy";
  if (discount >= 25) return "Buy";
  return "Watch";
}

async function searchDeals() {
  const searchInput = document.getElementById('search');
  const box = document.getElementById('deals');

  const typed = searchInput?.value?.trim() || "";
  const categoryQuery = CATEGORIES[selectedCategory] || CATEGORIES.All;

  const query = `${typed} ${categoryQuery} near Westborough MA`;

  box.innerHTML = `<p>Hunting ${minDiscount}%+ real clearance deals...</p>`;

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    let deals = data.deals || [];

    deals = deals
      .filter(item => Number(item.discount || 0) >= minDiscount)
      .filter(item => {
        if (!blockRyobi) return true;
        return !(item.title || "").toLowerCase().includes("ryobi");
      })
      .sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));

    updateStats(deals);

    if (!deals.length) {
      box.innerHTML = `
        <div class="empty">
          <h3>No deep clearance found.</h3>
          <p>Try another search, lower discount filter, or choose a different category.</p>
        </div>
      `;
      return;
    }

    box.innerHTML = deals.slice(0, 30).map(item => {
      const discount = Number(item.discount || 0);
      return `
        <div class="deal-card">
          ${item.thumbnail ? `<img class="deal-img" src="${item.thumbnail}" alt="">` : ""}
          <div class="deal-info">
            <h3>${item.title || "Untitled deal"}</h3>
            <p><strong>Store:</strong> ${item.store || "Unknown"}</p>
            <p><strong>Now:</strong> ${item.price || "N/A"}</p>
            <p><strong>Was:</strong> ${item.old_price || "N/A"}</p>
            <p><strong>Discount:</strong> ${discount}% OFF</p>
            <p><strong>Rating:</strong> ${scoreLabel(discount)}</p>
            <a class="deal-button" href="${item.link || "#"}" target="_blank" rel="noopener">
              OPEN DEAL
            </a>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    box.innerHTML = '<p>Error loading deals. Try again.</p>';
  }
}

function updateStats(deals) {
  const dealCount = document.getElementById('dealCount');
  const bestScore = document.getElementById('bestScore');
  const savings = document.getElementById('savings');

  if (dealCount) dealCount.textContent = deals.length;
  if (bestScore) bestScore.textContent = deals.length ? Math.max(...deals.map(d => Number(d.discount || 0))) : "—";
  if (savings) savings.textContent = deals.length ? `${Math.max(...deals.map(d => Number(d.discount || 0)))}% OFF` : "$0";
}

document.addEventListener('DOMContentLoaded', () => {
  buildControls();

  const search = document.getElementById('search');
  if (search) {
    search.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchDeals();
    });
  }

  searchDeals();
});
