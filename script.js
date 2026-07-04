const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const place = location.trim();
  const searchQuery = `${industry} in ${place}`.trim();
  const mapsQuery = encodeURIComponent(searchQuery);
  const webQueries = [
    `${searchQuery} no website`,
    `${searchQuery} without website`,
    `${searchQuery} website missing`
  ];

  return [
    ...webQueries.map((query, index) => ({
      name: `Google Search ${index + 1}`,
      description: `Try a targeted web search for ${searchQuery} using wording that hints at missing websites.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
    })),
    {
      name: 'Google Maps',
      description: `Open map listings for ${searchQuery} so you can inspect local restaurants visually.`,
      url: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
    },
    {
      name: 'Apple Maps',
      description: `Open Apple Maps listings for ${searchQuery} so you can inspect local restaurants visually.`,
      url: `https://maps.apple.com/?q=${encodeURIComponent(searchQuery)}`
    }
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
  const searchQuery = `${industry} in ${location}`.trim();
  summary.textContent = `Opening a lead-search pack for ${searchQuery} across the web and maps to help you find restaurants that may not have a website.`;

  results.innerHTML = links.map((item) => `
    <div class="result">
      <strong>${item.name}</strong>
      <div>${item.description}</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open ${item.name}</a>
    </div>
  `).join('');
});
