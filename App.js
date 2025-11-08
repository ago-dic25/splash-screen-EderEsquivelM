import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Platform, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [foto, setFoto] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      await requestPermission();
    })();

    // Muestra el splash 3 segundos
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 🔹 Pantalla splash
  if (isSplashVisible) {
    return (
      <LinearGradient
        colors={["#ff9966", "#ff5e62"]} // Gradiente naranja/rojo
        style={styles.splashContainer}
      >
        {/* Puedes mostrar tu imagen splash.png aquí */}
        <Image
          source={require("./assets/splash.png")}
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>Bienvenido al visor de cámara</Text>
      </LinearGradient>
    );
  }

  // 🔹 Estado de permisos
  if (!permission) {
    return <Text>Cargando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No hay permisos de cámara</Text>
        <Button title="Permitir cámara" onPress={requestPermission} />
      </View>
    );
  }

  // 🔹 Función para tomar foto
  const tomarFoto = async () => {
    if (cameraRef) {
      try {
        const fotoTomada = await cameraRef.takePictureAsync();
        setFoto(fotoTomada.uri);
        console.log("📸 Foto tomada:", fotoTomada.uri);
      } catch (error) {
        console.log("❌ Error al tomar foto:", error);
      }
    }
  };

  // 🔹 Interfaz principal
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={setCameraRef} />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
  },
});
