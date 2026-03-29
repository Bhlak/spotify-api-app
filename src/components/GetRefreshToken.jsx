const clientId = "b6b2cb66d57a4e089a6073ce0993e360";

export const getRefreshToken = async () => {
  const refreshToken = sessionStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.error("No refresh token found.");
    return false;
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };

  try {
    const response = await fetch(url, payload);
    const data = await response.json();

    if (data.access_token) {
      sessionStorage.setItem("token", data.access_token);
      if (data.refesh_token) {
        sessionStorage.setItem("refresh_token", data.refresh_token);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token refresh failed: ", error);
    return false;
  }
};
