import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root',
})
export class Filepicker {
  constructor() {}

  async requestPermissions() {
    try {
      await FilePicker.requestPermissions();
    } catch (error) {
      await Toast.show({
        text: 'Error al requerir permisos',
        duration: 'long',
      });
    }
  }
  async pickImage() {
    try {
      const image = await FilePicker.pickImages({
        limit: 1,
        readData: true,
      });
      const img = image.files[0];
      return {
        data: img.data,
        name: img.name,
        MimeType: img.mimeType,
      };
    } catch (error) {
      await Toast.show({
        text: 'Error al obtener la imagen',
        duration: 'long',
      });
      throw error;
    }
  }
}
