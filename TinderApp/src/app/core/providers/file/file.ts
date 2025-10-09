import { Injectable } from '@angular/core';
import {FilePicker, PickedFile} from "@capawesome/capacitor-file-picker"
import { limit } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class File {
  constructor(){}

  async requestPermissions(){
    try{
      await FilePicker.requestPermissions();
    }catch(error){
      console.log((error as any));
    }
  }

  async pickImage(){
    try {
      const image = await FilePicker.pickImages({
        limit: 1,
        readData: true,
      });
      const file = image.files[0];
      const pickImage = [{
        name: file.name,
        data: file.data,
        mimeType: file.mimeType
      }];
      return pickImage[0];
    } catch (error) {
      console.log((error as any));
      throw error;
    }
  }
}
