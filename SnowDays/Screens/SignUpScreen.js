//make a sign up screen for the app
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH } from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
const IMAGE_PATH = '../StylingImages/Login.png';

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    handleSignUp = async () => {
        setLoading(true);
        const auth = FIREBASE_AUTH;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmail = emailRegex.test(username) && username.endsWith('@mines.edu');

        if (!validEmail) {
            alert('Please enter a valid "@mines.edu" email address.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, username, password);
            console.log(response);
            alert('Your account has been created! Please log in to continue.');
            navigation.navigate('Login');
        } catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                navigation.navigate('Login');
                alert('An account with this email already exists.');
            } else {
                alert('Error signing up');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.inputField}
                placeholder="Mines Email"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
            <TextInput
                style={styles.inputField}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry
            />
            <View style={styles.inputButtonContainer}>
                <TouchableOpacity style={styles.inputButton} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


//styling
const styles = StyleSheet.create({
    //make the background black
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    inputField: {
        width: '70%', // Full width of the login container
        margin: 7,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 11,
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#fff', // Input background color
    },
    inputButtonContainer: {
        flexDirection: 'row',   
        marginBottom: 80,
      },
    inputButton: {
        width: '30%',
        marginTop: 5,
        marginHorizontal: 8, // Space between buttons
        padding: 13,
        borderRadius: 5,
        backgroundColor: '#0173f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
    },
    buttonText: {
        color: 'white',
        fontSize: 13,
    },

});

export default SignUp;