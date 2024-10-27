import React, { useState, useCallback, useMemo } from "react";
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
import OfferCarousel from "@/components/OfferCarousel";

const MemoizedProductCard = React.memo(ProductCard);

const HomeScreen = () => {
  const typography = useTypography();
  const { addToCart } = useCart();
  const numColumns = 2;

  const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 20));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreProducts = useCallback(() => {
    if (loading || visibleProducts.length >= products.length) return;

    setLoading(true);
    setTimeout(() => {
      const nextProducts = products.slice(page * 20, (page + 1) * 20);
      setVisibleProducts((prevProducts) => [...prevProducts, ...nextProducts]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 500); // Mock delay for loading more items
  }, [loading, page, visibleProducts]);

  const handleAddToCart = useCallback(
    (item) => {
      addToCart({
        ...item,
        id: item.id.toString(),
        inStock: item.inStock,
        quantity: 1,
        price: item.discountPrice,
        imageUrl: item.image,
      });
    },
    [addToCart]
  );

  const renderProduct = useCallback(
    ({ item }) => (
      <MemoizedProductCard
        product={item}
        onAddToCart={() => handleAddToCart(item)}
      />
    ),
    [handleAddToCart]
  );

  if (!typography) {
    return null;
  }

  return (
    <Container>
      <Text style={typography.header1}>Home</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <SearchBar />
        </View>
        <TouchableOpacity style={styles.searchButtonWrapper}>
          <Icon name="sliders" size={20} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
      <OfferCarousel />
      <Text style={[typography.header2, { marginBottom: 10 }]}>
        Continue Browsing
      </Text>
      <FlatList
        data={visibleProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        updateCellsBatchingPeriod={50} // Reduce batching period for faster rendering
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color={Colors.primary} />
        }
        initialNumToRender={10} // Further reduced for faster initial load
        windowSize={10} // Smaller window for better performance
        removeClippedSubviews={false} // Remove offscreen components
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
