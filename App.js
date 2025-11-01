import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {

  const [foto, setFoto] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      await requestPermission();
    })();
  }, []);

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

  const tomarFoto = async () => {
    if (cameraRef) {
      try {
        const fotoTomada = await cameraRef.takePictureAsync();
        setFoto(fotoTomada.uri);
        console.log("Foto tomada:", fotoTomada.uri);
        // await MediaLibrary.createAssetAsync(fotoTomada.uri);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        facing="back"
        ref={setCameraRef}
      />

      <Button title="Tomar Foto" onPress={tomarFoto} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: '#000'
  },
  camera: {
    flex: 1,
    width: '100%',
    aspectRatio: 1
  }
});
