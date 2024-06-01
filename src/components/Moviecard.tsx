import React, { useState } from 'react';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import useGetUser from '@/hooks/useGetUser';
import { FaPlusCircle, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Movie {
  title: string;
  year: string;
  imageUrl: string;
}

interface Collection {
  name: string;
  createdBy: string;
  isPublic: boolean;
  movies: any[];
}

interface MoviecardProps {
  title: string;
  year: string;
  imageUrl: string;
  onAddMovie?: (selectedCollections: string[], movie: Movie) => void;
  collections?: Collection[];
  dummy:boolean 
  imdb?:string
  genre?:string
}

const Moviecard: React.FC<MoviecardProps> = ({ title, year, imageUrl, onAddMovie, collections, dummy,genre,imdb }) => {
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { ...data } = useGetUser();

  const handleCheckboxChange = (collectionName: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionName)
        ? prev.filter((name) => name !== collectionName)
        : [...prev, collectionName]
    );
  };

  const handleAddMovie = () => {
    onAddMovie!(selectedCollections, { title, year, imageUrl, });
    setShowCollections(false);
    setSelectedCollections([]);
  };

  const createCollection = async () => {
    if (!newCollectionName) return;
    const collectionData = { name: newCollectionName, createdBy: data.email, isPublic, movies: [] };
    await setDoc(doc(firestore, 'collections', collectionData.name), collectionData);
    const userDocRef = doc(firestore, 'users', data.uid);
    await updateDoc(userDocRef, {
      collections: arrayUnion(collectionData.name)
    });
    toast.success('Collection created successfully!',{ position: "top-center" })
    setNewCollectionName('');
    setIsPublic(false);
    setShowNewCollectionForm(false);
  };

  return (
    <div className="text-white rounded-lg p-4 relative" style={{ background:'linear-gradient(141deg, rgba(8,8,89,1) 16%, rgba(16,16,60,1) 49%, rgba(3,26,42,1) 80%)',boxShadow:'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'}}>
    <Image src={imageUrl} alt={`${title} poster`} className=" object-cover rounded-lg mb-4" width={'300'} height={'150'} />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-300">{year}</p>
    {
      !dummy && (
        <>
      <div className="flex items-center space-x-2">
        <FaStar className="text-yellow-400" fontSize={'20'}/>&nbsp;:
        <p className="text-gray-300">{imdb}</p>
      </div>
        <p className="text-gray-300">{genre}</p>
        <button onClick={() => setShowCollections(!showCollections)} className="absolute bottom-2 right-2 text-white hover:text-gray-300 focus:outline-none">
      <FaPlusCircle fontSize={'30'} />
    </button></>
      )
    }
    {showCollections && (
      <div className="collections-dropdown absolute top-full right-0 bg-gray-800 rounded-lg p-4 mt-2 z-10"> 
        {collections!.map((collection, index) => (
          <div key={index} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCollections.includes(collection.name)}
                onChange={() => handleCheckboxChange(collection.name)}
                className="mr-2"
              />
              <span>{collection.name}</span>
            </label>
          </div>
        ))}
        <button onClick={() => setShowNewCollectionForm(!showNewCollectionForm)} className="text-white px-4 py-1 bg-blue-500 hover:text-gray-300 focus:outline-none mx-2 rounded-lg">Create New Collection</button>
        {showNewCollectionForm && (
          <div className="new-collection-form mt-2">
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded-lg mr-2 focus:outline-none"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-300">Public</span>
            </label>
            <button onClick={createCollection} className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 focus:outline-none">Create</button>
          </div>
        )}
        <button onClick={handleAddMovie} className="bg-blue-500 text-white px-4 py-1 rounded-lg mt-2 hover:bg-blue-600 focus:outline-none">Add</button>
      </div>
    )}
  </div>
  

  );
};

export default Moviecard;
