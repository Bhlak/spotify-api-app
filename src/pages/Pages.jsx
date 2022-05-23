import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Playlists from "./Playlists";
import Login from "./Login";
import NavBar from "../components/NavBar";
import Home from "./Home";
import Playlist from "./Playlist";
import styled from "styled-components";

function Pages() {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  return (
    <>
      <NavBar />
      <Wrapper>
        <Routes>
          <Route path={"/login"} element={<Login />} />
          <Route path={"/playlists"} element={<Playlists />} />
          <Route path={"/playlists/:track"} element={<Playlist />} />
          <Route
            path={"/"}
            element={token ? <Home token={token} /> : <Login />}
          />
        </Routes>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  margin: 2rem 5rem;
`;

export default Pages;
