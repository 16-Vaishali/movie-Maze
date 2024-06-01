import { auth, firestore } from "@/firebase/firebase";
import { useEffect,useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {  doc, getDoc} from "firebase/firestore";


function useGetUser() {
    const [data, setData] = useState({
     gender:'',email:'',displayName:'',collections:[],uid:''
    });
    const [user] = useAuthState(auth);

    useEffect(() => {
      const getUserData = async () => {
        const userRef = doc(firestore, "users", user!.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const {
            gender,email,displayName,collections,uid
          } = data;
          setData({
            gender:gender,collections:collections,email:email,displayName:displayName,uid:uid
          });
        }
      };
      if (user) getUserData();
      return () =>
        setData({ gender:'',email:'',displayName:'',collections:[],uid:'' });
    }, [ user]);
    return { ...data, setData };
  }

  export default useGetUser