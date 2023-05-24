import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import Slider from '@react-native-community/slider';
import firebaseConfig from './firebaseConfig';
import GaugeChart from './GaugeChart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [json, setJson] = useState({});
  const [lampMode, setLampMode] = useState('');
  const [lampValue, setLampValue] = useState(0);
  const [fanMode, setFanMode] = useState('');
  const [fanValue, setFanValue] = useState(0);
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [relay, setRelay] = useState(false);

  useEffect(() => {
    onValue(ref(database, '/'), (snapshot) => setJson(snapshot.val()));
  }, []);

  useEffect(() => {
    setLampMode(json.lamp_mode);
    setLampValue(json.lamp_brightness);
    setFanMode(json.fan_mode);
    setFanValue(json.fan_speed);
    setTemp(json.temperature);
    setHumidity(json.humidity);
    setRelay(json.relay);
  }, [json]);

  const updateLampMode = (newMode) => set(ref(database, 'lamp_mode'), newMode);
  const handleLampValueChange = (value) => set(ref(database, 'lamp_brightness'), value);
  const updateFanMode = (newMode) => set(ref(database, 'fan_mode'), newMode);
  const handleFanValueChange = (value) => set(ref(database, 'fan_speed'), value);
  const updateRelay = () => set(ref(database, 'relay'), !relay);

  const changeLampMode = () => {
    if (lampMode === 'off') {
      updateLampMode('manual');
    } else if (lampMode === 'manual') {
      updateLampMode('auto');
    } else {
      updateLampMode('off');
    }
  };

  const changeFanMode = () => {
    if (fanMode === 'off') {
      updateFanMode('manual');
    } else if (fanMode === 'manual') {
      updateFanMode('auto');
    } else {
      updateFanMode('off');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.charts}>
        <GaugeChart meter={temp} max={60} unit="°C" title={'Temperature'} />
        <GaugeChart meter={humidity} title={'Humidity'} />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.controlGroup}>
          <Text style={styles.buttonText}>
            Lamp:{' '}
            {lampMode && (
              <Text style={styles.buttonTextBold}>
                {lampMode.charAt(0).toUpperCase() + lampMode.slice(1)}
              </Text>
            )}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => changeLampMode()}>
            <Icon style={styles.icon} name="lightbulb" size={50} color="#3d5875" />
          </TouchableOpacity>
          <Slider
            disabled={lampMode !== 'manual'}
            style={{
              width: '100%',
            }}
            minimumValue={0}
            maximumValue={255}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#B0BEC5"
            thumbTintColor="#1EB1FC"
            value={lampValue}
            step={1}
            onValueChange={handleLampValueChange}
          />
        </View>
        <View style={styles.controlGroup}>
          <Text style={styles.buttonText}>
            Fan:{' '}
            {fanMode && (
              <Text style={styles.buttonTextBold}>
                {fanMode.charAt(0).toUpperCase() + fanMode.slice(1)}
              </Text>
            )}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => changeFanMode()}>
            <Icon2 style={styles.icon} name="fan" size={50} color="#3d5875" />
          </TouchableOpacity>
          <Slider
            disabled={fanMode !== 'manual'}
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#B0BEC5"
            thumbTintColor="#1EB1FC"
            value={fanValue}
            step={1}
            onValueChange={handleFanValueChange}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.controlGroup}>
          <TouchableOpacity style={styles.button} onPress={() => updateRelay()}>
            <Text style={styles.buttonText}>Relay</Text>
            <Text style={styles.buttonTextBig}>{relay ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
    padding: 10,
  },
  charts: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  controlGroup: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    gap: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    maxWidth: '50%',
  },
  button: {
    // alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  buttonTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextBig: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
