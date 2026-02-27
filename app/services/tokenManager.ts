type TokenGetter = () => Promise<string>;

let _getAccessTokenSilently: TokenGetter | null = null;

export function setTokenGetter(fn: TokenGetter) {
  _getAccessTokenSilently = fn;
}

export async function getToken(): Promise<string> {
  if (_getAccessTokenSilently) {
    try {
      const token = await _getAccessTokenSilently();
      sessionStorage.setItem("appSession", token);
      return token;
    } catch {
      // Fall back to cached token if silent refresh fails
    }
  }
  return sessionStorage.getItem("appSession") || "";
}
