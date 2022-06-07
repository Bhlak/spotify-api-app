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
      <span>{track.album.name}</span>
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
  grid-template-columns: 2fr 2fr 1fr 1fr;
  align-items: center;
  border-top: 1px solid lightgrey;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  span {
    padding: 1em;
    font-size: small;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    div {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export default TrackDetails;
