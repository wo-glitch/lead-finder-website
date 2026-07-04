(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.SearchUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalizeQuery(value) {
    return String(value || '').trim();
  }

  function filterBusinesses(businesses, noWebsiteOnly) {
    if (!noWebsiteOnly) {
      return businesses;
    }

    return businesses.filter((business) => !business.website);
  }

  function buildPlacesUrl({ query, apiKey, location, radius }) {
    const normalizedQuery = normalizeQuery(query);
    const endpoint = location ? 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' : 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const url = new URL(endpoint);

    if (location) {
      url.searchParams.set('location', location);
      url.searchParams.set('radius', radius || '10000');
      url.searchParams.set('keyword', normalizedQuery);
    } else {
      url.searchParams.set('query', normalizedQuery);
    }

    url.searchParams.set('key', apiKey);
    return url.toString();
  }

  function buildPlaceDetailsUrl({ placeId, apiKey }) {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'name,formatted_phone_number,formatted_address,website');
    url.searchParams.set('key', apiKey);
    return url.toString();
  }

  async function enrichBusinesses(results, apiKey) {
    const items = results || [];
    const enriched = await Promise.all(items.map(async (item) => {
      const placeId = item.place_id;
      if (!placeId) {
        return {
          name: item.name || 'Unknown business',
          phone: item.formatted_phone_number || '—',
          address: item.formatted_address || '—',
          website: item.website || ''
        };
      }

      const detailUrl = buildPlaceDetailsUrl({ placeId, apiKey });
      const response = await fetch(detailUrl);
      const detailData = await response.json();
      const details = detailData.result || {};

      return {
        name: details.name || item.name || 'Unknown business',
        phone: details.formatted_phone_number || item.formatted_phone_number || '—',
        address: details.formatted_address || item.formatted_address || '—',
        website: details.website || item.website || ''
      };
    }));

    return enriched;
  }

  return {
    normalizeQuery,
    filterBusinesses,
    buildPlacesUrl,
    enrichBusinesses
  };
});
