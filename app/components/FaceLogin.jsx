import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Image, Platform, StyleSheet, View } from "react-native";

export default function FaceLogin({ onSuccess }) {
    const [image, setImage] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permiso requerido", "Se necesita acceso a tus fotos");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleLogin = async () => {
        if (!image) {
            Alert.alert("Selecciona una foto primero");
            return;
        }

        setLoading(true);
        let fileToSend;
        if (Platform.OS === "web") {
            // Convertir la uri a un File usando fetch y Blob
            const response = await fetch(image.uri);
            const blob = await response.blob();
            fileToSend = new File([blob], "face.jpg", { type: blob.type || "image/jpeg" });
        } else {
            fileToSend = {
                uri: image.uri,
                name: "face.jpg",
                type: "image/jpeg",
            };
        }
        const formData = new FormData();
        formData.append("image", fileToSend);
        try {
            const res = await fetch("https://52ve8mm1q0ra.share.zrok.io/recognize", {
                method: "POST",
                body: formData,
                headers: { "skip_zrok_interstitial": "true" },
            });
            let data = null;
            let text = null;
            try {
                data = await res.json();
                console.log(data.matches)
                router.replace({
                    pathname: "/screens/Dashboard",
                    params: { matches: data.matches },
                });
            } catch (jsonErr) {
                text = await res.text();
            }
        setLoading(false);
        if (data && data.success && data.cuil) {
            onSuccess(data.cuil);
        } else if (text && text.toLowerCase().includes("reconocido correctamente")) {
            // Extraer CUIL si está en el texto
            const cuilMatch = text.match(/CUIL\s*"?(\d{8,})"?/i);
            const cuil = cuilMatch ? cuilMatch[1] : undefined;
            if (cuil) onSuccess(cuil);
        }
    } catch (e) {
        setLoading(false);
        Alert.alert("Error de red", e.message);
    }
};


return (
    <View style={styles.container}>
        <Button title="Subir imagen" onPress={pickImage} />
        {image && (
            <Image source={{ uri: image.uri }} style={styles.image} />
        )}
        {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
        ) : (
            <Button title="Ingresar con rostro" onPress={handleLogin} />
        )}
    </View>
);
}

const styles = StyleSheet.create({
    container: { alignItems: "center", padding: 20 },
    image: { width: 200, height: 200, marginVertical: 20, borderRadius: 10 },
});
