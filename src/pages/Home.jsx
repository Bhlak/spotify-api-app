import React from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Card from "../components/Card";
import styled from "styled-components";

const queryClient = new QueryClient();

function Home({ token }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowPlaylists />
    </QueryClientProvider>
  );
}
const ShowPlaylists = () => {
  const { isError, error, isLoading, data } = useQuery(
    "slideplaylist",
    getPlaylists
  );
  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{console.log(error)}</span>;
  }
  return (
    <Splide
      aria-label="Playlists"
      options={{ perPage: 4, drag: "free", gap: "2rem" }}
    >
      {data.map((playlist) => {
        return (
          <SplideSlide key={playlist.id}>
            <Card playlist={playlist} />
          </SplideSlide>
        );
      })}
    </Splide>
  );
};
const getPlaylists = async () => {
  let token = localStorage.getItem("token");
  const rawData = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=10",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await rawData.json();
  return data.items;
};

export default Home;
