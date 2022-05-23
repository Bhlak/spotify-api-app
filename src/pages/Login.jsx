import React, { useEffect } from "react";
import styled from "styled-components";

function Login() {
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      localStorage.setItem("token", token);
    }
  }, []);

  const CLIENT_ID = `b6b2cb66d57a4e089a6073ce0993e360`;
  const REDIRECT_URI = "http://localhost:3000";
  const SCOPE = "playlist-read-collaborative";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  return (
    <Container>
      <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
      >
        <LoginButton>Login to Spotify</LoginButton>
      </a>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LoginButton = styled.button`
  padding: 0.6rem 3rem;
  border-radius: 0.7rem;
  border: none;
  color: #ffffff;
  background-color: #1ed760;
  cursor: pointer;
`;

export default Login;
