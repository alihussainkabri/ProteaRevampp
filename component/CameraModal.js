import React, { useRef, useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { RNCamera } from "react-native-camera";

const CameraModal = ({modalVisible,setModalVisible,capturePunchImage}) => {
  const cameraRef = useRef()

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: false };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log("Photo taken: ", data);
      capturePunchImage(modalVisible?.operation,data)
      setModalVisible({
        show : false,
        operation : null
      })
    }
  };

  return (
    <View style={styles.container}>
      
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible?.show}
        onRequestClose={() => setModalVisible({
            show : false,
            operation : null
        })}
      >
        <View style={styles.modalContainer}>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false} // Set to false if audio is not needed
          />

          
          <TouchableOpacity style={styles.capture} onPress={takePicture}>
          </TouchableOpacity>

          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible({
                show : false,
                operation : null
            })}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center",position : 'relative' },
  openButton: {
    backgroundColor: "#008CBA",
    padding: 15,
    borderRadius: 5,
  },
  modalContainer: { flex: 1, justifyContent: "center" },
  preview: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  capture: {
    backgroundColor: "#fff",
    width : 100,
    height : 100,
    borderColor : 'black',
    borderWidth : 3,
    borderRadius : 100,
    position : 'absolute',
    bottom : 50,
    left : '35%'
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default CameraModal;
