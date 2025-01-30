import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';

import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
    const [facing, setFacing] = useState<CameraType>("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [isButtonShown, setIsButtonShown] = useState<boolean>(true);
    const [isCameraShown, setIsCameraShown] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    function onButtonPress() {
        setIsButtonShown(false);
        setIsCameraShown(true);
        setSelectedImage(null);
    }

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setIsButtonShown(false);
            setIsCameraShown(false);
        }
    }

    return (
        <View style={styles.container}>
            {isButtonShown && (
                <Ionicons name="camera-outline" size={48} color="#000" onPress={onButtonPress} />
            )}
            {isButtonShown && (
                <Ionicons name="image-outline" size={48} color="#000" onPress={pickImage} />
            )}
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
            {isCameraShown && (
                <CameraView style={styles.camera} facing={facing}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        borderRadius: 10,
    },
});
