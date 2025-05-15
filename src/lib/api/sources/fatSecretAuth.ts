let tokenCache: { token: string; expires: number } | null = null;

export async function getFatSecretToken() {
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache.token;
  }

  const clientId = process.env.FATSECRET_CLIENT_ID!;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=basic",
  });

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.token;
}
