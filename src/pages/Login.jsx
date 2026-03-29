import React, { useEffect } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";

function Login() {
  const clientId = `b6b2cb66d57a4e089a6073ce0993e360`;
  const redirectUri = "http://127.0.0.1:5173/callback";
  const scope = "playlist-read-collaborative";

  const handleLogin = async () => {
    const generateRandomString = (length) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };

    const codeVerifier = generateRandomString(64);

    const sha256 = async (plain) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return hash;
    };

    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//, "_");
    };

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    sessionStorage.setItem("code_verifier", codeVerifier);

    const authUri = new URL("https://accounts.spotify.com/authorize");

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUri.search = new URLSearchParams(params).toString();
    window.location.href = authUri.toString();
  };

  return (
    <Container>
      <LoginButton onClick={handleLogin}>Login to Spotify</LoginButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.background} 0%,
    #0a1428 100%
  );
  overflow: hidden;
  position: relative;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(29, 185, 84, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(29, 185, 84, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
`;

const LoginCard = styled.div`
  position: relative;
  z-index: 10;
  ${(props) => props.theme.glassmorphism.medium};
  border-radius: ${(props) => props.theme.borderRadius["2xl"]};
  padding: ${(props) => props.theme.spacing["3xl"]};
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.colors.glassBorder};
  box-shadow:
    ${(props) => props.theme.shadows.lg},
    0 0 40px rgba(29, 185, 84, 0.1);
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 90%;
    padding: ${(props) => props.theme.spacing["2xl"]};
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing["2xl"]};
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SpotifyLogo = styled.div`
  font-size: 3.5rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const HeaderContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const MainTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.sizes["4xl"]};
  font-weight: ${(props) => props.theme.typography.weights.bold};
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.primaryLight} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.typography.sizes.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: ${(props) => props.theme.typography.weights.medium};
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  margin: ${(props) => props.theme.spacing.lg} 0;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: rgba(29, 185, 84, 0.08);
  border: 1px solid rgba(29, 185, 84, 0.1);
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    background: rgba(29, 185, 84, 0.12);
    border-color: rgba(29, 185, 84, 0.2);
    transform: translateX(4px);
  }
`;

const FeatureIcon = styled.span`
  font-size: ${(props) => props.theme.typography.sizes["2xl"]};
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-size: ${(props) => props.theme.typography.sizes.base};
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.weights.medium};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.lg}
    ${(props) => props.theme.spacing["2xl"]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: none;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.primaryLight} 100%
  );
  color: ${(props) => props.theme.colors.background};
  font-size: ${(props) => props.theme.typography.sizes.base};
  font-weight: ${(props) => props.theme.typography.weights.bold};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.base};
  box-shadow: ${(props) => props.theme.shadows.md};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      ${(props) => props.theme.shadows.lg},
      ${(props) => props.theme.shadows.glow};
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: ${(props) => props.theme.spacing.md}
      ${(props) => props.theme.spacing.lg};
  }
`;

const ButtonText = styled.span`
  display: flex;
  align-items: center;
`;

const ButtonArrow = styled.span`
  font-size: ${(props) => props.theme.typography.sizes.lg};
  transition: transform ${(props) => props.theme.transitions.fast};

  ${LoginButton}:hover & {
    transform: translateX(4px);
  }
`;

const PrivacyText = styled.p`
  text-align: center;
  font-size: ${(props) => props.theme.typography.sizes.xs};
  color: ${(props) => props.theme.colors.textTertiary};
  margin: 0;
`;

const DecorationCircle1 = styled.div`
  position: absolute;
  top: -100px;
  right: -100px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 185, 84, 0.1), transparent);
  filter: blur(40px);
  pointer-events: none;
`;

const DecorationCircle2 = styled.div`
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 185, 84, 0.08), transparent);
  filter: blur(40px);
  pointer-events: none;
`;

export default Login;
