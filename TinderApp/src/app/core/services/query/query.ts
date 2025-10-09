import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc} from '@angular/fire/firestore';
import { User } from 'src/domain/model/user.model';


@Injectable({
  providedIn: 'root'
})
export class Query {
  
constructor(private readonly FSsrv: Firestore) {}

async create (collectionName: string, data: User, uuid: string){
  try{
    const collect = collection(this.FSsrv, collectionName);
    const docRef = doc(collect, uuid);
    await setDoc(docRef, data);
  }catch(error){
    console.error('Error creating document:', (error as any).message);
  }
}

}
