import Foundation
import Capacitor
import HealthKit

@objc(HealthKitPlugin)
public class HealthKitPlugin: CAPPlugin {
    private let healthStore = HKHealthStore()
    
    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard let permissions = call.getArray("permissions", String.self) else {
            call.reject("Missing permissions parameter")
            return
        }
        
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit not available on this device")
            return
        }
        
        let readTypes: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        ]
        
        let writeTypes: Set<HKSampleType> = [
            HKObjectType.workoutType()
        ]
        
        healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { success, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Authorization failed", error.localizedDescription)
                } else {
                    call.resolve(["granted": success])
                }
            }
        }
    }
    
    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }
    
    @objc func readHeartRate(_ call: CAPPluginCall) {
        guard let startDateString = call.getString("startDate"),
              let endDateString = call.getString("endDate") else {
            call.reject("Missing date parameters")
            return
        }
        
        let formatter = ISO8601DateFormatter()
        guard let startDate = formatter.date(from: startDateString),
              let endDate = formatter.date(from: endDateString) else {
            call.reject("Invalid date format")
            return
        }
        
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            call.reject("Heart rate type not available")
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: heartRateType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
            
            if let error = error {
                call.reject("Failed to read heart rate", error.localizedDescription)
                return
            }
            
            var heartRateSamples: [[String: Any]] = []
            
            if let samples = samples as? [HKQuantitySample] {
                for sample in samples {
                    let heartRateUnit = HKUnit(from: "count/min")
                    let value = sample.quantity.doubleValue(for: heartRateUnit)
                    
                    heartRateSamples.append([
                        "value": value,
                        "date": formatter.string(from: sample.startDate),
                        "source": sample.sourceRevision.source.name
                    ])
                }
            }
            
            DispatchQueue.main.async {
                call.resolve(["samples": heartRateSamples])
            }
        }
        
        healthStore.execute(query)
    }
    
    @objc func readSteps(_ call: CAPPluginCall) {
        guard let startDateString = call.getString("startDate"),
              let endDateString = call.getString("endDate") else {
            call.reject("Missing date parameters")
            return
        }
        
        let formatter = ISO8601DateFormatter()
        guard let startDate = formatter.date(from: startDateString),
              let endDate = formatter.date(from: endDateString) else {
            call.reject("Invalid date format")
            return
        }
        
        guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            call.reject("Step count type not available")
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: stepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
            
            if let error = error {
                call.reject("Failed to read steps", error.localizedDescription)
                return
            }
            
            var stepSamples: [[String: Any]] = []
            
            if let samples = samples as? [HKQuantitySample] {
                for sample in samples {
                    let value = sample.quantity.doubleValue(for: HKUnit.count())
                    
                    stepSamples.append([
                        "value": value,
                        "date": formatter.string(from: sample.startDate),
                        "source": sample.sourceRevision.source.name
                    ])
                }
            }
            
            DispatchQueue.main.async {
                call.resolve(["samples": stepSamples])
            }
        }
        
        healthStore.execute(query)
    }
    
    @objc func readSleep(_ call: CAPPluginCall) {
        guard let startDateString = call.getString("startDate"),
              let endDateString = call.getString("endDate") else {
            call.reject("Missing date parameters")
            return
        }
        
        let formatter = ISO8601DateFormatter()
        guard let startDate = formatter.date(from: startDateString),
              let endDate = formatter.date(from: endDateString) else {
            call.reject("Invalid date format")
            return
        }
        
        guard let sleepType = HKCategoryType.categoryType(forIdentifier: .sleepAnalysis) else {
            call.reject("Sleep analysis type not available")
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
            
            if let error = error {
                call.reject("Failed to read sleep", error.localizedDescription)
                return
            }
            
            var sleepSamples: [[String: Any]] = []
            
            if let samples = samples as? [HKCategorySample] {
                for sample in samples {
                    let duration = sample.endDate.timeIntervalSince(sample.startDate) / 60 // Convert to minutes
                    
                    sleepSamples.append([
                        "value": duration,
                        "startDate": formatter.string(from: sample.startDate),
                        "endDate": formatter.string(from: sample.endDate),
                        "source": sample.sourceRevision.source.name
                    ])
                }
            }
            
            DispatchQueue.main.async {
                call.resolve(["samples": sleepSamples])
            }
        }
        
        healthStore.execute(query)
    }
    
    @objc func writeWorkout(_ call: CAPPluginCall) {
        guard let type = call.getString("type"),
              let startDateString = call.getString("startDate"),
              let endDateString = call.getString("endDate"),
              let calories = call.getDouble("calories") else {
            call.reject("Missing workout parameters")
            return
        }
        
        let formatter = ISO8601DateFormatter()
        guard let startDate = formatter.date(from: startDateString),
              let endDate = formatter.date(from: endDateString) else {
            call.reject("Invalid date format")
            return
        }
        
        let workoutType: HKWorkoutActivityType
        switch type.lowercased() {
        case "walking":
            workoutType = .walking
        case "running":
            workoutType = .running
        case "yoga":
            workoutType = .yoga
        case "meditation":
            workoutType = .mindAndBody
        default:
            workoutType = .other
        }
        
        let workout = HKWorkout(activityType: workoutType,
                               start: startDate,
                               end: endDate,
                               duration: endDate.timeIntervalSince(startDate),
                               totalEnergyBurned: HKQuantity(unit: .kilocalorie(), doubleValue: calories),
                               totalDistance: nil,
                               metadata: nil)
        
        healthStore.save(workout) { success, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to save workout", error.localizedDescription)
                } else {
                    call.resolve(["success": success])
                }
            }
        }
    }
}