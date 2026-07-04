from flask import Flask, render_template_string, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lead Finder</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f4f7fb; color: #1f2937; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    h1 { margin-top: 0; }
    form { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
    input, button { padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 16px; }
    input { flex: 1; min-width: 240px; }
    button { background: #2563eb; color: white; cursor: pointer; }
    .results { margin-top: 24px; display: grid; gap: 12px; }
    .result { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; }
    .muted { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Find businesses that need a website</h1>
      <p>Enter a niche such as dentists, salons, restaurants, or law firms to look for public leads.</p>
      <form method="post">
        <input name="query" placeholder="e.g. dentists in Miami" value="{{ query }}" required>
        <button type="submit">Search</button>
      </form>
      {% if error %}
        <p class="muted">{{ error }}</p>
      {% endif %}
      <div class="results">
        {% for item in results %}
          <div class="result">
            <strong>{{ item.name }}</strong><br>
            <span class="muted">{{ item.business }}</span><br>
            <a href="{{ item.url }}" target="_blank">Open site</a>
          </div>
        {% endfor %}
      </div>
    </div>
  </div>
</body>
</html>
"""


def fetch_leads(query):
    search_query = query.replace(' ', '+')
    url = f"https://www.bing.com/search?q={search_query}+business+website"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    results = []
    for a in soup.select('li.b_algo h2 a')[:5]:
        title = a.get_text(" ", strip=True)
        href = a.get('href', '')
        if href.startswith('http'):
            results.append({"name": title, "business": query, "url": href})
    if not results:
        results.append({"name": "No public results found", "business": "Try a broader search term", "url": "#"})
    return results


@app.route('/', methods=['GET', 'POST'])
def index():
    query = ''
    results = []
    error = ''
    if request.method == 'POST':
        query = request.form.get('query', '').strip()
        if not query:
            error = 'Please enter a search term.'
        else:
            try:
                results = fetch_leads(query)
            except Exception as exc:
                error = f'Lookup failed: {exc}'
    return render_template_string(HTML, query=query, results=results, error=error)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
