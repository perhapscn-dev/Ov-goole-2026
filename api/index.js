export default async function handler(req, res) {
  try {
    // 构造目标 Google 地图的 URL（可根据需要替换为 maps.google.com 或 mt0.google.com 等瓦片域名）
    const targetUrl = new URL(req.url, 'https://www.google.com');
    
    // 转发客户端的请求头，并伪装 Host
    const headers = new Headers(req.headers);
    headers.set('Host', 'www.google.com');

    // 向 Google 发起请求
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      redirect: 'follow'
    });

    // 将 Google 的响应头回传给客户端
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);
    
    // 获取响应内容并返回
    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
