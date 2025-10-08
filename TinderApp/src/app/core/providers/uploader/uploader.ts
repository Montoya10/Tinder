import { Json } from './../../../../../node_modules/@supabase/postgrest-js/src/select-query-parser/types';
import { Injectable } from '@angular/core';

import { supabase } from 'src/app/supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class Uploader {
  async upload(
    bucket: string,
    folder: string,
    name: string,
    d: string,
    contentType: string
  ): Promise<string> {
    console.log('Dato recibido:', d.substring(0, 100)); // Ver primeros 100 caracteres
    console.log('Es data URL?:', d.startsWith('data:'));

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(
        `${folder}/${name}`,
        Uint8Array.from(atob(d), (c) => c.charCodeAt(0)),
        {
          contentType,
        }
      );

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    return await this.getSignUrl(bucket, data.path || '');
  }

  async getSignUrl(bucket: string, name: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(name, 86400);
    return data?.signedUrl || '';
  }


  async getPublicUrl(bucket: string, name: string): Promise<string> {
  const { data } = await supabase.storage
    .from(bucket)
    .getPublicUrl(name);
  
  return data.publicUrl;
}
}
