import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

function PlaylistDetails() {
  const location = useLocation();
  const { playlist, image } = location.state;
  console.log(playlist);
  return (
    <DetailsWrapper>
      <DetailsContainer>
        <img src={image} alt="" />
        <h4> {playlist.name}</h4>
        <ul>
          <li>Made By {playlist.owner.display_name}</li>
          <li>{playlist.description}</li>
        </ul>
      </DetailsContainer>
      <PlaylistItems>Second</PlaylistItems>
    </DetailsWrapper>
  );
}

const DetailsWrapper = styled.div`
  width: 100%;
  height: 100vh;
  box-shadow: 0.1px 0.1px 1px #25e465, 0.1px 0.1px 1px #25e465;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
`;
const DetailsContainer = styled.div`
  width: 30%;
  height: 100%;
  box-sizing: border-box;
  padding: 2rem;
  border: 0.5px solid #25e465;
  font-family: "Signika Negative", sans-serif;
  img {
    width: 100%;
    object-fit: contain;
  }
  ul {
    list-style: none;
    padding: 0;
    font-size: 1.1em;
  }
  li {
    margin-top: 0.5em;
  }
  h4 {
    margin-top: 0.7rem;
    font-size: x-large;
  }
`;

const PlaylistItems = styled.div`
  height: 100%;
  flex-grow: 1;
  border: 0.5px solid #25e465;
`;

export default PlaylistDetails;
