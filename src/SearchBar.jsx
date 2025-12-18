function SearchBar(props) {

    return(
      <form className="searchForm" onSubmit={(e) => { 

        e.preventDefault();
        props.search(props.query, props.searchType, 1);
        }}>
        
        <input value={props.query} onChange={(e) => props.setQuery(e.target.value)} placeholder="Keywords..." size="30" />

        <button type="submit" disabled={props.loading}>
          {props.loading ? 'Searching...' : 'Search'}
        </button>

      </form>
  );
}

export default SearchBar;