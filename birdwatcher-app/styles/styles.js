import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 15,
    elevation: 4,
    backgroundColor: 'white',
  },
  image: {
    height: 200,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  registerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '80%',
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  registerBirdButton: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  registerBirdButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  notes: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  date: {
    marginTop: 10,
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
  },
  audioButton: {
    margin: 0,
    backgroundColor: '#e3f2fd',
  },
  audioText: {
    marginLeft: 8,
    color: '#2196F3',
    fontSize: 14,
  },
  locationContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  location: {
    marginTop: 5,
    fontSize: 14,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});