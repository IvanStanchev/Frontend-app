import {StyleSheet, Text, View, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';


function Settings() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.setItem('World');
        await AsyncStorage.removeItem('lastname');
        await AsyncStorage.removeItem('email');
        navigation.navigate('Welcome');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <ScrollView >
                
                <Button title="Logout" onPress={handleLogout}/>
                
            </ScrollView>
        </View>
    )
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'space-around',
    },
    heading: {
        fontFamily: 'press-start',
        fontSize: 30,
        lineHeight: 50,
        textAlign: 'center',
        marginVertical: 40,
        borderBottomColor: 'black',
        borderBottomWidth: 5,
    },
});