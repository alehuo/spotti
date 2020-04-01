import React, { useState, useCallback } from "react";
import { search, Item } from "../services/SearchService";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useTypedSelector, AppDispatch } from "../reducers/rootReducer";
import { Button } from "./ui/Button";
import { useDispatch } from "react-redux";
import { addToQueue_epic } from "../reducers/queueReducer";
import styled from "styled-components";
import { playSong_epic } from "../reducers/playerReducer";

const SearchWrapper = styled.div`
  padding: 16px;
  grid-area: search;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 48px 56px calc(100% - 48px - 56px);
`;

const SearchTitle = styled.div`
  height: 48px;
  width: 100%;
`;

const SearchBar = styled.div`
  height: 48px;
  width: 100%;
`;

const SearchTerm = styled.input`
  outline: 0;
  padding: 8px;
  display: block;
  height: 100%;
  width: 60%;
  color: ${props => props.theme.textColor};
  align-self: center;
  background-color: transparent;
  border: 0;
  border-bottom: 2px solid ${props => props.theme.textColor};
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: border-bottom, color;
  font-size: 0.7em;
  ::placeholder {
    color: ${props => props.theme.textColor};
    opacity: 0.5;
  }
`;

const SearchResults = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const SearchResultAmount = styled.div`
  font-weight: bold;
  font-size: 0.7em;
  padding-left: 16px;
  height: 24px;
  width: 100%;
`;

const SearchResult = styled.div`
  height: 64px;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 64px auto 128px;
  font-size: 0.6em;
  &:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.055);
  }
  grid-template-areas:
    "trackimage trackname options"
    "trackimage artist options";
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
`;

const SearchResultArtist = styled.div`
  grid-area: artist;
  font-weight: bold;
  padding-left: 8px;
  align-self: start;
`;

const SearchResultOptions = styled.div`
  display: flex;
  grid-area: options;
  align-self: center;
  justify-content: center;
`;

export const Search: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector(state => state.auth.token);
  const queueItems = useTypedSelector(state => state.queue.queueItems);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResultsCount, setSearchResultCount] = useState(0);
  const searchForTracks = useCallback(
    searchTerm => {
      if (searchTerm !== "") {
        search(token, searchTerm).then(searchRes => {
          if (searchRes.data.tracks !== undefined) {
            setSearchResults(searchRes.data.tracks.items);
            setSearchResultCount(searchRes.data.tracks.total);
          }
        });
      }
    },
    [token]
  );
  const que = useCallback(
    (itm: Item) => {
      dispatch(addToQueue_epic(itm));
    },
    [dispatch]
  );
  const debouncedSearch = useCallback(
    debounce(searchForTracks, 800, { maxWait: 1000 }),
    []
  );
  return (
    <SearchWrapper>
      <SearchTitle>Search for tracks</SearchTitle>
      <SearchBar>
        <SearchTerm
          type="text"
          name="search-term"
          placeholder="Search.."
          value={searchText}
          onChange={e => {
            e.preventDefault();
            setSearchText(e.target.value);
            if (e.target.value === "") {
              debouncedSearch.cancel();
              setSearchResults([]);
              setSearchResultCount(0);
            } else {
              debouncedSearch(e.target.value);
            }
          }}
        />
      </SearchBar>
      <SearchResults>
        {searchText !== "" && searchResults && searchResults.length > 0 && (
          <SearchResultAmount>
            {searchResultsCount} result(s)
          </SearchResultAmount>
        )}
        <div>
          {searchText !== "" &&
            searchResults.map(searchRes => (
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
                <SearchResultTrack>{searchRes.name}</SearchResultTrack>
                <SearchResultArtist>
                  {searchRes.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
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
        </div>
      </SearchResults>
    </SearchWrapper>
  );
};
