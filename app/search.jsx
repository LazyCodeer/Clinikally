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
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import debounce from "lodash.debounce";
import products from "../assets/data/products.json";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import Feather from "react-native-vector-icons/Feather"; 
import { Colors } from "@/constants/Colors";

const PAGE_SIZE = 10; // Number of products to load per batch

const MemoizedProductCard = React.memo(ProductCard);

const SearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const [query, setQuery] = useState(route.params?.query || "");
  const [currentPage, setCurrentPage] = useState(1);

  const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  // Filter and paginate products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.slice(0, currentPage * PAGE_SIZE);
  }, [query, currentPage]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddToCart = useCallback(
    (item) => {
      addToCart(item);
      if (Platform.OS === "android") {
        ToastAndroid.show("Product added to cart", ToastAndroid.SHORT);
      }
    },
    [addToCart]
  );

  // Debounce the search input to reduce excessive renders
  const handleSearchInput = useCallback(
    debounce((text) => {
      setQuery(text);
      setCurrentPage(1); // Reset page when query changes
    }, 300),
    []
  );

  const loadMoreProducts = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Search bar container */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.backButtonWrapper}
          onPress={handleBack}
        >
          <Feather name="arrow-left" size={20} style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a product..."
            defaultValue={query}
            onChangeText={handleSearchInput}
          />
        </View>
      </View>

      {/* Product list */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <MemoizedProductCard
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
        onEndReachedThreshold={0.5}
        onEndReached={loadMoreProducts} // Load more when end is reached
        updateCellsBatchingPeriod={50} // Reduce rendering batch time
        ListFooterComponent={
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={{ marginVertical: 10 }}
          />
        }
        initialNumToRender={10} // Render fewer items initially
        maxToRenderPerBatch={10}
        windowSize={10}
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
  backButtonWrapper: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1.5,
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
