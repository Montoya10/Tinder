import { Filepicker } from './../../../core/providers/filepicker/filepicker';
import { Injectable } from '@angular/core';
import { Uploader } from 'src/app/core/providers/uploader/uploader';
import { Auth } from 'src/app/core/services/auth/auth';
import { Query } from 'src/app/core/providers/query/query';
import { supabase } from 'src/app/supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class Wallpaper {
  private readonly WALLPAPER_COLLECTION = 'wallpapers';

  constructor(
    private readonly filePickerSrv: Filepicker,
    private readonly uploaderSrv: Uploader,
    private readonly authSrv: Auth,
    private readonly querySrv: Query
  ) {}

  /**
   * Sube un wallpaper para el usuario autenticado y guarda metadatos
   */
  public async uploadWallpaper(): Promise<string> {
    const userId = this.authSrv.currentUserId;
    if (!userId) throw new Error('Usuario no autenticado');

    const image = await this.filePickerSrv.pickImage();
    const fileName = `${Date.now()}-${image.name}`;

    // Carpeta segregada por usuario
    const url = await this.uploaderSrv.upload(
      'mySupaWallpapers',
      `users/${userId}`,
      fileName,
      image.data || '',
      image.MimeType
    );

    // Guardar metadatos en Firestore
    await this.querySrv.add(this.WALLPAPER_COLLECTION, {
      userId,
      fileName,
      createdAt: new Date().toISOString(),
      url,
      mimeType: image.MimeType,
      size: image.data?.length || 0
    });

    return url;
  }

  public async loadUserWallpapers(): Promise<any[]> {
    const userId = this.authSrv.currentUserId;
    if (!userId) return [];

    const docs = await this.querySrv.listByField(
      this.WALLPAPER_COLLECTION,
      'userId',
      userId
    );
    // Orden descendente por fecha
    return docs.sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }
  /**
   * Elimina un wallpaper: borra metadato en Firestore y archivo en Supabase Storage
   * @param docId ID del documento en Firestore
   * @param fileName Nombre del archivo en Supabase Storage (incluyendo carpeta usuario)
   * @returns Promise<void>
   */
  public async deleteWallpaper(docId: string, fileName: string): Promise<void> {
    const userId = this.authSrv.currentUserId;
    if (!userId) throw new Error('Usuario no autenticado');

    // 1. Borrar documento en Firestore
    await this.querySrv.delete(this.WALLPAPER_COLLECTION, docId);

    // 2. Borrar archivo en Supabase Storage
    const { error } = await supabase.storage
      .from('mySupaWallpapers')
      .remove([`users/${userId}/${fileName}`]);
    if (error) throw error;
  }
}