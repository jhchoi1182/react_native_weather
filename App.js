import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { StyleSheet, Dimensions, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: ScreenWidth } = Dimensions.get('window');
const API_KEY = '050d4b026cee0fc9716845267b7b107c'
const icons = {
  Clouds: "weather-cloudy",
  Clear: "weather-sunny"
}

export default function App() {
  const [city, setCity] = useState("로딩중...")
  const [days, setDays] = useState({})
  const [ok, setOk] = useState(true)

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync()
    if (!granted) {
      setOk(false)
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json()
    setDays([json])
  }

  useEffect(() => {
    getWeather()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? <View style={styles.day}><ActivityIndicator size="large" /></View> :
          <View style={styles.day}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Text style={styles.temperature}>{parseFloat(days[0]?.main?.temp).toFixed(1)}도</Text>
              <MaterialCommunityIcons name={icons[days[0]?.weather[0]?.main]} size={54} color="black" />
            </View>
            <Text style={styles.description}>{days[0]?.weather[0]?.main}</Text>
          </View>
        }
      </ScrollView >
      <StatusBar style="light" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: 700
  },
  weather: {
    // children 숫자만큼 크기가 커야하므로 ScrollView는 flex를 지정해주지 않음
  },
  day: {
    width: ScreenWidth,
    alignItems: "center",
  },
  temperature: {
    marginTop: 50,
    fontSize: 80
  },
  description: {
    marginTop: -10,
    fontSize: 50
  }
});