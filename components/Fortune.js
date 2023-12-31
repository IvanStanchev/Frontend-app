import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fortune_random, fortune_history_last} from './api/fortune_api';
import Animation from './animations/Animation';
import StyleManager from './animations/styles/StyleManager';
import { checkTokenExpiration } from './auth/authUtils';
import {isToday} from "./dateTime/DateTimeUtils";
import TabBar from './TabBar';


function Fortune() {
  const navigation = useNavigation();
  const [fortune, setFortune] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [theme, setTheme] = useState(null);
  const [styles, setStyles] = useState(StyleManager({theme: theme}));
  
  useEffect(() => {
    handleTokenExpiration();
  }, []);

  useEffect(() => {
    setStyles(StyleManager({ theme: theme }));
  }, [theme]);
  
  const fetchHistory = async () => {
    navigation.navigate("History")
  }

  const handleTokenExpiration = async () => {
    const isTokenValid = await checkTokenExpiration();

    if (!isTokenValid) {
        navigation.navigate('Welcome');
    }};
    

    const fetchFortune = async () => {
      const token = await AsyncStorage.getItem('token');
      
      let lastReceivedDate = null;
      let lastFortune = null;
    
      const responseFromApi = await fortune_history_last(token);
      if (responseFromApi && responseFromApi[0]) {
        lastReceivedDate = new Date(responseFromApi[0].date);
        lastFortune = responseFromApi[0];
    
        await AsyncStorage.setItem('lastReceivedDate', lastReceivedDate.getTime().toString());
        await AsyncStorage.setItem('lastFortune', JSON.stringify(lastFortune));
      } else {

        let storedLastReceivedDate = await AsyncStorage.getItem('lastReceivedDate');
        let storedLastFortune = await AsyncStorage.getItem('lastFortune');
    
        lastFortune = storedLastFortune ? JSON.parse(storedLastFortune) : null;
        lastReceivedDate = storedLastReceivedDate ? new Date(Number(storedLastReceivedDate)) : null;
      }
    
      let response = null;
      if (lastReceivedDate && isToday(lastReceivedDate)) {
        console.log('You already received a fortune today!');
        response = lastFortune;
      }
      else {
        response = await fortune_random(token);
        if (response) {
          await AsyncStorage.setItem('lastReceivedDate', (Date.now()).toString());
          await AsyncStorage.setItem('lastFortune', JSON.stringify(response));
        }
      }
    
      if (response) {
        setAnimation(true);
        setTheme(response.theme);
        setFortune(response.wish);
        setTimeout(() => {
          setAnimation(false);
        }, 3500);
      }
    };
    
    

  return (
    <View style={styles.container}>
      {fortune ? (
        animation ? 
          <Animation theme={theme}/> 
          :
        <TouchableOpacity onPress={fetchFortune}>
        <Text style={styles.text}>{fortune}</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity onPress={fetchFortune}>
            <Text style={styles.question}>?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchHistory}>
            <Text style={StyleSheet.compose(styles.text, {paddingTop:100})}>history</Text>
          </TouchableOpacity>
        </View>
      )}
      {!animation && <TabBar/>}
    </View>
  );
};



export default Fortune;
