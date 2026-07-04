const form = document.getElementById('lead-form');
const industryInput = document.getElementById('industry');
const locationInput = document.getElementById('location');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function buildSearchLinks(industry, location) {
  const place = location.trim();
  const phrases = [
    `${industry} in ${place} no website`,
    `${industry} in ${place} without website`,
    `${industry} in ${place} website missing`
  ];

  return phrases.map((phrase) => ({
    name: 'Google Search',
    url: `https://www.google.com/search?q=${encodeURIComponent(phrase)}`
  }));
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
  summary.textContent = `Opening targeted searches for ${searchQuery} to help you find restaurants that may not have a website.`;

  results.innerHTML = links.map((item, index) => `
    <div class="result">
      <strong>${item.name} ${index + 1}</strong>
      <div>Try a targeted search for restaurants in ${location} that may be missing a website.</div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open search ${index + 1}</a>
    </div>
  `).join('');
});
