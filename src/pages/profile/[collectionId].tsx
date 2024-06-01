import Moviecard from '@/components/Moviecard';
import { firestore } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';

const CollectionPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;
  const [collection, setCollection] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
 
      try {
        const collectionDoc = doc(firestore, `collections/${collectionId}`);
        const docSnapshot = await getDoc(collectionDoc);
        if (docSnapshot.exists()) {
          setCollection({ ...docSnapshot.data() });
        }
      } catch (error) {
       console.log(error)
      }

      setLoading(false);
    };

    if (collectionId) {
      fetchCollection();
    }
  }, [collectionId]);

  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <MagnifyingGlass
          visible={true}
          height={300}
          width={300}
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mx-4 mt-2'>
      {collection.movies.map((movie: any) => ( 
        <Moviecard dummy={true}
          key={movie.title} 
          title={movie.title} 
          year={movie.year} 
          imageUrl={movie.poster} 
        />
      ))}
    </div>
  );
};

export default CollectionPage;
