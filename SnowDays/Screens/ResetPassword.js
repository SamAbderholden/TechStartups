import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../firebase.js';
import { sendPasswordResetEmail } from 'firebase/auth';
const ResetPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();

    const handleResetPassword = () => {
        sendPasswordResetEmail(auth,email)
            .then(() => {
                alert('Password reset email sent, sometimes this email can take a little while.');
                navigation.navigate('Login');
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Mines Email"
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: 'white'}}>Back to Login</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 25,
        color: 'white'
    },
    input: {
        width: '60%', // Full width of the login container
        margin: 7,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 11,
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#fff', // Input background color
    },
    button: {
        marginTop: 6, // Space on top of the button
        marginBottom: 5,
        backgroundColor: '#0173f9', // Button background color
        padding: 13,
        borderRadius: 5,
        width: '35%', // Adjust according to the design
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default ResetPasswordScreen;

