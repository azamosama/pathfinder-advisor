const HIPOLABS_ENDPOINT = 'https://universities.hipolabs.com/search';

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const query = (event.queryStringParameters && event.queryStringParameters.name) || '';
  const trimmed = query.trim();

  if (trimmed.length < 3) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    };
  }

  const url = `${HIPOLABS_ENDPOINT}?country=United+States&name=${encodeURIComponent(trimmed)}`;

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return {
        statusCode: upstream.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Hipolabs request failed with status ${upstream.status}` })
      };
    }

    const payload = await upstream.text();
    return {
      statusCode: 200,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json' },
      body: payload
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'University lookup upstream failed' })
    };
  }
};
