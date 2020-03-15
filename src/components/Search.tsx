import React, { useState, useCallback } from "react";
import { search } from "../services/SearchService";
import "./Search.scss";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { startPlayingTrack } from "../services/PlaybackService";

interface Props {
  token: string;
}

export const Search: React.FC<Props> = ({ token }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsCount, setSearchResultCount] = useState(0);
  const searchForTracks = useCallback(
    searchTerm => {
      if (searchTerm !== "") {
        search(token, searchTerm).then(searchRes => {
          if (searchRes.tracks !== undefined) {
            setSearchResults(searchRes.tracks.items);
            setSearchResultCount(searchRes.tracks.total);
          }
        });
      }
    },
    [token]
  );
  const playTrack = useCallback(
    trackId => {
      startPlayingTrack(token, trackId);
    },
    [token]
  );
  const debouncedSearch = debounce(searchForTracks, 800, { maxWait: 1000 });
  return (
    <div className="search">
      <div className="search-bar">
        <input
          type="text"
          name="search-term"
          className="search-term"
          placeholder="Search.."
          onChange={e => {
            e.preventDefault();
            debouncedSearch(e.target.value);
          }}
        />
      </div>
      <div className="search-results">
        {searchResults && searchResults.length > 0 && (
          <div className="search-result-amount">
            {searchResultsCount} result(s)
          </div>
        )}
        <div>
          {searchResults.map(searchRes => (
            <div className="search-result" key={searchRes.id}>
              <div className="search-result-img">
                <img
                  src={
                    searchRes.album.images.find(
                      (image: any) => image.height === 64
                    )?.url
                  }
                  alt=""
                />
              </div>
              <div className="track">{searchRes.name}</div>
              <div className="artist">
                {searchRes.artists.map((artist: any) => artist.name).join(", ")}
              </div>
              <div className="options">
                <button
                  className="btn"
                  onClick={() => playTrack(searchRes.uri)}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
