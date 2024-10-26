import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  const handleFocus = () => {
    navigation.navigate("search", { query });
  };

  return (
    <TouchableOpacity onPress={handleFocus} style={styles.container}>
      <Icon name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a product..."
        value={query}
        onChangeText={setQuery}
        editable={false} // Make the TextInput non-editable to trigger navigation on focus
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
});

export default SearchBar;
