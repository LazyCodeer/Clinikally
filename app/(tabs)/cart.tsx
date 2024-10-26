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
} from "react-native";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import Container from "@/components/Container";
import { useCart } from "@/context/CartContext";
import { useTypography } from "@/constants/Typography";

const CartScreen = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState("");

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const typography = useTypography();
  if (!typography) {
    return null;
  }

  const deliveryCharge = 80;
  const promotionApplied = 80;
  const orderTotal = subtotal + deliveryCharge - promotionApplied;

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
        <Text style={styles.inStock}>
          {item.inStock ? "In Stock" : "Out of Stock"}
        </Text>
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
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartMessage}>Your cart is empty</Text>
      ) : (
        <>
          <Text style={typography.header2}>Cart</Text>
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

          <TouchableOpacity style={styles.proceedButton}>
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
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          {/* add a dashed line */}

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

            <View style={styles.rowStyle}>
              <Text style={styles.summaryRow}>Total: </Text>
              <Text style={styles.priceDetail}>
                ₹{(subtotal + deliveryCharge).toFixed(2)}
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.summaryRow}>Promotion Applied: </Text>
              <Text style={styles.discountDetail}>
                -₹{promotionApplied.toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.buttonBg,
                borderStyle: "dashed",
                marginVertical: 10,
              }}
            />
            <View
              style={[
                {
                  marginTop: 5,
                },
                styles.rowStyle,
              ]}
            >
              <Text style={styles.orderTotal}>Order Total:</Text>
              <Text style={styles.orderTotal}>₹{orderTotal.toFixed(2)}</Text>
            </View>
          </View>
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
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginTop: 10,
  },
  couponIcon: {
    marginRight: 8,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    // flex: 1,
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
  emptyCartMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CartScreen;
