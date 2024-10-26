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
import moment from "moment"; // Import moment for date manipulation
import pincodesData from "../assets/data/pincodes.json"; // Import your JSON data
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProductDetailScreen() {
  const route = useRoute();
  const { product } = route.params;
  const productData = JSON.parse(product);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Function to get logistics provider and TAT based on pincode
  const getProviderAndTatByPincode = (pincode) => {
    const pincodeInfo = pincodesData.find(
      (item) => item.pincode === parseInt(pincode)
    );
    return pincodeInfo
      ? { provider: pincodeInfo.provider, tat: pincodeInfo.tat }
      : null;
  };

  const handlePincodeValidation = () => {
    if (pincode.length !== 6) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode.");
      return;
    }

    const providerInfo = getProviderAndTatByPincode(pincode);

    if (!providerInfo) {
      Alert.alert(
        "Invalid Pincode",
        "No logistics provider found for this pincode."
      );
      return;
    }

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
        setDeliveryDate(
          `Estimated Delivery: ${moment()
            .add(1, "days")
            .format("dddd, MMMM Do")}`
        );
      }
    } else if (provider === "Provider B") {
      if (currentHour < 9) {
        setDeliveryDate("Today (Same-day Delivery)");
        startCountdown("09:00");
      } else {
        setDeliveryDate(
          `Estimated Delivery: ${moment()
            .add(1, "days")
            .format("dddd, MMMM Do")}`
        );
      }
    } else {
      const estimatedDate = moment().add(tat, "days").format("dddd, MMMM Do");
      setDeliveryDate(`Estimated Delivery: ${estimatedDate}`);
    }
  };

  const startCountdown = (cutoffTime) => {
    const cutoff = moment(cutoffTime, "HH:mm");
    const remainingTime = cutoff.diff(moment(), "seconds");

    if (remainingTime > 0) {
      setCountdown(remainingTime);
      const timerId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(timerId);
    }
  };

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

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
    <View style={[styles.container, { paddingTop: paddingTop, marginTop: 10 }]}>
      <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
        <Icon name="chevron-left" size={20} style={styles.iconStyle} />
      </TouchableOpacity>
      <Image source={{ uri: productData.image }} style={styles.image} />
      <Text style={styles.title}>{productData.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{productData.originalPrice}</Text>
        <Text style={styles.originalPrice}>₹{productData.discountPrice}</Text>
        <Text style={styles.discount}>
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
        ]}
      >
        {productData.inStock ? "In Stock" : "Out of Stock"}
      </Text>

      {/* Pincode input field and apply button */}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
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
          onPress={handlePincodeValidation}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Date Display */}
      {deliveryDate ? (
        <Text style={styles.deliveryDate}>{deliveryDate}</Text>
      ) : null}

      {/* Countdown Timer for Same-day Delivery */}
      {countdown !== null && (
        <Text style={styles.countdown}>
          Time left for same-day delivery: {formatCountdown(countdown)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    // alignItems: "center",
  },
  backIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    marginTop: 15,
    marginBottom: 15,
  },
  iconStyle: {
    color: Colors.textSecondary,
    marginLeft: -5,
  },

  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    // textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    marginLeft: 8,
    color: "#999",
  },
  discount: {
    fontSize: 14,
    color: "#FF6347",
    // marginTop: 4,
    marginLeft: 8,
  },
  inStock: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 5,
  },
  pincodeInput: {
    height: 45,
    borderColor: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    // marginTop: 15,
    marginRight: 10,
    width: "80%",
  },
  applyButton: {
    backgroundColor: Colors.buttonBg,
    // paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    // marginTop: 10,
    height: 45,
    justifyContent: "center",
    alignContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deliveryDate: {
    fontSize: 16,
    color: "#333",
    marginTop: 15,
    fontWeight: "500",
  },
  countdown: {
    fontSize: 14,
    color: "#FF6347",
    marginTop: 5,
  },
});
