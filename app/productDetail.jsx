import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pincodesData from "../assets/data/pincodes.json";
import { Colors } from "@/constants/Colors";
import Feather from "react-native-vector-icons/Feather";
import { useTypography } from "@/constants/Typography";

export default function ProductDetailScreen() {
  const route = useRoute();
  const { product } = route.params;
  const productData = JSON.parse(product);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const typography = useTypography();

  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [countdown, setCountdown] = useState(null);

  // Load typography and provide fallback if necessary
  const typographyAvailable = typography !== null; // Check if typography is available

  useEffect(() => {
    loadPincode();
    loadCountdown();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (countdown && countdown > 0) {
        setCountdown((prev) => prev - 1);
        AsyncStorage.setItem("countdown", JSON.stringify(countdown - 1));
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [countdown]);

  const loadCountdown = async () => {
    const storedCountdown = await AsyncStorage.getItem("countdown");
    if (storedCountdown) {
      setCountdown(JSON.parse(storedCountdown));
    }
  };

  const loadPincode = async () => {
    const storedPincode = await AsyncStorage.getItem("pincode");
    if (storedPincode) {
      setPincode(storedPincode);
      handlePincodeValidation(storedPincode); // Automatically validate pincode if available
    }
  };

  const getProviderAndTatByPincode = (pincode) => {
    const pincodeInfo = pincodesData.find(
      (item) => item.pincode === parseInt(pincode)
    );
    return pincodeInfo
      ? { provider: pincodeInfo.provider, tat: pincodeInfo.tat }
      : null;
  };

  const handlePincodeValidation = async (pincodeToValidate) => {
    const pincodeToUse = pincodeToValidate || pincode;

    if (pincodeToUse.length !== 6) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode.");
      return;
    }

    const providerInfo = getProviderAndTatByPincode(pincodeToUse);
    if (!providerInfo) {
      Alert.alert("Invalid Pincode", "No logistics provider found.");
      return;
    }

    // Store the pincode in AsyncStorage
    await AsyncStorage.setItem("pincode", pincodeToUse);

    const { provider, tat } = providerInfo;
    calculateDeliveryDate(provider, tat);
  };

  const calculateDeliveryDate = (provider, tat) => {
    const currentHour = moment().hour();
    if (provider === "Provider A") {
      if (currentHour < 17 && productData.inStock) {
        setDeliveryDate("Today (Same-day Delivery)");
        startCountdown("17:00");
      } else {
        setDeliveryDate(`${moment().add(1, "days").format("dddd, MMMM Do")}`);
      }
    } else if (provider === "Provider B") {
      if (currentHour < 9) {
        setDeliveryDate("Today (Same-day Delivery)");
        startCountdown("09:00");
      } else {
        setDeliveryDate(`${moment().add(1, "days").format("dddd, MMMM Do")}`);
      }
    } else {
      const estimatedDate = moment().add(tat, "days").format("dddd, MMMM Do");
      setDeliveryDate(`${estimatedDate}`);
    }
  };

  const startCountdown = (cutoffTime) => {
    const cutoff = moment(cutoffTime, "HH:mm");
    const remainingTime = cutoff.diff(moment(), "seconds");
    if (remainingTime > 0) {
      setCountdown(remainingTime);
      AsyncStorage.setItem("countdown", JSON.stringify(remainingTime));
    }
  };

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  return (
    <View style={[styles.container, { paddingTop: paddingTop }]}>
      <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
        <Feather name="arrow-left" size={20} style={styles.iconStyle} />
      </TouchableOpacity>
      <Image source={{ uri: productData.image }} style={styles.image} />
      <Text
        style={[
          styles.title,
          typographyAvailable ? typography.header1 : { fontSize: 20 },
        ]}
      >
        {productData.name}
      </Text>
      <View style={styles.priceContainer}>
        <Text
          style={[
            styles.price,
            typographyAvailable ? typography.subHeading1 : { fontSize: 18 },
          ]}
        >
          ₹{productData.originalPrice}
        </Text>
        <Text style={styles.originalPrice}>₹{productData.discountPrice}</Text>
        <Text
          style={[
            styles.discount,
            typographyAvailable ? typography.bodyText : { fontSize: 14 },
          ]}
        >
          (
          {(
            ((productData.originalPrice - productData.discountPrice) /
              productData.originalPrice) *
            100
          ).toFixed(0)}
          % off)
        </Text>
      </View>
      <Text
        style={[
          styles.inStock,
          { color: productData.inStock ? Colors.buttonBg : "red" },
          typographyAvailable ? typography.subHeading2 : { fontSize: 20 },
        ]}
      >
        {productData.inStock ? "In Stock" : "Out of Stock"}
      </Text>
      <Text
        style={[
          styles.promptText,
          typographyAvailable ? typography.subHeading1 : { fontSize: 16 },
        ]}
      >
        Enter pincode:
      </Text>
      <View style={styles.pincodeContainer}>
        <TextInput
          style={styles.pincodeInput}
          placeholder="Enter Pincode"
          keyboardType="numeric"
          value={pincode}
          onChangeText={setPincode}
          maxLength={6}
        />
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handlePincodeValidation()}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {deliveryDate ? (
        <View
          style={{
            marginTop: 15,
          }}
        >
          <Text
            style={[
              {
                color: Colors.text,
              },
              typographyAvailable ? typography.subHeading1 : { fontSize: 16 },
            ]}
          >
            Estimate Delivery
          </Text>
          <Text
            style={[
              styles.deliveryDate,
              typographyAvailable ? typography.bodyText : { fontSize: 16 },
            ]}
          >
            {deliveryDate}
          </Text>
        </View>
      ) : null}
      {countdown !== null && countdown > 0 && (
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text
            style={[
              {
                color: Colors.text,
              },
              typographyAvailable ? typography.subHeading1 : { fontSize: 16 },
            ]}
          >
            Time left for same-day delivery
          </Text>
          <Text
            style={[
              styles.countdown,
              typographyAvailable ? typography.bodyText : { fontSize: 16 },
            ]}
          >
            {formatCountdown(countdown)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  backIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    marginTop: 15,
    marginBottom: 15,
  },
  iconStyle: { color: Colors.textSecondary },
  image: { width: "100%", height: 200, resizeMode: "cover", borderRadius: 10 },
  title: { marginTop: 10 },
  priceContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  price: { fontSize: 18, fontWeight: "bold", color: Colors.primary },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    marginLeft: 8,
    color: "#999",
  },
  discount: { color: "#FF6347", marginLeft: 8 },
  inStock: { fontSize: 20, fontWeight: "500", marginTop: 5 },
  promptText: { marginTop: 15 },
  pincodeContainer: { flexDirection: "row", marginTop: 10 },
  pincodeInput: {
    height: 45,
    borderColor: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    width: "80%",
  },
  applyButton: {
    backgroundColor: Colors.buttonBg,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: { color: "#fff", fontWeight: "600" },
  pincodeDisplay: { marginTop: 10, fontSize: 16, color: "#333" },
  deliveryDate: {
    // marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "400",
  },
  countdown: { fontSize: 16, color: Colors.buttonBg, fontWeight: "500" },
});
