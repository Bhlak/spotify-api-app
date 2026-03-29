import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = ({ setToken }) => {
  const navigate = useNavigate();
  const clientId = "b6b2cb66d57a4e089a6073ce0993e360";
  const redirectUri = "http://127.0.0.1:5173/callback";

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        navigate("/");
        return;
      }

      const codeVerifier = sessionStorage.getItem("code_verifier");
      const url = "https://accounts.spotify.com/api/token";
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      };

      const response = await fetch(url, payload);
      const data = await response.json();

      if (data.access_token) {
        sessionStorage.setItem("token", data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("refresh_token", data.refresh_token);
        }
        setToken(data.access_token);
        navigate("/");
        // window.location.hash = "";
      } else {
        console.error("Failed to retrieve access token:", data);
        navigate("/");
      }
    };
    getToken();
  }, [navigate, setToken, clientId, redirectUri]);

  return <div>Loading...</div>;
};

export default Callback;
