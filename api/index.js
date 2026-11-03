export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  let path = url.pathname;
  let search = url.search;

  // 去掉开头的 /api
  if (path.startsWith('/api')) {
    path = path.slice(4);
  }

  // 代理谷歌瓦片
  if (path.startsWith('/vt') || path.startsWith('/maps/') || path === '/') {
    const targetUrl = 'https://mt1.google.com' + (path === '/' ? '/vt' : path) + search;
    
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://maps.google.com/'
        }
      });
      
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } catch (err) {
      return new Response('Proxy Error', { status: 500 });
    }
  }

  return new Response('OK - Google Map Proxy for Ovi', {
    headers: { 'Content-Type': 'text/plain' }
  });
}
