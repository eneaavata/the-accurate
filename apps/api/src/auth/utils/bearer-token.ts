export function extractBearerToken(req: any): string | null {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();

  if (!token) {
    return null;
  }

  if (
    token.toLocaleLowerCase() === 'null' ||
    token.toLocaleLowerCase() === 'undefined'
  ) {
    return null;
  }

  return token;
}
