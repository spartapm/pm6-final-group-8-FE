/**
 * OAuth / 서버 리다이렉트용 앱 origin.
 * `next dev -H 0.0.0.0` 으로 띄우면 origin이 0.0.0.0이 되어
 * 카카오 등 소셜 로그인 콜백이 깨지므로 localhost로 치환한다.
 */
export function normalizeAppOrigin(origin: string): string {
  try {
    const url = new URL(origin);
    if (url.hostname === '0.0.0.0' || url.hostname === '[::]') {
      url.hostname = 'localhost';
    }
    return url.origin;
  } catch {
    return origin.replace('://0.0.0.0', '://localhost').replace('://[::]', '://localhost');
  }
}

export function getClientAppOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;
  return normalizeAppOrigin(window.location.origin);
}

export function getRequestAppOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;

  const url = new URL(request.url);
  const hostHeader = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const protoHeader = request.headers.get('x-forwarded-proto');

  if (hostHeader) {
    const proto = protoHeader ?? url.protocol.replace(':', '');
    return normalizeAppOrigin(`${proto}://${hostHeader}`);
  }

  return normalizeAppOrigin(url.origin);
}
