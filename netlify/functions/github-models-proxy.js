const GITHUB_MODELS_ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const token = process.env.GITHUB_MODELS_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing GITHUB_MODELS_TOKEN environment variable' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  const upstreamResponse = await fetch(GITHUB_MODELS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'api-key': token
    },
    body: JSON.stringify(payload)
  });

  const responseText = await upstreamResponse.text();

  return {
    statusCode: upstreamResponse.status,
    headers: {
      'Content-Type': upstreamResponse.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: responseText
  };
};
