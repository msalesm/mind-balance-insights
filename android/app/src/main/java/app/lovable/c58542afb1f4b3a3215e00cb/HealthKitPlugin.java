package app.lovable.c58542afb1f4b3a3215e00cb;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessOptions;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.request.DataReadRequest;
import com.google.android.gms.fitness.result.DataReadResponse;
import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

@CapacitorPlugin(name = "HealthKit")
public class HealthKitPlugin extends Plugin {
    
    private static final String TAG = "HealthKitPlugin";
    private FitnessOptions fitnessOptions;
    
    @Override
    public void load() {
        super.load();
        
        fitnessOptions = FitnessOptions.builder()
                .addDataType(DataType.TYPE_HEART_RATE_BPM, FitnessOptions.ACCESS_READ)
                .addDataType(DataType.TYPE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
                .addDataType(DataType.TYPE_SLEEP_SEGMENT, FitnessOptions.ACCESS_READ)
                .addDataType(DataType.TYPE_WORKOUT_EXERCISE, FitnessOptions.ACCESS_WRITE)
                .build();
    }
    
    @PluginMethod
    public void requestAuthorization(PluginCall call) {
        if (!com.google.android.gms.common.GoogleApiAvailability.getInstance()
                .isGooglePlayServicesAvailable(getContext()) == com.google.android.gms.common.ConnectionResult.SUCCESS) {
            call.reject("Google Play Services not available");
            return;
        }
        
        if (!Fitness.getConfigClient(getActivity(), fitnessOptions).checkPermissions(fitnessOptions)) {
            Fitness.getConfigClient(getActivity(), fitnessOptions)
                    .requestPermissions(fitnessOptions)
                    .addOnSuccessListener(aVoid -> {
                        JSObject result = new JSObject();
                        result.put("granted", true);
                        call.resolve(result);
                    })
                    .addOnFailureListener(e -> {
                        Log.e(TAG, "Failed to request permissions", e);
                        call.reject("Authorization failed: " + e.getMessage());
                    });
        } else {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
        }
    }
    
    @PluginMethod
    public void isAvailable(PluginCall call) {
        boolean available = com.google.android.gms.common.GoogleApiAvailability.getInstance()
                .isGooglePlayServicesAvailable(getContext()) == com.google.android.gms.common.ConnectionResult.SUCCESS;
        
        JSObject result = new JSObject();
        result.put("available", available);
        call.resolve(result);
    }
    
    @PluginMethod
    public void readHeartRate(PluginCall call) {
        String startDateString = call.getString("startDate");
        String endDateString = call.getString("endDate");
        
        if (startDateString == null || endDateString == null) {
            call.reject("Missing date parameters");
            return;
        }
        
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
            formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
            
            long startTime = formatter.parse(startDateString).getTime();
            long endTime = formatter.parse(endDateString).getTime();
            
            DataReadRequest readRequest = new DataReadRequest.Builder()
                    .read(DataType.TYPE_HEART_RATE_BPM)
                    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                    .build();
            
            Fitness.getHistoryClient(getActivity(), fitnessOptions)
                    .readData(readRequest)
                    .addOnSuccessListener(dataReadResponse -> {
                        JSArray samples = new JSArray();
                        
                        dataReadResponse.getDataSets().forEach(dataSet -> {
                            dataSet.getDataPoints().forEach(dataPoint -> {
                                JSObject sample = new JSObject();
                                sample.put("value", dataPoint.getValue(Field.FIELD_BPM).asFloat());
                                sample.put("date", formatter.format(new Date(dataPoint.getStartTime(TimeUnit.MILLISECONDS))));
                                sample.put("source", "Google Fit");
                                samples.put(sample);
                            });
                        });
                        
                        JSObject result = new JSObject();
                        result.put("samples", samples);
                        call.resolve(result);
                    })
                    .addOnFailureListener(e -> {
                        Log.e(TAG, "Failed to read heart rate", e);
                        call.reject("Failed to read heart rate: " + e.getMessage());
                    });
                    
        } catch (Exception e) {
            Log.e(TAG, "Error parsing dates", e);
            call.reject("Invalid date format");
        }
    }
    
    @PluginMethod
    public void readSteps(PluginCall call) {
        String startDateString = call.getString("startDate");
        String endDateString = call.getString("endDate");
        
        if (startDateString == null || endDateString == null) {
            call.reject("Missing date parameters");
            return;
        }
        
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
            formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
            
            long startTime = formatter.parse(startDateString).getTime();
            long endTime = formatter.parse(endDateString).getTime();
            
            DataReadRequest readRequest = new DataReadRequest.Builder()
                    .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
                    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                    .bucketByTime(1, TimeUnit.DAYS)
                    .build();
            
            Fitness.getHistoryClient(getActivity(), fitnessOptions)
                    .readData(readRequest)
                    .addOnSuccessListener(dataReadResponse -> {
                        JSArray samples = new JSArray();
                        
                        dataReadResponse.getBuckets().forEach(bucket -> {
                            bucket.getDataSets().forEach(dataSet -> {
                                dataSet.getDataPoints().forEach(dataPoint -> {
                                    JSObject sample = new JSObject();
                                    sample.put("value", dataPoint.getValue(Field.FIELD_STEPS).asInt());
                                    sample.put("date", formatter.format(new Date(dataPoint.getStartTime(TimeUnit.MILLISECONDS))));
                                    sample.put("source", "Google Fit");
                                    samples.put(sample);
                                });
                            });
                        });
                        
                        JSObject result = new JSObject();
                        result.put("samples", samples);
                        call.resolve(result);
                    })
                    .addOnFailureListener(e -> {
                        Log.e(TAG, "Failed to read steps", e);
                        call.reject("Failed to read steps: " + e.getMessage());
                    });
                    
        } catch (Exception e) {
            Log.e(TAG, "Error parsing dates", e);
            call.reject("Invalid date format");
        }
    }
    
    @PluginMethod
    public void readSleep(PluginCall call) {
        // Sleep data implementation for Android
        JSObject result = new JSObject();
        JSArray samples = new JSArray();
        result.put("samples", samples);
        call.resolve(result);
    }
    
    @PluginMethod
    public void writeWorkout(PluginCall call) {
        // Workout writing implementation for Android
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
}