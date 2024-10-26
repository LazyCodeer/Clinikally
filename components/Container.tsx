import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import tw from "twrnc";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  // Detect Android and apply top padding
  const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView style={[{ paddingTop: paddingTop }, tw`bg-white flex-1`]}>
      {/* Use FlatList for Container */}
      <FlatList
        data={[{}]} // Dummy data to allow rendering children
        renderItem={() => (
          <View style={[tw`p-5`, className ? tw`${className}` : null]}>
            {children}
          </View>
        )}
        showsVerticalScrollIndicator={false} // Hide scroll indicator
      />
    </SafeAreaView>
  );
};

export default Container;
