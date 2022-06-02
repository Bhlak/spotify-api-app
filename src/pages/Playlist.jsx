import React from "react";
import { useParams } from "react-router-dom";
import { QueryClientProvider, useQuery, QueryClient } from "react-query";
import PlaylistDetails from "../components/PlaylistDetails";

const queryClient = new QueryClient();

function Playlist() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowDetails />
    </QueryClientProvider>
  );
}

const ShowDetails = () => {
  let params = useParams();

  const { isError, isLoading, error, data } = useQuery(
    ["details", params],
    () => getDetails(params)
  );

  if (isLoading) {
    return <span>Loading details...</span>;
  }
  if (isError) {
    return <span>{console.log(error.message, error)}</span>;
  }

  return <PlaylistDetails tracks={data.items} />;
};

const getDetails = async (params) => {
  let token = localStorage.getItem("token");
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${params.id}/tracks`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

export default Playlist;
