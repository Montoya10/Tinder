// query.ts - Agrega estos métodos
import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs 
} from '@angular/fire/firestore';
 


@Injectable({
  providedIn: 'root'
})
export class Query {
  constructor(private readonly fs: Firestore){}

  async create(collectionName:string, data:any, uuid:string ){
    try {
      const collect = collection(this.fs, collectionName)
      await setDoc(doc(collect, uuid), data );
    } catch (error) {
      console.log((error as any).message); 
    }
  }

  /**
   * Agrega un documento con id autogenerado
   */
  async add(collectionName: string, data: any) {
    try {
      const collect = collection(this.fs, collectionName);
      const ref = await addDoc(collect, data);
      return ref.id;
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

  
  async update(collectionName: string, uuid: string, data: any) {
    try {
      const docRef = doc(this.fs, collectionName, uuid);
      await updateDoc(docRef, data);
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }


  async get(collectionName: string, uuid: string) {
    try {
      const docRef = doc(this.fs, collectionName, uuid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error('Documento no encontrado');
      }
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

  /**
   * Lista documentos filtrando por un campo
   */
  async listByField(collectionName: string, field: string, value: any) {
    try {
      const collect = collection(this.fs, collectionName);
      const q = query(collect, where(field, '==', value));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

  /**
   * Lista TODOS los documentos de una colección
   */
  async listAll(collectionName: string) {
    try {
      const collect = collection(this.fs, collectionName);
      const snap = await getDocs(collect);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

  /**
   * Elimina un documento por ID
   */
  async delete(collectionName: string, uuid: string) {
    try {
      const docRef = doc(this.fs, collectionName, uuid);
      await deleteDoc(docRef);
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }
}