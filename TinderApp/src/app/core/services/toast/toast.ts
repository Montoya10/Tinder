// toast.ts
import { Injectable } from '@angular/core';
import { Toast as ToastNative } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class Toast {
  constructor() { }

  async show(text: string, duration: 'long' | 'short' = 'short') {
    await ToastNative.show({
      text,
      duration,
    });
  }

  async showSuccess(text: string) {
    await ToastNative.show({
      text: `✅ ${text}`,
      duration: 'short',
    });
  }

  async showError(text: string) {
    await ToastNative.show({
      text: `❌ ${text}`,
      duration: 'long',
    });
  }

  async showWarning(text: string) {
    await ToastNative.show({
      text: `⚠️ ${text}`,
      duration: 'short',
    });
  }

  async showInfo(text: string) {
    await ToastNative.show({
      text: `ℹ️ ${text}`,
      duration: 'short',
    });
  }
}