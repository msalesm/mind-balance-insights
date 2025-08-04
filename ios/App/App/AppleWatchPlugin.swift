import Foundation
import Capacitor
import WatchConnectivity

@objc(AppleWatchPlugin)
public class AppleWatchPlugin: CAPPlugin, WCSessionDelegate {
    private var wcSession: WCSession?
    
    override public func load() {
        super.load()
        
        if WCSession.isSupported() {
            wcSession = WCSession.default
            wcSession?.delegate = self
            wcSession?.activate()
        }
    }
    
    @objc func sendMessage(_ call: CAPPluginCall) {
        guard let wcSession = wcSession, wcSession.isReachable else {
            call.reject("Apple Watch not reachable")
            return
        }
        
        guard let data = call.getObject("data") else {
            call.reject("Missing data parameter")
            return
        }
        
        wcSession.sendMessage(data, replyHandler: { reply in
            DispatchQueue.main.async {
                call.resolve(["success": true, "reply": reply])
            }
        }, errorHandler: { error in
            DispatchQueue.main.async {
                call.reject("Failed to send message", error.localizedDescription)
            }
        })
    }
    
    @objc func isWatchAppInstalled(_ call: CAPPluginCall) {
        guard let wcSession = wcSession else {
            call.resolve(["installed": false])
            return
        }
        
        call.resolve(["installed": wcSession.isWatchAppInstalled])
    }
    
    @objc func isReachable(_ call: CAPPluginCall) {
        guard let wcSession = wcSession else {
            call.resolve(["reachable": false])
            return
        }
        
        call.resolve(["reachable": wcSession.isReachable])
    }
    
    @objc func startHeartRateMonitoring(_ call: CAPPluginCall) {
        guard let wcSession = wcSession, wcSession.isReachable else {
            call.reject("Apple Watch not reachable")
            return
        }
        
        let message = ["action": "startHeartRateMonitoring"]
        wcSession.sendMessage(message, replyHandler: { reply in
            DispatchQueue.main.async {
                call.resolve(["success": true])
            }
        }, errorHandler: { error in
            DispatchQueue.main.async {
                call.reject("Failed to start heart rate monitoring", error.localizedDescription)
            }
        })
    }
    
    @objc func stopHeartRateMonitoring(_ call: CAPPluginCall) {
        guard let wcSession = wcSession, wcSession.isReachable else {
            call.reject("Apple Watch not reachable")
            return
        }
        
        let message = ["action": "stopHeartRateMonitoring"]
        wcSession.sendMessage(message, replyHandler: { reply in
            DispatchQueue.main.async {
                call.resolve(["success": true])
            }
        }, errorHandler: { error in
            DispatchQueue.main.async {
                call.reject("Failed to stop heart rate monitoring", error.localizedDescription)
            }
        })
    }
    
    @objc func showBreathingReminder(_ call: CAPPluginCall) {
        guard let wcSession = wcSession, wcSession.isReachable else {
            call.reject("Apple Watch not reachable")
            return
        }
        
        let duration = call.getInt("duration") ?? 60
        let message = ["action": "showBreathingReminder", "duration": duration] as [String : Any]
        
        wcSession.sendMessage(message, replyHandler: { reply in
            DispatchQueue.main.async {
                call.resolve(["success": true])
            }
        }, errorHandler: { error in
            DispatchQueue.main.async {
                call.reject("Failed to show breathing reminder", error.localizedDescription)
            }
        })
    }
    
    @objc func logMood(_ call: CAPPluginCall) {
        guard let wcSession = wcSession, wcSession.isReachable else {
            call.reject("Apple Watch not reachable")
            return
        }
        
        guard let mood = call.getString("mood"),
              let timestamp = call.getString("timestamp") else {
            call.reject("Missing mood or timestamp parameter")
            return
        }
        
        let message = ["action": "logMood", "mood": mood, "timestamp": timestamp]
        wcSession.sendMessage(message, replyHandler: { reply in
            DispatchQueue.main.async {
                call.resolve(["success": true])
            }
        }, errorHandler: { error in
            DispatchQueue.main.async {
                call.reject("Failed to log mood", error.localizedDescription)
            }
        })
    }
    
    // MARK: - WCSessionDelegate
    
    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            print("WCSession activation failed: \(error.localizedDescription)")
        } else {
            print("WCSession activated with state: \(activationState.rawValue)")
        }
    }
    
    public func sessionDidBecomeInactive(_ session: WCSession) {
        print("WCSession became inactive")
    }
    
    public func sessionDidDeactivate(_ session: WCSession) {
        print("WCSession deactivated")
        session.activate()
    }
    
    public func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        // Handle messages from Apple Watch
        DispatchQueue.main.async {
            self.notifyListeners("watchMessage", data: message)
            replyHandler(["received": true])
        }
    }
}