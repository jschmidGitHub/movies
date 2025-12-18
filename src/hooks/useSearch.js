import { useState } from 'react';

export function useSearch() {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const tmdbBaseUrl = 'https://api.themoviedb.org/3';

  const getSearchResults = async (searchQuery, searchType, page) => {

    let endpoint = '/search/movie';
    if (searchType === "tv") {
      endpoint = "/search/tv";
    } else if (searchType === "people") {
      endpoint = "/search/person";
    }
    const url = `${tmdbBaseUrl}${endpoint}?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(searchQuery)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return response;
  };

  const search = async (searchQuery, searchType, pageNum, append = false) => {

    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      setTotalPages(1);
      setPage(1);
      return;
    }

    setLoading(true);
    try {
      const response = await getSearchResults(searchQuery, searchType, pageNum);
      const jsonData = await response.json();
    
      const newTotalPages = jsonData.total_pages || 1;
      setTotalPages(newTotalPages);
      setPage(pageNum);

      if (append) {
        setResults(prev => [...prev, ...jsonData.results]);
      } else {
        setResults(jsonData.results || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const hasMore = page < totalPages;
  return { query, setQuery, results, loading, search, hasMore,  totalPages};
}
