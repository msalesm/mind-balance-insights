import { WebPlugin } from '@capacitor/core';
import type { AppleWatchPlugin } from './AppleWatch';

export class AppleWatchWeb extends WebPlugin implements AppleWatchPlugin {
  async sendMessage(): Promise<{ success: boolean }> {
    console.log('Apple Watch not available on web');
    return { success: false };
  }

  async isWatchAppInstalled(): Promise<{ installed: boolean }> {
    return { installed: false };
  }

  async isReachable(): Promise<{ reachable: boolean }> {
    return { reachable: false };
  }

  async startHeartRateMonitoring(): Promise<{ success: boolean }> {
    return { success: false };
  }

  async stopHeartRateMonitoring(): Promise<{ success: boolean }> {
    return { success: false };
  }

  async showBreathingReminder(): Promise<{ success: boolean }> {
    return { success: false };
  }

  async logMood(): Promise<{ success: boolean }> {
    return { success: false };
  }
}