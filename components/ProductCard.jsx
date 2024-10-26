import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router"; // Use useRouter for expo-router
import { Colors } from "@/constants/Colors";
import { useTypography } from "@/constants/Typography";

// Wrap ProductCard with React.memo for performance
const ProductCard = React.memo(({ product, onAddToCart }) => {
  const router = useRouter();
  const { width } = useWindowDimensions(); // Get screen width dynamically
  const typography = useTypography();

  const cardWidth = width / 2 - 27; // Adjust card width for padding (10 padding on each side)

  const handlePress = () => {
    router.push({
      pathname: "productDetail",
      params: { product: JSON.stringify(product) },
    });
  };

  const handleAddToCart = () => {
    onAddToCart();
    ToastAndroid.show(`Product added to cart`, ToastAndroid.SHORT);
  };

  if (!typography) {
    return null; // Fallback UI if typography is not available
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { width: cardWidth }]}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={[styles.title]}>{product.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, typography.subHeading1]}>
          ₹{product.originalPrice}
        </Text>
        <Text style={styles.originalPrice}>₹{product.discountPrice}</Text>
      </View>
      <Text style={[styles.discount]}>
        (
        {(
          ((product.originalPrice - product.discountPrice) /
            product.originalPrice) *
          100
        ).toFixed(0)}
        % off)
      </Text>
      <Text
        style={{
          color: product.inStock ? Colors.buttonBg : "red",
          fontSize: 15,
          fontWeight: "600",
          marginTop: 3,
        }}
      >
        {product.inStock ? "In Stock" : "Out of Stock"}
      </Text>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Text style={[styles.addToCartText, typography.buttonText]}>
          Add To Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

// Define styles for the component
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5, // Margin between columns
    marginVertical: 5, // Vertical margin between rows
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    marginLeft: 5,
    color: "#999",
  },
  discount: {
    fontSize: 12,
    color: "#FF6347",
    marginTop: 2,
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: Colors.buttonBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductCard;