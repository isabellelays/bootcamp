export async function loader({params}) {
  const path = params['*'];
  const url = `http://127.0.0.1/pub/media/${path}`;

  const response = await fetch(url, {
    headers: {Host: 'magento2.docker'},
  });

  if (!response.ok) {
    return new Response('Not found', {status: 404});
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
