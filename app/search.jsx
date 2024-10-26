import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ToastAndroid,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import debounce from "lodash.debounce"; // Add lodash.debounce for debouncing the input
import products from "../assets/data/products.json";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";

const SearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const [query, setQuery] = useState(route.params?.query || "");

  // Memoize filtered products to avoid recalculating on each render
  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddToCart = useCallback(
    (item) => {
      addToCart(item);
      ToastAndroid.show("Product added to cart", ToastAndroid.SHORT);
    },
    [addToCart]
  );

  // Debounce setQuery to avoid excessive re-renders during typing
  const handleSearchInput = debounce((text) => setQuery(text), 300);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Search bar container */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchButtonWrapper}
          onPress={handleBack}
        >
          <Icon name="chevron-left" size={20} style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a product..."
            defaultValue={query}
            onChangeText={handleSearchInput} // Debounced text input
          />
        </View>
      </View>

      {/* Product list */}
      {filteredProducts.length === 0 && (
        <Text>
          No products found for "{query}". Try searching for something else.
        </Text>
      )}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={() =>
              handleAddToCart({ ...item, inStock: true, quantity: 1 })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10} // Render limited items initially
        windowSize={5} // Use optimized window size
        removeClippedSubviews // Remove items that are off-screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  searchBarWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  searchButtonWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  iconStyle: {
    color: Colors.textSecondary,
  },
});

export default SearchScreen;
