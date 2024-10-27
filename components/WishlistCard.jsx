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
import Icon from "react-native-vector-icons/FontAwesome";
import { useWishlist } from "@/context/WishlistContext"; // Import WishlistContext

// Wrap ProductCard with React.memo for performance
const WishlistCard = React.memo(({ product, onAddToCart }) => {
  const router = useRouter();
  const typography = useTypography();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Use WishlistContext

  const handlePress = () => {
    router.push({
      pathname: "productDetail",
      params: { product: JSON.stringify(product) },
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      ToastAndroid.show(`Removed from wishlist`, ToastAndroid.SHORT);
    } else {
      addToWishlist(product);
      ToastAndroid.show(`Added to wishlist`, ToastAndroid.SHORT);
    }
  };

  if (!typography) {
    return null; // Fallback UI if typography is not available
  }

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card]}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View>
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
      </View>

      <Icon
        name={isInWishlist(product.id) ? "trash" : "trash"}
        size={20}
        style={[styles.deleteButton]}
        onPress={handleWishlistToggle}
      />
    </TouchableOpacity>
  );
});

// Define styles for the component
const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5, // Margin between columns
    marginVertical: 5, // Vertical margin between rows
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    right: 15,
    top: 15,
    color: Colors.textSecondary,
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
});

export default WishlistCard;
