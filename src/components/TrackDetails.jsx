import React from "react";
import styled from "styled-components";
import { floor } from "mathjs";

function TrackDetails({ track }) {
  console.log(track);
  const timeConversion = (timestamp) => {
    let initial = floor(timestamp / 1000);
    let minute = 0;
    let second = 0;
    while (initial > 59) {
      minute += 1;
      initial -= 60;
      second = initial;
    }
    return `${minute}:${second}`;
  };

  const artistNames = (list) => {
    let text = list[0].name;
    if (list.length !== 1) {
      for (let i = 1; i < list.length; i++) {
        text += ", " + list[i].name;
      }
    }
    return text;
  };

  return (
    <ItemsContainer>
      <span>
        <div>{track.name}</div>
        <div>{artistNames(track.artists)}</div>
      </span>
      <span style={{ overflow: "hidden" }}>{track.album.name}</span>
      <span>{track.album.release_date}</span>
      <span>
        {timeConversion(track.duration_ms)}
        {console.log(track.duration_ms)}
      </span>
    </ItemsContainer>
  );
}

const ItemsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  text-wrap: nowrap;
  overflow: hidden;
  border-top: 1px solid lightgrey;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  span {
    font-size: small;
  }
`;

export default TrackDetails;
