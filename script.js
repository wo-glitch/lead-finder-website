const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const place = location.trim();
  const query = `${industry} ${place}`.trim();
  const encoded = encodeURIComponent(query);
  const appleQuery = encodeURIComponent(`${industry} ${place}`);

  return [
    { name: 'Apple Maps', url: `https://maps.apple.com/?q=${appleQuery}` },
    { name: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(industry)}&find_loc=${encodeURIComponent(place)}` },
    { name: 'Google', url: `https://www.google.com/search?q=${encoded}` },
    { name: 'Bing', url: `https://www.bing.com/search?q=${encoded}` },
    { name: 'DuckDuckGo', url: `https://duckduckgo.com/?q=${encoded}` }
  ];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const industry = industryInput.value.trim();
  const location = locationInput.value.trim();

  if (!location) {
    summary.textContent = 'Please enter a location.';
    results.innerHTML = '';
    return;
  }

  const links = buildSearchLinks(industry, location);
  summary.textContent = `Looking for restaurants in ${location} that may not have a website yet.`;

  results.innerHTML = links.map((item) => `
    <div class="result">
      <strong>${item.name}</strong>
      <div>Open restaurant listings and maps for ${location}</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open ${item.name}</a>
    </div>
  `).join('');
});
