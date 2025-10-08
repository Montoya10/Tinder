import { Query } from './providers/query/query';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.prod';
import { ErrorHandler } from './services/error-handler/error-handler';
import {provideFirestore, getFirestore} from '@angular/fire/firestore'
import { Auth } from './services/auth/auth';
import { Filepicker } from './providers/filepicker/filepicker';
import { Capacitor } from '@capacitor/core';
import { Uploader } from './providers/uploader/uploader';
import { TranslateModule } from '@ngx-translate/core';

const providers =[Filepicker, Uploader]



@NgModule({
  declarations: [],
  imports: [CommonModule,TranslateModule,],
  exports: [TranslateModule,],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.FIREBASE_APP)),
    provideAuth(() => getAuth()),
    provideFirestore(()=>getFirestore()), [Filepicker],
    Auth, Query,
    ErrorHandler,
  ],
}
)
export class CoreModule {
  constructor(private readonly fileSrv: Filepicker){
    this.ngOnInit();
  }

  async ngOnInit() {
    if(Capacitor.isNativePlatform ()){

      await this.fileSrv.requestPermissions();

    }
  }
}
