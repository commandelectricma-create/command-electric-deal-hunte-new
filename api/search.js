export default async function handler(req, res) {
  try {
    const q = req.query.q || 'electrical clearance tools batteries wire breakers';

    const trustedStores = [
      'Home Depot', 'Lowe', 'Amazon', 'Grainger', 'SupplyHouse',
      'Zoro', 'Ace Hardware', 'Acme Tools', 'Walmart'
    ];

    const dealWords = 'clearance sale discount deal markdown closeout overstock';

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q + ' ' + dealWords + ' electrical tools construction')}&gl=us&hl=en&location=Massachusetts,United States&api_key=${process.env.SERPAPI_API_KEY}`
    );

    const data = await response.json();
    const results = data.shopping_results || [];

    const clean = results
      .filter(item => trustedStores.some(store =>
        (item.source || '').toLowerCase().includes(store.toLowerCase())
      ))
      .map(item => {
        const current = item.extracted_price || 0;
        const old = item.extracted_old_price || item.extracted_original_price || 0;
        const discount = old && current ? Math.round(((old - current) / old) * 100) : 0;

        let score = 'Watch';
        if (discount >= 25) score = 'Buy';
        if (discount >= 35) score = 'Strong Buy';
        if (discount >= 45) score = 'Surreal Deal';

        return {
          title: item.title,
          store: item.source,
          price: item.price,
          old_price: item.old_price || item.original_price || '',
          discount,
          score,
          link: item.link || item.product_link,
          thumbnail: item.thumbnail
        };
      })
      .filter(item => item.discount >= 25)
      .sort((a, b) => b.discount - a.discount);

    res.status(200).json({ deals: clean });
  } catch (error) {
    res.status(500).json({ error: 'Deal search failed' });
  }
}
