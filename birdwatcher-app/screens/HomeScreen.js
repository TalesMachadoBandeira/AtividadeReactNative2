import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, Alert, Text, ScrollView, Image, Linking } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button, IconButton, Portal, Dialog } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import styles from '../styles/styles';

const API_URL = 'http://192.168.0.48:3000';

export default function HomeScreen() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [sound, setSound] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [birdToDelete, setBirdToDelete] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async (audioUrl) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `${API_URL}/${audioUrl}` },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingAudio(audioUrl);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingAudio(null);
        }
      });
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      alert('Erro ao reproduzir o áudio');
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setPlayingAudio(null);
      }
    } catch (error) {
      console.error('Erro ao parar áudio:', error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/birds`);
      if (!res.ok) {
        throw new Error('Erro ao buscar registros');
      }
      const data = await res.json();
      setBirds(data);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Atualiza a lista quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleDeleteBird = async (birdId) => {
    try {
      const response = await fetch(`${API_URL}/birds/${birdId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualiza a lista após a exclusão
        setBirds(birds.filter(bird => bird._id !== birdId));
        Alert.alert('Sucesso', 'Pássaro excluído com sucesso');
      } else {
        Alert.alert('Erro', 'Não foi possível excluir o pássaro');
      }
    } catch (error) {
      console.error('Erro ao excluir pássaro:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar excluir o pássaro');
    }
  };

  const showDeleteConfirmation = (bird) => {
    setBirdToDelete(bird);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (birdToDelete) {
      handleDeleteBird(birdToDelete._id);
    }
    setDeleteDialogVisible(false);
    setBirdToDelete(null);
  };

  const renderBirdCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title>{item.species}</Title>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon="pencil"
              size={24}
              iconColor="#4CAF50"
              onPress={() => navigation.navigate('EditBird', { bird: item })}
              style={{ margin: 0 }}
            />
            <IconButton
              icon="delete"
              size={24}
              iconColor="#ff4444"
              onPress={() => showDeleteConfirmation(item)}
              style={{ margin: 0 }}
            />
          </View>
        </View>
        {item.description && (
          <Paragraph>{item.description}</Paragraph>
        )}
        {item.notes && (
          <Paragraph style={styles.notes}>Observações: {item.notes}</Paragraph>
        )}
        {item.city && item.country && (
          <View style={styles.locationInfo}>
            <IconButton
              icon="map-marker"
              size={20}
              iconColor="#666"
              style={{ margin: 0, marginRight: -8 }}
            />
            <Paragraph style={styles.locationText}>
              {item.city}, {item.country}
            </Paragraph>
          </View>
        )}
        {item.dateObserved && (
          <Paragraph style={styles.date}>
            Registrado em: {new Date(item.dateObserved).toLocaleDateString('pt-BR')}
          </Paragraph>
        )}
        {item.audio && (
          <View style={styles.audioContainer}>
            <IconButton
              icon={playingAudio === item.audio ? "stop" : "play"}
              size={24}
              onPress={() => playingAudio === item.audio ? stopAudio() : playAudio(item.audio)}
              style={styles.audioButton}
              iconColor={playingAudio === item.audio ? "#ff4444" : "#2196F3"}
            />
            <Paragraph style={styles.audioText}>
              {playingAudio === item.audio ? "Parar áudio" : "Reproduzir canto"}
            </Paragraph>
          </View>
        )}
      </Card.Content>
      {item.photo && (
        <Card.Cover 
          source={{ uri: `${API_URL}/${item.photo}` }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={birds}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderBirdCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>
              Nenhum pássaro registrado ainda.
            </Paragraph>
          </View>
        }
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddBird')}
          style={styles.registerButton}
          labelStyle={styles.buttonLabel}
        >
          Registrar Pássaro
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Tem certeza que deseja excluir o registro do pássaro "{birdToDelete?.species}"?
              Esta ação não pode ser desfeita.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={confirmDelete} textColor="#ff4444">Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}