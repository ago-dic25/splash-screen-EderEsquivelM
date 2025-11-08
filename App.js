import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  // Estados
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [foto, setFoto] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  //  Solicita permisos
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos", "Se necesitan permisos para guardar fotos.");
      }
      await requestPermission();
    })();

    //  Simula pantalla splash 3 segundos
    const timer = setTimeout(() => setIsSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  //  Splash screen con gradiente e imagen
  if (isSplashVisible) {
    return (
      <LinearGradient
        colors={["#ff9966", "#ff5e62"]} // Gradiente naranja-rojo
        style={styles.splashContainer}
      >
        <Image
          source={require("./assets/splash.png")}
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>Bienvenido al visor de cámara</Text>
      </LinearGradient>
    );
  }

  //  Verificación de permisos de cámara
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No se concedieron permisos para la cámara.</Text>
        <Button title="Conceder permisos" onPress={requestPermission} />
      </View>
    );
  }

  //  Toma y guarda la foto
  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const fotoData = await cameraRef.current.takePictureAsync();
        setFoto(fotoData.uri);
        console.log("📸 Foto tomada:", fotoData.uri);

        await MediaLibrary.saveToLibraryAsync(fotoData.uri);
        Alert.alert("Éxito", "📷 Foto guardada en la galería.");
      } catch (error) {
        console.log("❌ Error al tomar la foto:", error);
        Alert.alert("Error", "No se pudo tomar la foto.");
      }
    }
  };

  //  Pantalla principal
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  // Pantalla splash
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  //  Cámara
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    backgroundColor: "#000",
  },
  camera: {
    width: "90%",
    height: 400,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
});
