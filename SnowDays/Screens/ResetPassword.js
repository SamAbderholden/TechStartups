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
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Back to Login</Text>
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
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
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

