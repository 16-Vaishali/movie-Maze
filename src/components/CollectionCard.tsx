import Image from 'next/image';
import React from 'react';

interface Collection {
  id: string;
  name: string;
  movies: any[]; 
}

interface Props {
  collection: Collection;
  imageUrl?: string; 
}

const CollectionCard: React.FC<Props> = ({ collection, imageUrl }) => {
  const moviesCount = collection.movies ? collection.movies.length : 0;
  const firstMovieUrl = collection.movies && collection.movies.length > 0 ? collection.movies[0].imageUrl : '';

  return (
    <div className="border border-gray-300 rounded-md p-4 shadow-md m-4" style={{ background: '#090e2b' }}>
      <a href={`/profile/${collection.id}`}>
        {imageUrl && <Image src={imageUrl} alt="" width={'300'} height={'150'}/>}
        <h2 className="text-lg font-semibold text-white">{collection.name}</h2>
        <p className="text-gray-600">{moviesCount} movies</p>
        
      </a>
    </div>
  );
};

export default CollectionCard;
