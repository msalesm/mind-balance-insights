import { registerPlugin } from '@capacitor/core';

export interface HealthKitPlugin {
  requestAuthorization(options: { permissions: string[] }): Promise<{ granted: boolean }>;
  isAvailable(): Promise<{ available: boolean }>;
  readHeartRate(options: { startDate: string; endDate: string }): Promise<{ samples: HeartRateSample[] }>;
  readSteps(options: { startDate: string; endDate: string }): Promise<{ samples: StepSample[] }>;
  readSleep(options: { startDate: string; endDate: string }): Promise<{ samples: SleepSample[] }>;
  writeWorkout(options: { type: string; startDate: string; endDate: string; calories: number }): Promise<{ success: boolean }>;
}

export interface HeartRateSample {
  value: number;
  date: string;
  source: string;
}

export interface StepSample {
  value: number;
  date: string;
  source: string;
}

export interface SleepSample {
  value: number; // duration in minutes
  startDate: string;
  endDate: string;
  source: string;
}

const HealthKit = registerPlugin<HealthKitPlugin>('HealthKit', {
  web: () => import('./HealthKit.web').then(m => new m.HealthKitWeb()),
});

export { HealthKit };