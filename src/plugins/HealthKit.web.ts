import { WebPlugin } from '@capacitor/core';
import type { HealthKitPlugin } from './HealthKit';

export class HealthKitWeb extends WebPlugin implements HealthKitPlugin {
  async requestAuthorization(): Promise<{ granted: boolean }> {
    console.log('HealthKit not available on web');
    return { granted: false };
  }

  async isAvailable(): Promise<{ available: boolean }> {
    return { available: false };
  }

  async readHeartRate(): Promise<{ samples: any[] }> {
    return { samples: [] };
  }

  async readSteps(): Promise<{ samples: any[] }> {
    return { samples: [] };
  }

  async readSleep(): Promise<{ samples: any[] }> {
    return { samples: [] };
  }

  async writeWorkout(): Promise<{ success: boolean }> {
    return { success: false };
  }
}