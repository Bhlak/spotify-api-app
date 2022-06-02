import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import TrackDetails from "./TrackDetails";

function PlaylistDetails({ tracks }) {
  const location = useLocation();
  const { playlist, image } = location.state;
  // let track = tracks[86].track;
  // console.log(track);

  return (
    <>
      <DescriptionContainer>
        <img src={image} alt="" />
        <h4> {playlist.name}</h4>
        <ul>
          <li>Made By {playlist.owner.display_name}</li>
          <li>{playlist.description}</li>
        </ul>
      </DescriptionContainer>
      <PlaylistItems>
        {tracks.map((track) => {
          return <TrackDetails track={track.track} />;
        })}
      </PlaylistItems>
    </>
  );
}

const DescriptionContainer = styled.div`
  width: 30%;
  height: fit-content;
  box-sizing: border-box;
  padding: 1rem 2rem;
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
  min-height: 100vh;
  border: 0.5px solid #25e465;
  padding: 1rem 0;
  box-sizing: border-box;
`;

export default PlaylistDetails;
