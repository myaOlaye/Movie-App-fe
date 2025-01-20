import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return passwordRegex.test(password);
  };

  const handleSignup = () => {
    if (!email || !password || !confirmPassword || !userName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (userName.length < 6) {
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

    Alert.alert("Success", "Account has been created");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignup} color="#007AFF" />

      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate("Login")}
        color="#007AFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
  },
});
