import CollectionCard from '@/components/CollectionCard';
import useGetCollectionsList from '@/hooks/useGetCollections';
import useGetUser from '@/hooks/useGetUser';
import React from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';
interface Collection {
  id: string;
  name: string;
  movies: { imageUrl: string }[]; 
  createdBy:string
  isPublic:boolean
}

const CollectionsComponent = () => {
  const { collectionsList, loading } = useGetCollectionsList();
  const { ...data } = useGetUser();
  const userEmail = data?.email || '';
  const userCollections: Collection[] = collectionsList.filter(
    (collection: Collection) => !collection.isPublic || collection.createdBy === userEmail
  );


  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <MagnifyingGlass
          visible={true}
          height="300"
          width="300"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div> 
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {userCollections.length === 0 ? (
        <div>No collections found</div>
      ) : (
        <>
          {userCollections.map((collection, idx) => (
            <CollectionCard 
              key={idx} 
              collection={collection} 
              imageUrl={collection.movies.length > 0 ? collection.movies[0].imageUrl : ''}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CollectionsComponent;
