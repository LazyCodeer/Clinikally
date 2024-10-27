import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Container from "@/components/Container";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import WishlistCard from "@/components/WishlistCard";
import { useTypography } from "@/constants/Typography";

const Wishlist = () => {
  const { wishlistItems } = useWishlist();
  const typography = useTypography();

  if (!typography) {
    return null;
  }

  return (
    <Container>
      <Text style={typography.header1}>Wishlist</Text>
      {wishlistItems.length === 0 ? (
        <Text style={styles.emptyMessage}>Your wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={({ item }) => <WishlistCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  emptyMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Wishlist;
