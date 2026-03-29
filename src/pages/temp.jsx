import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Card from "../components/Card";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const queryClient = new QueryClient();

function Home({ token }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContainer>
        <ShowAnalytics />
        <ShowPlaylists />
      </HomeContainer>
    </QueryClientProvider>
  );
}

const ShowAnalytics = () => {
  const { isError, error, isLoading, data } = useQuery(
    "playlistAnalytics",
    getPlaylistsForAnalytics
  );

  if (isLoading) {
    return <AnalyticsSkeletonLoader />;
  }

  if (isError) {
    return null;
  }

  const stats = calculateStats(data);

  return (
    <AnalyticsSection>
      <SectionTitle>Your Music Insights</SectionTitle>
      
      <StatsGrid>
        <StatCard>
          <StatLabel>Total Playlists</StatLabel>
          <StatValue>{stats.totalPlaylists}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Tracks</StatLabel>
          <StatValue>{stats.totalTracks}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Avg Playlist Size</StatLabel>
          <StatValue>{stats.avgPlaylistSize}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Hours of Music</StatLabel>
          <StatValue>{stats.totalHours}h</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartTitle>Playlist Sizes</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.playlistChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.glassBorder} />
            <XAxis dataKey="name" stroke={theme.colors.textSecondary} />
            <YAxis stroke={theme.colors.textSecondary} />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.colors.surfaceMedium,
                border: `1px solid ${theme.colors.primary}`,
                borderRadius: '8px'
              }}
              cursor={{ fill: 'rgba(29, 185, 84, 0.1)' }}
            />
            <Bar dataKey="tracks" fill={theme.colors.primary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </AnalyticsSection>
  );
};

const ShowPlaylists = () => {
  const { isError, error, isLoading, data } = useQuery(
    "slideplaylist",
    getPlaylists
  );

  if (isLoading) {
    return <PlaylistSkeletonLoader />;
  }

  if (isError) {
    return null;
  }

  return (
    <PlaylistsSection>
      <SectionTitle>Featured Playlists</SectionTitle>
      <Splide
        aria-label="Playlists"
        options={{ perPage: 4, drag: "free", gap: "2rem", breakpoints: { 768: { perPage: 2 }, 480: { perPage: 1 } } }}
      >
        {data.map((playlist) => {
          return (
            <SplideSlide key={playlist.id}>
              <Card playlist={playlist} />
            </SplideSlide>
          );
        })}
      </Splide>
    </PlaylistsSection>
  );
};

const getPlaylists = async () => {
  let token = sessionStorage.getItem("token");
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

const getPlaylistsForAnalytics = async () => {
  let token = sessionStorage.getItem("token");
  const rawData = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=50",
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

const calculateStats = (playlists) => {
  const totalPlaylists = playlists.length;
  const totalTracks = playlists.reduce((sum, p) => sum + (p.tracks?.total || 0), 0);
  const avgPlaylistSize = Math.round(totalTracks / totalPlaylists);
  const totalMinutes = playlists.reduce((sum, p) => sum + (p.tracks?.total || 0) * 3.5, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const playlistChartData = playlists.slice(0, 5).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    tracks: p.tracks?.total || 0
  }));

  return {
    totalPlaylists,
    totalTracks,
    avgPlaylistSize,
    totalHours,
    playlistChartData
  };
};

const AnalyticsSkeletonLoader = () => (
  <AnalyticsSection>
    <SectionTitle>Your Music Insights</SectionTitle>
    <StatsGrid>
      {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
    </StatsGrid>
  </AnalyticsSection>
);

const PlaylistSkeletonLoader = () => (
  <PlaylistsSection>
    <SectionTitle>Featured Playlists</SectionTitle>
    <span>Loading playlists...</span>
  </PlaylistsSection>
);

// STYLED COMPONENTS
const HomeContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl} ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing["3xl"]};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.md};
    gap: ${(props) => props.theme.spacing["2xl"]};
  }
`;

const AnalyticsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`;

const PlaylistsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.sizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.weights.bold};
  color: ${(props) => props.theme.colors.text};
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.primaryLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  ${(props) => props.theme.glassmorphism.light};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  transition: all ${(props) => props.theme.transitions.base};

  &:hover {
    ${(props) => props.theme.glassmorphism.medium};
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.shadows.lg}, ${(props) => props.theme.shadows.glow};
  }
`;

const StatLabel = styled.span`
  font-size: ${(props) => props.theme.typography.sizes.sm};
  font-weight: ${(props) => props.theme.typography.weights.medium};
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: ${(props) => props.theme.typography.sizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.weights.bold};
  color: ${(props) => props.theme.colors.primary};
`;

const ChartContainer = styled.div`
  ${(props) => props.theme.glassmorphism.light};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  transition: all ${(props) => props.theme.transitions.base};

  &:hover {
    ${(props) => props.theme.glassmorphism.medium};
  }
`;

const ChartTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.sizes.xl};
  font-weight: ${(props) => props.theme.typography.weights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SkeletonCard = styled.div`
  ${(props) => props.theme.glassmorphism.light};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  height: 120px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default Home;





// Card
import React from "react";
import styled from "styled-components";
import Logo from "../images/index.jpg";
import { Link } from "react-router-dom";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { theme } from "../styles/theme";

const queryClient = new QueryClient();

function Card({ playlist }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowCard playlist={playlist} />
    </QueryClientProvider>
  );
}

const getImage = async (playlist) => {
  let image = playlist.images[0]?.url || Logo;
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
          <CardTitle>{playlist.name}</CardTitle>
        </ImageContainer>
      </CardContainer>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <StyledLink
      to={`/playlists/${playlist.id}`}
      state={{
        playlist: playlist,
        image: data,
      }}
    >
      <CardContainer>
        <ImageContainer>
          <SImage src={data} alt={playlist.name} />
          <CardOverlay>
            <CardTitle>{playlist.name}</CardTitle>
            <TrackCount>{playlist.tracks?.total || 0} tracks</TrackCount>
          </CardOverlay>
        </ImageContainer>
      </CardContainer>
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const CardContainer = styled.div`
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.surfaceLight};
  transition: all ${(props) => props.theme.transitions.base};
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.shadows.lg}, ${(props) => props.theme.shadows.glow};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  overflow: hidden;
  aspect-ratio: 1;
`;

const SImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${(props) => props.theme.transitions.base};

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(29, 185, 84, 0.2));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: ${(props) => props.theme.spacing.lg};
  opacity: 0;
  transition: opacity ${(props) => props.theme.transitions.base};

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const CardTitle = styled.p`
  text-align: center;
  color: white;
  font-weight: ${(props) => props.theme.typography.weights.semibold};
  font-size: ${(props) => props.theme.typography.sizes.base};
  margin: 0;
`;

const TrackCount = styled.span`
  font-size: ${(props) => props.theme.typography.sizes.xs};
  color: ${(props) => props.theme.colors.primaryLight};
  margin-top: ${(props) => props.theme.spacing.sm};
`;

export default Card;