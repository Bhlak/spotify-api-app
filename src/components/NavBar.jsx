import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RiPlayListFill } from "react-icons/ri";
import { IoIosAlbums } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import styled from "styled-components";

function NavBar() {
  let token = "";
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  if (token) {
    return (
      <Nav>
        <NavItems>
          <SLink to={"/"}>
            <IoHome />
          </SLink>
          <h4>Home</h4>
        </NavItems>
        <NavItems>
          <SLink to={"/playlists"}>
            <RiPlayListFill />
          </SLink>
          <h4>Playlists</h4>
        </NavItems>
        <NavItems>
          <SLink to={"/albums"}>
            <IoIosAlbums />
          </SLink>
          <h4>Albums</h4>
        </NavItems>
        {token ? (
          <SButton onClick={logOut}>Log Out</SButton>
        ) : (
          <LogLink to={"/login"}>Log In</LogLink>
        )}
      </Nav>
    );
  } else {
    return null;
  }
}

const Nav = styled.div`
  margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h4 {
    text-align: center;
  }
`;

const LogLink = styled(NavLink)`
  width: 10%;
  height: 3em;
  border-radius: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: none;
  box-shadow: 1px 1px lightgrey;
  color: whitesmoke;
  background-image: linear-gradient(to bottom right, #25e465 15%, #1ed760 100%);
  cursor: pointer;
`;

const SLink = styled(NavLink)`
  border: 1px solid lightgrey;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 1rem;
  background-color: black;
  color: #1ed760;
  transition: all 0.3s ease;
  svg {
    color: inherit;
  }
  &:hover {
    color: whitesmoke;
  }
`;

const SButton = styled.button`
  width: 10%;
  height: 3em;
  border-radius: 2em;
  border: none;
  box-shadow: 1px 1px lightgrey;
  color: whitesmoke;
  background-image: linear-gradient(to bottom right, #25e465 15%, #1ed760 100%);
  cursor: pointer;
`;

export default NavBar;
