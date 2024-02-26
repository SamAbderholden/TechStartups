import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const FooterButtons = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateOrReplace = (screenName) => {
    if (route.name !== screenName) {
      navigation.replace(screenName, { username: route.params.username });
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Home')}>
        <FontAwesome name="home" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Create')}>
        <FontAwesome name="plus" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Profile')}>
        <FontAwesome name="user" size={35} color="black" />
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
      height: 60,
      paddingBottom: 26,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  