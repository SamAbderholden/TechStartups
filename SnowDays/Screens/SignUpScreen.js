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
            <Image style={styles.logo} source={require(IMAGE_PATH)} />
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
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
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
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
    },

});

export default SignUp;