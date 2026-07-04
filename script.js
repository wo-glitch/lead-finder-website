const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const place = location.trim();
  const searchQuery = `${industry} in ${place}`.trim();
  const webQuery = `${industry} in ${place} no website`.trim();
  const mapsQuery = encodeURIComponent(searchQuery);
  const webQueryEncoded = encodeURIComponent(webQuery);

  return [
    {
      name: 'Google Search',
      description: 'Search the web for restaurants in this location that may not have a website.',
      url: `https://www.google.com/search?q=${webQueryEncoded}`
    },
    {
      name: 'Google Maps',
      description: 'Open map listings for restaurants in this location.',
      url: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
    },
    {
      name: 'Apple Maps',
      description: 'Open Apple Maps listings for restaurants in this location.',
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
  summary.textContent = `Opening web and map searches for ${searchQuery} anywhere in the world to help you find restaurants that may not have a website.`;

  results.innerHTML = links.map((item) => `
    <div class="result">
      <strong>${item.name}</strong>
      <div>${item.description}</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open ${item.name}</a>
    </div>
  `).join('');
});
