import 'firebase/firestore';
import { Timestamp, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { collection, addDoc ,doc, setDoc} from "firebase/firestore"; 
import { db } from '../firebase';
import { auth } from '../firebase';






async function ddd(email: string,username: string,name: string,surname: string,dateofbirth:Timestamp,uid:string) { 
  

  try { 
    const docRef = doc(db, "users", uid )
    await setDoc(docRef, {
            name:name,
            surname:surname,
            username: username,
            email: email,
            dateofbirth: dateofbirth
    });} catch (e) {  
      console.error(e);
     }
  }


export default ddd
