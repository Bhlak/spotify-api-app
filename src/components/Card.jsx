import React from "react";
import styled from "styled-components";
import Logo from "../images/index.jpg";
import { Link } from "react-router-dom";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function Card({ playlist }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowCard playlist={playlist} />
    </QueryClientProvider>
  );
}
const getImage = async (playlist) => {
  let image = playlist.images[0].url;
  return image;
};

const ShowCard = ({ playlist }) => {
  const { isLoading, error, data, isError } = useQuery(
    ["image", playlist],
    () => getImage(playlist)
  );

  if (isLoading) {
    return (
      <CardContainer>
        <ImageContainer>
          <SImage src={Logo} alt={playlist.name} />
          <p>{playlist.name}</p>
        </ImageContainer>
      </CardContainer>
    );
  }
  if (isError) {
    return <span>{console.log(error)}</span>;
  }

  return (
    <Link to={`/playlists/${playlist.id}`}>
      <CardContainer>
        <ImageContainer>
          <SImage src={data} alt={playlist.name} />
          <p>{playlist.name}</p>
        </ImageContainer>
      </CardContainer>
    </Link>
  );
};

const CardContainer = styled.span`
  box-shadow: 1px 1px lightgrey;
  border-radius: 2rem;
  box-sizing: content-box;
  background-color: #000000;
`;
const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  p {
    z-index: 10;
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translate(-50%, 0%);
    background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3));
    border-radius: 0.4rem;
    padding: 0 3px;
    color: white;
    margin-top: 1em;
  }
`;
const SImage = styled.img`
  z-index: 8;
  width: 100%;
  border-radius: inherit;
  object-fit: contain;
`;

export default Card;
