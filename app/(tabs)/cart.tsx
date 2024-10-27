import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import Container from "@/components/Container";
import { useCart } from "@/context/CartContext";
import { useTypography } from "@/constants/Typography";
import { useRouter } from "expo-router";

const CartScreen = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // State to manage discount

  const router = useRouter();

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const isFreeDelivery = subtotal >= 499;
  const hasOutOfStockItems = cartItems.some((item) => !item.inStock);

  const typography = useTypography();
  if (!typography) {
    return null;
  }

  const deliveryCharge = isFreeDelivery ? 0 : 80;

  const orderTotal = isFreeDelivery
    ? subtotal - discount
    : subtotal + deliveryCharge - discount;

  const handleProceedToBuy = () => {
    if (hasOutOfStockItems) {
      Alert.alert(
        "Out of Stock Items",
        "Please remove out-of-stock items before proceeding to checkout."
      );
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "CLINIKALLY") {
      const discountAmount = subtotal * 0.1; // 10% discount
      setDiscount(discountAmount);
      ToastAndroid.show(
        "Coupon applied! 10% discount added.",
        ToastAndroid.SHORT
      );
    } else {
      setDiscount(0);
      ToastAndroid.show("Invalid coupon code.", ToastAndroid.SHORT);
    }
  };

  interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    inStock: boolean;
    quantity: number;
    imageUrl: string;
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.originalPrice}>M.R.P: ₹{item.originalPrice}</Text>
        </View>
        {item.inStock ? (
          <Text style={styles.inStock}>In Stock</Text>
        ) : (
          <Text style={styles.outStock}>Out of Stock</Text>
        )}
      </View>
      <View style={styles.quantityContainer}>
        {item.quantity === 1 ? (
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Icon name="delete" size={20} color={Colors.buttonBg} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Icon name="remove" size={20} color={Colors.buttonBg} />
          </TouchableOpacity>
        )}
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Icon name="add" size={20} color={Colors.buttonBg} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Container>
      <Text style={typography.header1}>Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Image
            source={require("../../assets/images/not-found.png")}
            style={styles.emptyCartImage}
          />
          <Text style={styles.emptyCartMessage}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              router.push({ pathname: "/search" });
            }}
          >
            <Text style={styles.searchButtonText}>Find Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text style={typography.subHeading2}>Subtotal </Text>
            <Text style={typography.subHeading1}>₹{subtotal.toFixed(2)}</Text>
          </View>

          <Text style={styles.deliveryMessage}>
            {isFreeDelivery
              ? "Congratulations! You are eligible for free delivery."
              : `Add ₹${Math.ceil(499 - subtotal)} more to get free delivery.`}
          </Text>

          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedToBuy}
          >
            <Text style={styles.proceedButtonText}>
              Proceed to Buy ({cartItems.length} items)
            </Text>
          </TouchableOpacity>

          {/* Cart Items List */}
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.cartList}
          />

          {/* Coupon Code */}
          <View style={{ flexDirection: "row" }}>
            <View style={styles.couponContainer}>
              <Icon
                name="card-giftcard"
                size={20}
                color="#333"
                style={styles.couponIcon}
              />
              <TextInput
                placeholder="Coupon Code"
                style={styles.couponInput}
                value={couponCode}
                onChangeText={(text) => setCouponCode(text)}
              />
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyCoupon}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          <View style={styles.summary}>
            <View style={styles.rowStyle}>
              <Text style={styles.summaryRow}>Items: </Text>
              <Text style={styles.priceDetail}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.summaryRow}>Delivery: </Text>
              <Text style={styles.priceDetail}>
                ₹{deliveryCharge.toFixed(2)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.rowStyle}>
                <Text style={styles.summaryRow}>Discount: </Text>
                <Text style={styles.priceDetail}>-₹{discount.toFixed(2)}</Text>
              </View>
            )}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.buttonBg,
                borderStyle: "dashed",
                marginVertical: 10,
              }}
            />
            <View style={[{ marginTop: 5 }, styles.rowStyle]}>
              <Text style={styles.orderTotal}>Order Total:</Text>
              <Text style={styles.orderTotal}>₹{orderTotal.toFixed(2)}</Text>
            </View>
          </View>
          {cartItems.length > 7 && (
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceedToBuy}
            >
              <Text style={styles.proceedButtonText}>
                Proceed to Buy ({cartItems.length} items)
              </Text>
            </TouchableOpacity>
          )}
          {hasOutOfStockItems && (
            <Text style={styles.warningMessage}>
              Please remove out-of-stock items to checkout
            </Text>
          )}
        </>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
  },
  emptyCartMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  searchButton: {
    backgroundColor: Colors.buttonBg,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveryMessage: {
    color: "#555",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtotal: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  proceedButton: {
    backgroundColor: Colors.buttonBg,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  warningMessage: {
    color: "tomato",
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 8,
  },
  proceedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartList: {
    marginTop: 10,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    color: Colors.buttonBg,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
    marginLeft: 8,
  },
  inStock: {
    fontSize: 12,
    color: "green",
    marginTop: 4,
  },
  outStock: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  quantityContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  quantityButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    padding: 4,
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  couponContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    height: 45,
    marginRight: 10,
  },
  couponIcon: {
    marginRight: 5,
  },
  couponInput: {
    flex: 1,
    padding: 6,
    fontSize: 14,
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: Colors.buttonBg,
    borderRadius: 6,
    height: 45,
    width: 90,
    alignContent: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  summary: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  summaryRow: {
    fontSize: 14,
    color: "#555",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  priceDetail: {
    fontWeight: "bold",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  discountDetail: {
    color: "#FF6347",
    fontWeight: "bold",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CartScreen;
