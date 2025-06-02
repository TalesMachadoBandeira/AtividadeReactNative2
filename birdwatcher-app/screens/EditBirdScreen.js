import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import styles from '../styles/styles';

const API_URL = 'http://192.168.0.48:3000';

export default function EditBirdScreen({ route, navigation }) {
  const { bird } = route.params;
  const [species, setSpecies] = useState(bird.species || '');
  const [description, setDescription] = useState(bird.description || '');
  const [notes, setNotes] = useState(bird.notes || '');
  const [photo, setPhoto] = useState(bird.photo ? { uri: `${API_URL}/${bird.photo}` } : null);
  const [audio, setAudio] = useState(bird.audio ? { uri: `${API_URL}/${bird.audio}`, type: 'audio/m4a', name: 'recording.m4a' } : null);
  const [loading, setLoading] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [location, setLocation] = useState(bird.latitude && bird.longitude ? { latitude: bird.latitude, longitude: bird.longitude } : null);
  const [city, setCity] = useState(bird.city || '');
  const [country, setCountry] = useState(bird.country || '');
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        
        setHasAudioPermission(audioStatus === 'granted');
        
        if (cameraStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'É necessário permitir o acesso à câmera para tirar fotos.');
        }

        if (locationStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'É necessário permitir o acesso à localização para registrar onde o pássaro foi avistado.');
        }
      } catch (error) {
        console.error('Erro ao solicitar permissões:', error);
        Alert.alert('Erro', 'Não foi possível acessar o microfone, a câmera ou a localização');
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permitir o acesso à localização para registrar onde o pássaro foi avistado.');
        return;
      }

      setLocationLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      setLocation(location.coords);

      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const cityName = address.city || 
                        address.subregion || 
                        address.region || 
                        'Cidade não identificada';
        
        const countryName = address.country || 'País não identificado';
        
        setCity(cityName);
        setCountry(countryName);
      } else {
        setCity('Cidade não identificada');
        setCountry('País não identificado');
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização atual');
      setCity('Cidade não identificada');
      setCountry('País não identificado');
    } finally {
      setLocationLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      Alert.alert('Erro', 'Não foi possível capturar a foto');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudio({ uri, type: 'audio/m4a', name: 'recording.m4a' });
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível parar a gravação');
    }
  };

  const handleSubmit = async () => {
    if (!species) {
      alert('Por favor, preencha a espécie do pássaro');
      return;
    }

    if (!location) {
      alert('Não foi possível obter sua localização. Por favor, verifique as permissões de localização.');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append('species', species);
    formData.append('description', description);
    formData.append('notes', notes);
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    formData.append('city', city);
    formData.append('country', country);

    // Só anexa a foto se ela foi alterada (tem uma nova URI)
    if (photo && photo.uri && !photo.uri.includes(API_URL)) {
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
    }

    // Só anexa o áudio se ele foi alterado (tem uma nova URI)
    if (audio && audio.uri && !audio.uri.includes(API_URL)) {
      formData.append('audio', {
        uri: audio.uri,
        type: audio.type,
        name: audio.name,
      });
    }

    try {
      const response = await fetch(`${API_URL}/birds/${bird._id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Pássaro atualizado com sucesso');
        navigation.goBack();
      } else {
        alert('Erro ao atualizar o pássaro');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar o pássaro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Espécie"
        value={species}
        onChangeText={setSpecies}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />
      <TextInput
        label="Observações"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          {locationLoading 
            ? 'Obtendo localização...' 
            : location 
              ? `Localização: ${city}, ${country}`
              : 'Clique no botão para obter a localização'}
        </Text>
        <Button
          mode="outlined"
          onPress={getCurrentLocation}
          style={styles.input}
          icon="map-marker"
          loading={locationLoading}
          disabled={locationLoading}
        >
          {location ? 'Atualizar Localização' : 'Obter Localização'}
        </Button>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <Button
          mode="outlined"
          onPress={takePhoto}
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          icon="camera"
        >
          Abrir Câmera
        </Button>

        <Button
          mode="outlined"
          onPress={pickImage}
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
          icon="image"
        >
          Selecionar da Galeria
        </Button>
      </View>

      {photo && (
        <View style={{ marginBottom: 15 }}>
          <Image
            source={{ uri: photo.uri }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 8,
              marginBottom: 10
            }}
            resizeMode="cover"
          />
          <Button
            mode="outlined"
            onPress={() => setPhoto(null)}
            style={styles.input}
            icon="delete"
          >
            Remover Foto
          </Button>
        </View>
      )}

      <Button
        mode="outlined"
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.input}
        icon={isRecording ? "stop" : "microphone"}
      >
        {isRecording ? 'Parar Gravação' : 'Gravar Canto'}
      </Button>

      {audio && !isRecording && (
        <Button
          mode="outlined"
          onPress={() => setAudio(null)}
          style={styles.input}
          icon="delete"
        >
          Remover Áudio
        </Button>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.registerBirdButton}
        labelStyle={styles.registerBirdButtonLabel}
        loading={loading}
        disabled={loading}
      >
        Salvar Alterações
      </Button>
    </ScrollView>
  );
} 