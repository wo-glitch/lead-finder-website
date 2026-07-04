const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const place = location.trim();
  const noWebsiteQuery = `${industry} in ${place} without website`.trim();
  const webQuery = encodeURIComponent(noWebsiteQuery);

  return [
    { name: 'Google Search', url: `https://www.google.com/search?q=${webQuery}` }
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
  summary.textContent = `Opening a direct search for ${searchQuery} so you can browse places that may not have a website.`;

  results.innerHTML = links.map((item) => `
    <div class="result">
      <strong>${item.name}</strong>
      <div>Search for restaurants in ${location} that appear to have no website.</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open ${item.name}</a>
    </div>
  `).join('');
});
