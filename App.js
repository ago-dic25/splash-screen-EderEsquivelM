import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";

SplashScreen.preventAutoHideAsync(); // 👈 Evita que el splash desaparezca automáticamente

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true); // controla si se muestra el splash
  const [foto, setFoto] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Permisos
  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      await requestPermission();
    })();
  }, []);

  // Controla cuánto dura el splash (3 segundos)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSplashVisible(false);
      await SplashScreen.hideAsync(); // oculta el splash nativo
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Si todavía está el splash, mostramos la pantalla de gradiente
  if (isSplashVisible) {
    return (
      <LinearGradient
        colors={["#6a11cb", "#2575fc"]} // 🎨 gradiente morado-azul
        style={styles.splashContainer}
      >
        <Text style={styles.splashText}>Cargando aplicación...</Text>
      </LinearGradient>
    );
  }

  // Si aún no se han cargado los permisos
  if (!permission) {
    return <Text>Cargando permisos...</Text>;
  }

  // Si no hay permisos
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No hay permisos de cámara</Text>
        <Button title="Permitir cámara" onPress={requestPermission} />
      </View>
    );
  }

  // Toma de foto
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

  // Pantalla principal de cámara
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={setCameraRef} />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  // Splash con gradiente
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  splashText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold"
  },

  // Cámara
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    backgroundColor: "#000"
  },
  camera: {
    flex: 1,
    width: "100%",
    aspectRatio: 1
  }
});
