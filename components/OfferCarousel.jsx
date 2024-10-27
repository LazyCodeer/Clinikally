import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  LogBox,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const OfferCarousel = () => {
  
  const flatlistRef = useRef();
  // Get Dimensions
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Data for carousel
  const carouselData = [
    {
      id: 1,
      offerText: "20% off",
      typeText: "on skincare",
      image: require("../assets/images/demo.png"),
    },
    {
      id: 2,
      offerText: "40% off",
      typeText: "on makeup",
      image: require("../assets/images/demo.png"),
    },
    {
      id: 3,
      offerText: "30% off",
      typeText: "on haircare",
      image: require("../assets/images/demo.png"),
    },
  ];

  const screenWidth = width - 40;

  // Auto Scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex =
          prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1;
        flatlistRef.current.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [carouselData.length]);

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  const handlePress = () => {
    // console.log("Shop now pressed");
    router.push({
      pathname: "search",
    });
  };

  // Display Images // UI
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.offerCard, { width: screenWidth }]}>
        <View style={styles.offerWrapper}>
          <Text style={styles.offerText}>{item.offerText}</Text>
          <Text style={styles.typeText}>{item.typeText}</Text>
          <TouchableOpacity style={styles.showNowBtnWrapper} onPress={handlePress}>
            <Text style={styles.showNowBtn}>Shop now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={item.image}
          style={{ height: 150, width: 200, objectFit: "contain" }}
        />
      </View>
    );
  };

  // Handle Scroll
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  // Render Dot Indicators
  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor:
              activeIndex === index ? Colors.buttonBg : Colors.textSecondary,
          },
        ]}
      />
    ));
  };

  return (
    <View>
      <FlatList
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.dotContainer}>{renderDotIndicators()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  offerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  offerWrapper: {
    // padding: 20,
    // backgroundColor: Colors.primary,
  },
  offerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.text,
  },
  typeText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.text,
  },
  showNowBtnWrapper: {
    backgroundColor: Colors.buttonBg,
    padding: 8,
    borderRadius: 50,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  showNowBtn: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OfferCarousel;
