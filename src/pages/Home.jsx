import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Card from "../components/Card";
import styled from "styled-components";
import { theme } from "../styles/theme";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { spotifyFetch } from "../components/APIWrapper";

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
  const [analyticsOffset, setAnalyticsOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("size");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [allLoadedPlaylists, setAllLoadedPlaylists] = useState([]);
  const [stats, setStats] = useState({
    totalPlaylists: 0,
    totalTracks: 0,
    avgPlaylistSize: 0,
    totalHours: 0,
    playlistChartData: [],
    totalPlaylistsInLibrary: 0,
    currentlyLoaded: 0,
  });

  const { isError, error, isLoading, data } = useQuery(
    ["playlistAnalytics", analyticsOffset],
    () => getPlaylistsForAnalytics(analyticsOffset),
  );

  useEffect(() => {
    if (data && data.items.length > 0) {
      console.log("new batch fetched:", {
        batchSize: data.items.length,
        offset: analyticsOffset,
        newPlaylists: data.items.map((p) => ({ id: p.id, name: p.name })),
        totalBefore: allLoadedPlaylists.length,
        totalAfter: allLoadedPlaylists.length + data.items.length,
        libraryTotal: data.total,
      });
      setAllLoadedPlaylists((prev) => [...prev, ...data.items]);
    }
  }, [data]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        performPlaylistSearch(searchTerm);
      } else {
        setSearchResults(null);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const newStats = calculateStats(
      {
        items: allLoadedPlaylists,
        total: data?.total || 0,
      },
      analyticsOffset,
    );
    setStats(newStats);
    console.log("Stats updated with", allLoadedPlaylists.length, "playlists");
  }, [allLoadedPlaylists, analyticsOffset]);

  if (isLoading) {
    return <AnalyticsSkeletonHoder />;
  }

  if (isError) {
    return null;
  }qw

  const performPlaylistSearch = async (query) => {
    setIsSearching(true);
    try {
      let allPlaylists = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const rawData = await spotifyFetch(
          `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
        );
        const data = await rawData.json();
        allPlaylists = [...allPlaylists, ...data.items];

        hasMore = data.next !== null;
        offset += 50;
      }
      const filtered = allPlaylists.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );

      const formattedResults = filtered.map((p) => ({
        name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
        tracks: p.tracks?.total || 0,
        dateCreated: new Date(p.created_at || p.published_at || 0).getTime(),
        fullName: p.name,
      }));
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Search error: ", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  let chartData = stats.playlistChartData;

  if (searchResults !== null) {
    chartData = searchResults;
  } else {
    if (searchTerm.trim()) {
      chartData = stats.playlistChartData.filter((p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  }

  let displayData = [...chartData];
  if (sortBy === "size") {
    displayData.sort((a, b) => b.tracks - a.tracks);
  } else if (sortBy === "alphabetical") {
    displayData.sort((a, b) => a.fullName.localeCompare(b.fullName));
  } else if (sortBy === "dateCreated") {
    displayData.sort((a, b) => (b.dateCreated || 0) - (a.dateCreated || 0));
  }

  // console.log(displayData);

  return (
    <AnalyticsSection>
      <SectionTitle>Your Music Insights</SectionTitle>

      <StatsGrid>
        <StatCard>
          <StatLabel>Total Playlists</StatLabel>
          <StatValue>
            {stats.currentlyLoaded} of {stats.totalPlaylistsInLibrary}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Tracks</StatLabel>
          <StatValue>{stats.totalTracks}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Avg Playlist Size</StatLabel>
          <StatValue>{stats.avgPlaylistSize} Songs</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Hours Of Music</StatLabel>
          <StatValue>{stats.totalHours}</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartHeaderContainer>
          <ChartTitle>Playlist Sizes</ChartTitle>
          <ChartControlsContainer>
            <SearchInputWrapper>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search Playlists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <ClearButton onClick={() => setSearchTerm("")}>✕</ClearButton>
              )}
            </SearchInputWrapper>
            <SortDropdown
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="size">Sort By Size</option>
              <option value="alphabetical">Sort By Name (A-Z)</option>
              <option value="dateCreated">Sort By Date Created</option>
            </SortDropdown>
          </ChartControlsContainer>
        </ChartHeaderContainer>

        <ResultsCountText>
          {isSearching ? (
            <span>Searching playlists... 🔍</span>
          ) : (
            <span>
              Showing {displayData.length} Of{" "}
              {searchResults !== null
                ? searchResults.length
                : stats.playlistChartData.length}{" "}
              Playlists
            </span>
          )}
        </ResultsCountText>

        {isSearching ? (
          <LoadingChartContainer>
            <LoadingSpinner />
          </LoadingChartContainer>
        ) : displayData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={displayData}>
              <CartesianGrid
                strokeDashArray="3 3"
                stroke={theme.colors.glassBorder}
              />
              <XAxis dataKey="name" stroke={theme.colors.textSecondary} />
              <YAxis stroke={theme.colors.textSecondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.surfaceMedium,
                  border: `1px solid ${theme.colors.primary}`,
                  borderRadius: "8px",
                }}
                cursor={{ fill: "rgba(29, 185, 84, 0.1)" }}
                labelFormatter={(value) => `${value} tracks`}
              />
              <Bar
                dataKey="tracks"
                fill={theme.colors.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoResultsMessage>
            No playlists match "{searchTerm}" 🔍
          </NoResultsMessage>
        )}
      </ChartContainer>

      {stats.currentlyLoaded < stats.totalPlaylistsInLibrary && !searchTerm && (
        <LoadMoreButtonContainer>
          <LoadMoreButton
            onClick={() => setAnalyticsOffset(analyticsOffset + 50)}
            disabled={stats.currentlyLoaded >= stats.totalPlaylistsInLibrary}
          >
            Load More Playlists
          </LoadMoreButton>
          <LoadMoreText>
            Showing {stats.currentlyLoaded} Of {stats.totalPlaylistsInLibrary}{" "}
            Playlists In Your Library
          </LoadMoreText>
        </LoadMoreButtonContainer>
      )}
    </AnalyticsSection>
  );
};

const ShowPlaylists = () => {
  const { isError, error, isLoading, data } = useQuery(
    "slideplaylist",
    getPlaylists,
  );
  if (isLoading) {
    return <PlaylistSkeletonHolder />;
  }
  if (isError) {
    return null;
  }
  return (
    <PlaylistsSection>
      <SectionTitle>Featured Playlists</SectionTitle>
      <Splide
        aria-label="Playlists"
        options={{
          perPage: 4,
          pause: false,
          interval: "1500",
          lazyaod: "nearby",
          preloadPages: "2",
          type: "loop",
          perMove: "1",
          autoplay: "true",
          drag: "free",
          gap: "2rem",
          breakpoints: { 768: { perPage: 2 }, 480: { perPage: 1 } },
        }}
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
  const rawData = await spotifyFetch(
    "https://api.spotify.com/v1/me/playlists?limit=10",
  );

  const data = await rawData.json();
  return data.items;
};

const getPlaylistsForAnalytics = async (offset = 0) => {
  const rawData = await spotifyFetch(
    `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
  );
  const data = await rawData.json();
  return {
    items: data.items,
    total: data.total,
  };
};

const calculateStats = (playlistData, offset) => {
  console.log("Calculate Stats:", {
    playlistsInData: playlistData.items.length,
    offset: offset,
    libraryTotal: playlistData.total,
    allPlaylistIds: playlistData.items.map((p) => p.id),
  });

  const playlists = playlistData.items;
  const totalPlaylistsInLibrary = playlistData.total;
  const currentlyLoaded = playlists.length;
  const totalPlaylists = playlists.length;
  const totalTracks = playlists.reduce(
    (sum, p) => sum + (p.tracks?.total || 0),
    0,
  );
  const avgPlaylistSize = Math.round(totalTracks / totalPlaylists);
  const totalMinutes = playlists.reduce(
    (sum, p) => sum + (p.tracks?.total || 0) * 3.5,
    0,
  );
  const totalHours = Math.round(totalMinutes / 60);

  const playlistChartData = playlists.map((p) => ({
    name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
    tracks: p.tracks?.total || 0,
    dateCreated: new Date(p.created_at || p.published_at || 0).getTime(),
    fullName: p.name,
  }));

  return {
    totalPlaylists,
    totalTracks,
    avgPlaylistSize,
    totalHours,
    playlistChartData,
    currentlyLoaded,
    totalPlaylistsInLibrary,
  };
};

const AnalyticsSkeletonHoder = () => {
  return (
    <AnalyticsSection>
      <SectionTitle>Your Music Insights</SectionTitle>
      <StatsGrid>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </StatsGrid>
    </AnalyticsSection>
  );
};

const PlaylistSkeletonHolder = () => {
  return (
    <PlaylistsSection>
      <SectionTitle>Featured Playlists</SectionTitle>
      <span>Loading Playlists...</span>
    </PlaylistsSection>
  );
};

const HomeContainer = styled.div`
  // max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl}
    ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing["3xl"]};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: ${(props) => props.theme.spacing.lg}
      ${(props) => props.theme.spacing.md};
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
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.primaryLight}
  );
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
    box-shadow:
      ${(props) => props.theme.shadows.lg},
      ${(props) => props.theme.shadows.glow};
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
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`;

const LoadMoreButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const LoadMoreButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: none;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.primaryLight} 100%
  );
  color: ${(props) => props.theme.colors.background};
  font-weight: ${(props) => props.theme.typography.weights.semibold};
  font-size: ${(props) => props.theme.typography.sizes.base};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      ${(props) => props.theme.shadows.lg},
      ${(props) => props.theme.shadows.glow};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadMoreText = styled.span`
  font-size: ${(props) => props.theme.typography.sizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ChartHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const ChartControlsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  flex: 1;
  min-width: 250px;
  padding: ${(props) => props.theme.spacing.md};
  ${(props) => props.theme.glassmorphism.light};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all ${(props) => props.theme.transitions.fast};

  &:focus-within {
    ${(props) => props.theme.glassmorphism.medium};
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    min-width: auto;
  }
`;

const SearchIcon = styled(IoSearch)`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.sizes.lg};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.sizes.base};
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.textTertiary};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.sizes.lg};
  padding: 0;
  transition: color ${(props) => props.theme.transitions.fast};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const SortDropdown = styled.select`
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.glassBorder};
  background-color: ${(props) => props.theme.colors.surfaceMedium};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.sizes.sm};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.surfaceLight};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 10px rgba(29, 185, 84, 0.2);
  }

  option {
    background-color: ${(props) => props.theme.colors.surfaceMedium};
    color: ${(props) => props.theme.colors.text};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const ResultsCountText = styled.span`
  font-size: ${(props) => props.theme.typography.sizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const NoResultsMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: ${(props) => props.theme.typography.sizes.xl};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const LoadingChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: ${(props) => props.theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${(props) => props.theme.colors.glassBorder};
  border-top-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Home;
