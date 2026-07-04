const form = document.getElementById('lead-form');
const queryInput = document.getElementById('query');
const locationInput = document.getElementById('location');
const radiusInput = document.getElementById('radius');
const apiKeyInput = document.getElementById('api-key');
const noWebsiteOnlyInput = document.getElementById('no-website-only');
const summary = document.getElementById('summary');
const results = document.getElementById('results');

function renderResults(leads) {
  if (!leads.length) {
    results.innerHTML = '<div class="result">No matching businesses found.</div>';
    return;
  }

  results.innerHTML = leads.map((lead) => `
    <div class="result">
      <strong>${lead.name}</strong>
      <div>Phone: ${lead.phone}</div>
      <div>Address: ${lead.address}</div>
      <div>Website: ${lead.website ? lead.website : '<span class="missing">❌ missing</span>'}</div>
    </div>
  `).join('');
}

async function searchBusinesses(query, location, radius, noWebsiteOnly, apiKey) {
  if (!apiKey) {
    return [
      {
        name: 'Example lead',
        phone: '—',
        address: 'Example address',
        website: ''
      }
    ];
  }

  const url = SearchUtils.buildPlacesUrl({ query, apiKey, location, radius });
  const response = await fetch(url);
  const data = await response.json();
  const enriched = await SearchUtils.enrichBusinesses(data.results || [], apiKey);
  return SearchUtils.filterBusinesses(enriched, noWebsiteOnly);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = queryInput.value.trim();
  const location = locationInput.value.trim();
  const radius = radiusInput.value.trim();
  const apiKey = apiKeyInput.value.trim();
  const noWebsiteOnly = noWebsiteOnlyInput.checked;

  if (!query) {
    summary.textContent = 'Please enter a search query.';
    results.innerHTML = '';
    return;
  }

  summary.textContent = 'Searching businesses...';
  results.innerHTML = '';

  const leads = await searchBusinesses(query, location, radius, noWebsiteOnly, apiKey);
  renderResults(leads);
  summary.textContent = noWebsiteOnly
    ? `Showing ${leads.length} business lead${leads.length === 1 ? '' : 's'} with no website.`
    : `Showing ${leads.length} business lead${leads.length === 1 ? '' : 's'}.`;
});
