import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { fetchToken } from "../api";
export default function ProfileScreen() {
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      // Navigate to the login screen or home screen
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to remove token", error);
    }
  };
  useEffect(() => {
    fetchToken().then((token) => {
      setUser(token.data.decode);
    });
  }, []);
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://media.istockphoto.com/id/1208878325/vector/cinema-film-strip-wave-film-reel-and-clapper-board-isolated-on-blue-background-3d-movie.jpg?s=612x612&w=0&k=20&c=5E5nvgkVoDwVjnfpyDUxWwnhnz9RomrQhUVQObPKyBc=",
            }} // Background image
            style={styles.backgroundImage}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={30} color="red" />
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: user.image }} // Profile image
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.subtitle}>{user.username}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Friends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <Path
          fill="#1A1A2E"
          fill-opacity="1"
          d="M0,160L6.9,138.7C13.7,117,27,75,41,96C54.9,117,69,203,82,218.7C96,235,110,181,123,170.7C137.1,160,151,192,165,197.3C178.3,203,192,181,206,149.3C219.4,117,233,75,247,85.3C260.6,96,274,160,288,186.7C301.7,213,315,203,329,218.7C342.9,235,357,277,370,250.7C384,224,398,128,411,90.7C425.1,53,439,75,453,80C466.3,85,480,75,494,106.7C507.4,139,521,213,535,218.7C548.6,224,562,160,576,133.3C589.7,107,603,117,617,133.3C630.9,149,645,171,658,160C672,149,686,107,699,90.7C713.1,75,727,85,741,117.3C754.3,149,768,203,782,218.7C795.4,235,809,213,823,176C836.6,139,850,85,864,85.3C877.7,85,891,139,905,149.3C918.9,160,933,128,946,106.7C960,85,974,75,987,58.7C1001.1,43,1015,21,1029,42.7C1042.3,64,1056,128,1070,133.3C1083.4,139,1097,85,1111,101.3C1124.6,117,1138,203,1152,197.3C1165.7,192,1179,96,1193,69.3C1206.9,43,1221,85,1234,112C1248,139,1262,149,1275,149.3C1289.1,149,1303,139,1317,117.3C1330.3,96,1344,64,1358,85.3C1371.4,107,1385,181,1399,208C1412.6,235,1426,213,1433,202.7L1440,192L1440,320L1433.1,320C1426.3,320,1413,320,1399,320C1385.1,320,1371,320,1358,320C1344,320,1330,320,1317,320C1302.9,320,1289,320,1275,320C1261.7,320,1248,320,1234,320C1220.6,320,1207,320,1193,320C1179.4,320,1166,320,1152,320C1138.3,320,1125,320,1111,320C1097.1,320,1083,320,1070,320C1056,320,1042,320,1029,320C1014.9,320,1001,320,987,320C973.7,320,960,320,946,320C932.6,320,919,320,905,320C891.4,320,878,320,864,320C850.3,320,837,320,823,320C809.1,320,795,320,782,320C768,320,754,320,741,320C726.9,320,713,320,699,320C685.7,320,672,320,658,320C644.6,320,631,320,617,320C603.4,320,590,320,576,320C562.3,320,549,320,535,320C521.1,320,507,320,494,320C480,320,466,320,453,320C438.9,320,425,320,411,320C397.7,320,384,320,370,320C356.6,320,343,320,329,320C315.4,320,302,320,288,320C274.3,320,261,320,247,320C233.1,320,219,320,206,320C192,320,178,320,165,320C150.9,320,137,320,123,320C109.7,320,96,320,82,320C68.6,320,55,320,41,320C27.4,320,14,320,7,320L0,320Z"
        ></Path>
      </Svg>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  header: {
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImage: {
    width: 140, 
    height: 140,
    borderRadius: 70, 
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1A1A2E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  photosContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  photosTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  svg: {
    position: "absolute",
    bottom: 0,
  },
});
