import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform, private translate: TranslateService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setupLanguage();
    });
  }

  private setupLanguage() {
    const supportedLanguages = ['en', 'es'];
    this.translate.setDefaultLang('en');
    const deviceLanguage = this.getDeviceLanguage();
    if (supportedLanguages.includes(deviceLanguage)) {
      this.translate.use(deviceLanguage);
    } else {
      this.translate.use('en');
    }
  }

  private getDeviceLanguage(): string {
    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang =
        window.navigator.language ||
        (window.navigator as any).userLanguage ||
        (window.navigator as any).browserLanguage ||
        'en';

      return browserLang.split('-')[0].toLowerCase();
    }

    return 'en';
  }
}
