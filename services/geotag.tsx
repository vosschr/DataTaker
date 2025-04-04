import * as Location from "expo-location";

/**
 * GeoTag Utility Module
 *
 * This module provides functions for handling location permissions,
 * fetching the current location, and managing geo-tagging.
 */

/**
 * Request location permissions from the user.
 *
 * @returns {Promise<boolean>} - True if permissions are granted, false otherwise.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        console.error("Permission to access location was denied");
        return false;
    }
    return true;
};

/**
 * Get the device's current location.
 *
 * @returns {Promise<{ latitude: number, longitude: number } | null>} - The current location or null if an error occurs.
 */
export const getCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
} | null> => {
    try {
        await requestLocationPermission();
        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.error("Error getting location:", error);
        return null;
    }
};
