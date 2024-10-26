import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Container from "@/components/Container";
import { useTypography } from "@/constants/Typography";
import SearchBar from "@/components/SearchBar";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";
import ProductCard from "@/components/ProductCard";
import products from "../../assets/data/products.json"; // Import your JSON file
import { useCart } from "@/context/CartContext";

const HomeScreen = () => {
  const typography = useTypography();
  const { addToCart } = useCart();
  const numColumns = 2;

  const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 20)); // Initial chunk of products
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreProducts = () => {
    if (loading || visibleProducts.length >= products.length) return;

    setLoading(true);
    setTimeout(() => {
      const nextProducts = products.slice(page * 20, (page + 1) * 20);
      setVisibleProducts([...visibleProducts, ...nextProducts]);
      setPage(page + 1);
      setLoading(false);
    }, 500); // Mock delay for loading more items
  };

  const renderProduct = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        onAddToCart={() =>
          addToCart({
            ...item,
            id: item.id.toString(),
            inStock: true,
            quantity: 1,
            price: item.discountPrice,
            imageUrl: item.image,
          })
        }
      />
    ),
    [addToCart]
  );

  if (!typography) {
    return null;
  }

  return (
    <Container>
      <Text style={typography.header2}>Home</Text>
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <SearchBar />
        </View>
        <TouchableOpacity style={styles.searchButtonWrapper}>
          <Icon name="sliders" size={20} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <Text style={typography.subHeading1}>Continue Browsing</Text>
      <FlatList
        data={visibleProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color={Colors.primary} />
        }
        initialNumToRender={20} // Initial items to render
        windowSize={5} // Reduce offscreen rendering window
        removeClippedSubviews // Remove items outside viewport
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: 10,
  },
  searchButtonWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: Colors.buttonBg,
  },
  iconStyle: {
    color: "#fff",
  },
});

export default HomeScreen;
