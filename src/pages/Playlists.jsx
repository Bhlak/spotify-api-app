import React from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import Card from "../components/Card";
import styled from "styled-components";

const queryClient = new QueryClient();

function Playlists() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowPlaylists />
    </QueryClientProvider>
  );
}

const ShowPlaylists = () => {
  const { isLoading, isError, data, error } = useQuery(
    "playlists",
    getPlaylists
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <Grid>
        {data.map((playlist) => {
          return <Card key={playlist.id} playlist={playlist} />;
        })}
      </Grid>
    </div>
  );
};

const getPlaylists = async () => {
  let token = localStorage.getItem("token");
  const rawData = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await rawData.json();
  return data.items;
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 3rem;
`;

export default Playlists;
