import SearchBar from './SearchBar.jsx';
import { useState, useEffect } from 'react';
import { useSearch } from './hooks/useSearch.js';
import tmdbLogo from './assets/TMDB_logo.png';
import noPic from './assets/noPic.png';
import './App.css';

function App() {

  const APPEND_MORE_CARDS = true;
  const { results, loading, query, setQuery, search, hasMore, totalPages} = useSearch([], false, "");
  const [searchType, setSearchType] = useState("movies");
  const [page, setPage] = useState(1);

  let cardList = results.map(result => (
    <div className="card" key={`${searchType}-${result.id}`} >
      <h2>{("movies" === searchType) ? result.title : result.name}</h2>
      <div className="card-content">
        <img
          className="cardIcon"
          src={
            ("movies" === searchType || "tv" === searchType)
              ? `https://image.tmdb.org/t/p/original/${result.poster_path}`
              : `https://image.tmdb.org/t/p/original/${result.profile_path}`
          }
          alt={("movies" === searchType) ? result.title : result.name}
          onError={(e) => {
            e.target.src = noPic; // fallback image
            e.target.onerror = null; // prevent infinite loop if noPic.png is also missing
          }}
        />
        <p className="card-overview">{result.overview}</p>
        <div>
          <p>{("tv" === searchType)? result.first_air_date : ''}</p>
          <p>{("movies" === searchType)? result.release_date : ''}</p>
          <p>{("movies" === searchType || "tv" === searchType) ? 'Rating: ' + result.vote_average : ''}</p>
          <p>{("people" === searchType) ? 'Known for:' : ''}</p>
          <h3>{("people" === searchType) ? result.known_for_department : ''}</h3>
        </div>
      </div>
    </div>
  ));

  function handleMoreResults() {
    search(query, searchType, page + 1, APPEND_MORE_CARDS);
    setPage(page => page + 1);
  }

  useEffect(() => {  // Every time searchType changes, clear results and query
    search("", searchType, 1);
    setQuery("");
    setPage(1);
  }, [searchType]);

  return (

    <div id="app-container">

      <div className="header-container">
        <h1>Entertainment Search</h1>
        <h2>Powered by:</h2>
        <div>
          <img
            id="TMDB_logo"
            src={tmdbLogo}
            alt="TMDB"
            height="20px"
          />
        </div>
      </div>

      <SearchBar
        query={query}
        setQuery={setQuery}
        search={search}
        loading={loading}
        searchType={searchType}
      />
      {loading && <p>Loading...</p>}

      <form id="choiceForm">
        <div>
          <input type="radio" id="movies" name="searchChoice" value="movies"
            checked={searchType === "movies"} onChange={() => setSearchType("movies")} />
          <label htmlFor="movies">Movies</label>
        </div>

        <div>
          <input type="radio" id="tv" name="searchChoice" value="tv"
            checked={searchType === "tv"} onChange={() => setSearchType("tv")} />
          <label htmlFor="tv">TV Shows</label>
        </div>

        <div>
          <input type="radio" id="people" name="searchChoice" value="people"
            checked={searchType === "people"} onChange={() => setSearchType("people")} />
          <label htmlFor="people">People</label>
        </div>
      </form>

      {cardList}
      {hasMore && (
        <>
          <p>Pages 1 - {page} of {totalPages}</p>
          <button id="moreResultsButton" type="button" onClick={handleMoreResults}>More Results...</button>
        </>
      )}
    </div>
  );
}

export default App;
