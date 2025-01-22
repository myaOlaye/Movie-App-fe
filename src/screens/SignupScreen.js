import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import colours from "./theme/colours"; // Corrected import path
import { registerUser } from "../api";
export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return passwordRegex.test(password);
  };

  const handleSignup = () => {
    if (!email || !password || !confirmPassword || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (username.length < 6) {
      Alert.alert("Error", "Username must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least one number and one special character"
      );
      return;
    }

    registerUser(name, username, email, password).then(() => {
      console.log("Account has been created");
      Alert.alert("Success", "Account has been created");
      navigation.navigate("Login");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="name"
        placeholderTextColor={colours.mutedText}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colours.mutedText}
        value={username}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colours.mutedText}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colours.mutedText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colours.mutedText}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colours.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: colours.text,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: colours.midnightPurple,
    borderRadius: 8,
    color: colours.text,
  },
  button: {
    backgroundColor: colours.indigo,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: colours.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: colours.mutedText,
    marginTop: 20,
  },
});
