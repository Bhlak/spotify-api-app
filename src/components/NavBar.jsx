import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RiPlayListFill } from "react-icons/ri";
import { IoIosAlbums } from "react-icons/io";
import { IoHome, IoMenu, IoClose } from "react-icons/io5";
import styled from "styled-components";
import { theme } from "../styles/theme";

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  let token = "";
  const navigate = useNavigate();

  const logOut = () => {
    sessionStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  if (sessionStorage.getItem("token")) {
    token = sessionStorage.getItem("token");
  }

  if (!token) {
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  return (
    <NavContainer>
      <NavContent>
        <LogoSection>
          <SpotifyLogo>♪</SpotifyLogo>
          <BrandText>My Spotify</BrandText>
        </LogoSection>

        <DesktopNav>
          <NavItem>
            <NavIconLink to="/home" onClick={closeMobileMenu}>
              <IoHome />
              <NavLabel>Home</NavLabel>
            </NavIconLink>
          </NavItem>
          <NavItem>
            <NavIconLink to="/playlists" onClick={closeMobileMenu}>
              <RiPlayListFill />
              <NavLabel>Playlists</NavLabel>
            </NavIconLink>
          </NavItem>
        </DesktopNav>

        <RightSection>
          <LogOutButton onClick={logOut}>Sign Out</LogOutButton>
          <MobileMenuButton onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <IoClose /> : <IoMenu />}
          </MobileMenuButton>
        </RightSection>
      </NavContent>

      <MobileNav isOpen={mobileMenuOpen}>
        <MobileNavItem>
          <NavIconLink to="/home" onClick={closeMobileMenu}>
            <IoHome />
            <NavLabel>Home</NavLabel>
          </NavIconLink>
        </MobileNavItem>
        <MobileNavItem>
          <NavIconLink to="/playlists" onClick={closeMobileMenu}>
            <RiPlayListFill />
            <NavLabel>Playlists</NavLabel>
          </NavIconLink>
        </MobileNavItem>
        <MobileLogOutButton onClick={logOut}>Logout</MobileLogOutButton>
      </MobileNav>
    </NavContainer>
  );
}

const NavContainer = styled.nav`
  ${theme.glassmorphism.medium};
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid ${theme.colors.glassBorder};
  box-shadow: ${theme.shadows.md};
`;

const NavContent = styled.div`
  // max-width: 1440px;
  width: 100%;
  margin: 0;

  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  min-width: fit-content;
`;

const SpotifyLogo = styled.div`
  font-size: ${theme.typography.sizes["3xl"]};
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.bold};
  text-shadow: 0 0 20px rgba(29, 185, 84, 0.4);
`;

const BrandText = styled.h1`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  flex: 1;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
`;

const NavIconLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  color: ${theme.colors.textSecondary};
  transition: all ${theme.transitions.fast};
  cursor: pointer;

  svg {
    font-size: ${theme.typography.sizes.xl};
    transition: all ${theme.transitions.fast};
  }

  &:hover {
    color: ${theme.colors.primary};
    background-color: rgba(29, 185, 84, 0.1);
    svg {
      transform: scale(1.1);
    }
  }

  &.active {
    color: ${theme.colors.primary};
    background: ${theme.glassmorphism.light};
    box-shadow: 0 0 10px rgba(29, 185, 84, 0.2);
  }
`;

const NavLabel = styled.span`
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  min-width: fit-content;
`;

const LogOutButton = styled.button`
  ${theme.glassmorphism.light};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.primaryLight} 100%
  );
  color: ${theme.colors.background};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: ${theme.typography.sizes.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg}, ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.xl};
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileNav = styled.div`
  display: none;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.glassBorder};
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
  }
`;

const MobileNavItem = styled.div`
  width: 100%;
`;

const MobileLogOutButton = styled(LogOutButton)`
  display: block;
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

export default NavBar;
