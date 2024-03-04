import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const FooterButtons = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const BUTTON_SIZE = 42;

  const navigateOrReplace = (screenName) => {
    if (route.name !== screenName) {
      navigation.navigate(screenName, { username: route.params.username });
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Home')}>
        <FontAwesome name="home" size={BUTTON_SIZE} color='#0173f9'/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Create')}>
        <FontAwesome name="plus" size={BUTTON_SIZE} color='white'/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Profile')}>
        <FontAwesome name="user" size={BUTTON_SIZE} color='#0173f9' />
      </TouchableOpacity>
    </View>
  );
};



export default FooterButtons;


const styles = StyleSheet.create({
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
      paddingBottom: 26,
      backgroundColor: 'black',
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      //marginTop: 5,
    },
  });
  