import { registerPlugin } from '@capacitor/core';

export interface AppleWatchPlugin {
  sendMessage(options: { data: any }): Promise<{ success: boolean }>;
  isWatchAppInstalled(): Promise<{ installed: boolean }>;
  isReachable(): Promise<{ reachable: boolean }>;
  startHeartRateMonitoring(): Promise<{ success: boolean }>;
  stopHeartRateMonitoring(): Promise<{ success: boolean }>;
  showBreathingReminder(options: { duration: number }): Promise<{ success: boolean }>;
  logMood(options: { mood: string; timestamp: string }): Promise<{ success: boolean }>;
}

const AppleWatch = registerPlugin<AppleWatchPlugin>('AppleWatch', {
  web: () => import('./AppleWatch.web').then(m => new m.AppleWatchWeb()),
});

export { AppleWatch };