const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const query = `${industry} ${location}`.trim();
  const encoded = encodeURIComponent(query);
  const business = industry.trim();
  const place = location.trim();

  return [
    { name: 'Google', url: `https://www.google.com/search?q=${encoded}` },
    { name: 'Bing', url: `https://www.bing.com/search?q=${encoded}` },
    { name: 'DuckDuckGo', url: `https://duckduckgo.com/?q=${encoded}` },
    { name: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(business)}&find_loc=${encodeURIComponent(place)}` },
    { name: 'Yellow Pages', url: `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(business)}&geo_location_terms=${encodeURIComponent(place)}` }
  ];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const industry = industryInput.value.trim();
  const location = locationInput.value.trim();

  if (!industry || !location) {
    summary.textContent = 'Please enter both a business type and a location.';
    results.innerHTML = '';
    return;
  }

  const links = buildSearchLinks(industry, location);
  summary.textContent = `Searching for ${industry} in ${location} across public directories and search engines.`;

  results.innerHTML = links.map((item) => `
    <div class="result">
      <strong>${item.name}</strong>
      <div>Open public search results for ${industry} in ${location}</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open ${item.name}</a>
    </div>
  `).join('');
});
