import React, { useState } from 'react';
import Moviecard from './Moviecard';
import useGetCollectionsList from '@/hooks/useGetCollections';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { RiSearchEyeLine } from 'react-icons/ri';
import { toast } from 'react-toastify';



const Search= () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
 
  const { collectionsList } = useGetCollectionsList();

  const handleSearch = async () => {
    if (!query) {
      setResults([]);
      toast.error('Please enter a search query')
      return;
    }

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${process.env.NEXT_PUBLIC_MOVIE_API}`);
      const data = await response.json();

      if (data.Response === 'True') {
        const detailedResults = await Promise.all(
          data.Search.map(async (movie: any) => {
            const movieDetailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${process.env.NEXT_PUBLIC_MOVIE_API}`);
            const movieDetails = await movieDetailsResponse.json();
            return {
              ...movie,
              genre:movieDetails.Genre,
              Rating: movieDetails.imdbRating,
            };
          })
        );
        setResults(detailedResults);
      } else
        setResults([]);
    } catch (error) {
      setResults([]);
      toast.error('An error occurred while fetching data.');
    }
  };

  const addMovieToCollection = async (selectedCollections: string[], movie: any) => {
    for (const collectionName of selectedCollections) {
      const collectionRef = doc(firestore, 'collections', collectionName);
      await updateDoc(collectionRef, {
        movies: arrayUnion(movie)
      });
      toast.success('Movie added to the collection!')
    }
    
  };

  
  return (
    <div className="flex flex-col items-center justify-center py-10" style={{background:'#090e2b'}}>
      <div className="flex flex-col sm:flex-row items-center">
        <input
          type="text"
          className="p-2 w-full sm:w-64 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="p-2 w-full sm:w-auto text-white border border-white rounded-r-md sm:rounded-l-none sm:mt-0 mt-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSearch} style={{background: '#060f45'}}
        >
         <RiSearchEyeLine fontSize={'25'} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mx-5">
        {results.map((result, index) => (
          <Moviecard
            key={index}
            title={result.Title}
            year={result.Year}
            imageUrl={result.Poster}
            onAddMovie={addMovieToCollection}
            collections={collectionsList}dummy={false}
            imdb={result.Rating} genre={result.genre}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
