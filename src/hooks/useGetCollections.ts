import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';

const useGetCollectionsList = () => {
  const [collectionsList, setCollectionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCollectionsList = async () => {
      setLoading(true); 
      const q = query(collection(firestore, "collections"));
      const querySnapshot = await getDocs(q);
      const tmp:any = [];
      querySnapshot.forEach((doc) => {
        tmp.push({ id: doc.id, ...doc.data() });
      });
      setCollectionsList(tmp);
      setLoading(false); 
    };

    getCollectionsList();
  }, []);

  return { collectionsList, loading };
};

export default useGetCollectionsList;
