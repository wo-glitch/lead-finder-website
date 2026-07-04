const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const place = location.trim();
  const searchQuery = `${industry} in ${place}`.trim();
  const mapsQuery = encodeURIComponent(searchQuery);
  const appleQuery = encodeURIComponent(searchQuery);
  const googleMapsQuery = encodeURIComponent(searchQuery);

  return [
    { name: 'Apple Maps', url: `https://maps.apple.com/?q=${appleQuery}` },
    { name: 'Google Maps', url: `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}` },
    { name: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(industry)}&find_loc=${encodeURIComponent(place)}` }
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
  summary.textContent = `Opening map searches for ${searchQuery} so you can browse restaurants that may need a website.`;

  results.innerHTML = links.map((item) => `
    <div class="result">
      <strong>${item.name}</strong>
      <div>Open map listings for restaurants in ${location}</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open ${item.name}</a>
    </div>
  `).join('');
});
