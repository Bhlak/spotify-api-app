import { getRefreshToken } from "./GetRefreshToken";

export const spotifyFetch = async (url, options = {}) => {
  let token = sessionStorage.getItem("token");

  const defaultOptions = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...options,
  };

  let response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    const refreshed = await getRefreshToken();

    if (refreshed) {
      token = sessionStorage.getItem("token");
      defaultOptions.headers.Authorization = `Bearer ${token}`;
      response = await fetch(url, defaultOptions);
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refresh_token");
      window.location.href = "/";
    }
  }
  return response;
};
