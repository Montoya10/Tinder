import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  defaultLang = 'en';
  supportedLangs = ['en', 'es'];

  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeLanguage();
  }

  private initializeLanguage() {
    if (isPlatformBrowser(this.platformId)) {
      
      const savedLang = localStorage.getItem('lng');
      
      if (savedLang && this.supportedLangs.includes(savedLang)) {
        this.defaultLang = savedLang;
      } else {
        
        const browserLang = this.getBrowserLanguage();
        this.defaultLang = this.supportedLangs.includes(browserLang) ? browserLang : 'en';
      }
      
      this.translateService.setDefaultLang('en');
      this.translateService.use(this.defaultLang);
    }
  }

  private getBrowserLanguage(): string {
    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang = window.navigator.language || 
                         (window.navigator as any).userLanguage || 
                         'en';
      return browserLang.split('-')[0].toLowerCase();
    }
    return 'en';
  }

  changeLang(lang: string) {
    if (this.supportedLangs.includes(lang)) {
      this.translateService.use(lang);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('lng', lang);
      }
    }
  }

  getCurrentLang(): string {
    return this.translateService.currentLang || this.defaultLang;
  }
}