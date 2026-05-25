export default async function handler(req, res) {
  const queries = [
    'Milwaukee clearance',
    'electrical breaker clearance',
    'Romex wire clearance',
    'Panasonic exhaust fan sale',
    'GFCI outlet clearance',
    'DeWalt battery deal',
    'electrical tools special buy',
    'construction material clearance'
  ];

  const API_KEY = 'YOUR_SERPAPI_KEY';

  let allDeals = [];

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${API_KEY}`
      );

      const data = await response.json();

      if (data.shopping_results) {
        data.shopping_results.forEach(item => {
          const price = parseFloat((item.price || '0').replace(/[^0-9.]/g, ''));
          const oldPrice = parseFloat((item.extracted_old_price || '0'));

          let discount = 0;

          if (oldPrice > 0 && price > 0) {
            discount = Math.round(((oldPrice - price) / oldPrice) * 100);
          }

          if (discount >= 25) {
            allDeals.push({
              title: item.title,
              store: item.source,
              price: item.price,
              old_price: item.extracted_old_price ? `$${item.extracted_old_price}` : 'N/A',
              discount,
              score:
                discount >= 50 ? 'SURREAL DEAL' :
                discount >= 35 ? 'STRONG BUY' :
                'GOOD BUY',
              link: item.product_link || item.link
            });
          }
        });
      }
    } catch (err) {}
  }

  allDeals.sort((a, b) => b.discount - a.discount);

  res.status(200).json({
    deals: allDeals.slice(0, 30)
  });
}
