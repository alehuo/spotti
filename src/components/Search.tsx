import React, { useState, useCallback } from "react";
import {
  searchTracks,
  TrackItem,
  searchAlbums,
  AlbumItem,
} from "../services/SearchService";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPlusCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useTypedSelector } from "../reducers/rootReducer";
import { Button } from "./ui/Button";
import { useDispatch } from "react-redux";
import { addToQueue_epic } from "../reducers/queueReducer";
import { styled } from "../customStyled";
import { playSong_epic } from "../reducers/playerReducer";
import { trimLength } from "../utils";
import { Link } from "react-router-dom";
import { AppDispatch } from "../configureStore";
import { device } from "../vars";

const SearchWrapper = styled.div`
  padding: 16px;
  grid-area: search;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 42px calc(100% - 42px);
`;

const SearchBar = styled.div`
  display: grid;
  grid-template-columns: 48px calc(100% - 48px);
  align-items: center;
  justify-items: center;
  height: 100%;
  border-radius: 48px;
  width: 70%;
  max-width: 390px;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.textColor + "95"};
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  @media ${device.mobile} {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchTerm = styled.input`
  outline: 0;
  padding: 8px;
  display: block;
  height: 100%;
  width: 100%;
  background-color: transparent;
  align-self: center;
  text-align: left;
  color: ${(props) => props.theme.bgColor};
  border: 0;
  font-size: 0.8em;
  &::placeholder {
    color: ${(props) => props.theme.bgColor};
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const SearchResults = styled.div`
  padding-bottom: 16px;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media ${device.desktop} {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
  @media ${device.mobile} {
    grid-template-columns: 1fr;
  }
  grid-auto-rows: minmax(min-content, max-content);
  column-gap: 8px;
  row-gap: 8px;
  align-items: center;
  justify-content: center;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

const SearchResult = styled.div`
  height: 72px;
  width: 100%;
  min-width: 350px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 72px auto 64px;
  font-size: 0.6em;
  grid-template-areas:
    "trackimage trackname options"
    "trackimage artist options";
  @media ${device.mobile} {
    min-width: 0px;
    width: 100%;
  }
`;

const SearchResultImg = styled.div`
  height: 64px;
  grid-area: trackimage;
  align-self: center;
`;

const SearchResultTrack = styled.div`
  grid-area: trackname;
  padding-left: 8px;
  align-self: center;
  font-weight: bold;
`;

const SearchResultArtist = styled.div`
  grid-area: artist;
  padding-left: 8px;
  align-self: start;
`;

const SearchResultOptions = styled.div`
  display: flex;
  grid-area: options;
  align-self: center;
  justify-content: center;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  display: block;
`;

const SearchSpacer = styled.div`
  width: 100%;
  height: 48px;
  line-height: 48px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  grid-column: 1 / -1;
  position: sticky;
  top: 0;
`;

export const Search: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const queueItems = useTypedSelector((state) => state.queue.queueItems);
  const [trackSearchResults, setTrackSearchResults] = useState<TrackItem[]>([]);
  const [albumSearchResults, setAlbumSearchResults] = useState<AlbumItem[]>([]);
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [searchResultsCount, setSearchResultCount] = useState(0);
  const searchForTracks = useCallback(
    async (searchTerm) => {
      if (searchTerm !== "") {
        const [trackRes, albumRes] = await Promise.all([
          searchTracks(token, searchTerm),
          searchAlbums(token, searchTerm),
        ]);
        if (trackRes.data.tracks !== undefined) {
          setTrackSearchResults(trackRes.data.tracks.items);
        }
        if (albumRes.data.albums !== undefined) {
          setAlbumSearchResults(albumRes.data.albums.items);
        }
        setSearchResultCount(
          trackRes.data.tracks.total + albumRes.data.albums.total
        );
      }
    },
    [token]
  );
  const que = useCallback(
    (itm: TrackItem) => {
      dispatch(
        addToQueue_epic({
          id: itm.id,
          uri: itm.uri,
        })
      );
    },
    [dispatch]
  );
  const debouncedSearch = useCallback(
    debounce(searchForTracks, 800, { maxWait: 1000 }),
    []
  );
  const hasResults =
    searchText !== "" &&
    trackSearchResults &&
    albumSearchResults &&
    (trackSearchResults.length > 0 || albumSearchResults.length > 0);
  return (
    <SearchWrapper>
      <SearchBar>
        <SearchIcon icon={faSearch} />
        <SearchTerm
          type="search"
          name="search-term"
          placeholder="Search for tracks, albums and playlists..."
          value={searchText}
          onChange={(e) => {
            e.preventDefault();
            setSearchText(e.target.value);
            if (e.target.value === "") {
              debouncedSearch.cancel();
              setTrackSearchResults([]);
              setSearchResultCount(0);
            } else {
              debouncedSearch(e.target.value);
            }
          }}
        />
      </SearchBar>
      <SearchResults>
        <>
          {hasResults && (
            <SearchSpacer>
              <i>{searchResultsCount}</i>{" "}
              {searchResultsCount > 1 ? "results for " : "result for "}
              <b>{searchText}</b>
            </SearchSpacer>
          )}
          {hasResults && (
            <SearchSpacer>
              <b>Tracks</b>
            </SearchSpacer>
          )}
          {hasResults &&
            trackSearchResults.map((searchRes) => (
              <SearchResult key={searchRes.id}>
                <SearchResultImg>
                  <img
                    src={
                      searchRes.album.images.find(
                        (image: any) => image.height === 64
                      )?.url
                    }
                    alt=""
                  />
                </SearchResultImg>
                <SearchResultTrack>
                  {trimLength(searchRes.name)}
                </SearchResultTrack>
                <SearchResultArtist>
                  {trimLength(
                    searchRes.artists.map((artist) => artist.name).join(", ")
                  )}
                </SearchResultArtist>
                <SearchResultOptions>
                  {queueItems.length === 0 && (
                    <Button
                      onClick={() =>
                        dispatch(playSong_epic(searchRes.uri, searchRes.id))
                      }
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      que(searchRes);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </Button>
                </SearchResultOptions>
              </SearchResult>
            ))}
          {hasResults && (
            <SearchSpacer>
              <b>Albums</b>
            </SearchSpacer>
          )}
          {hasResults &&
            albumSearchResults.map((searchRes) => (
              <SearchResult key={searchRes.id}>
                <SearchResultImg>
                  <Link to={`/album/${searchRes.id}`}>
                    <img
                      src={
                        searchRes.images.find(
                          (image: any) => image.height === 64
                        )?.url
                      }
                      alt=""
                    />
                  </Link>
                </SearchResultImg>
                <SearchResultTrack>
                  {trimLength(searchRes.name)}
                </SearchResultTrack>
                <SearchResultArtist>
                  {trimLength(
                    searchRes.artists.map((artist) => artist.name).join(", ")
                  )}
                </SearchResultArtist>
                <SearchResultOptions />
              </SearchResult>
            ))}
          {hasResults && (
            <SearchSpacer>
              <b>Playlists</b>
            </SearchSpacer>
          )}
        </>
      </SearchResults>
    </SearchWrapper>
  );
};
