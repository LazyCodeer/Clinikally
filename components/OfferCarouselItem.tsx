import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  PanResponder,
} from "react-native";

const { width } = Dimensions.get("window");

const OfferCarouselItem = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Detect horizontal swipe
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          return true;
        }
        return false;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50 && activeIndex > 0) {
          // Swipe right
          handleDotPress(activeIndex - 1);
        } else if (gestureState.dx < -50 && activeIndex < images.length - 1) {
          // Swipe left
          handleDotPress(activeIndex + 1);
        }
      },
    })
  ).current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeIndex === images.length - 1) {
        scrollViewRef.current.scrollTo({ x: 0, animated: true });
        setActiveIndex(0);
      } else {
        scrollViewRef.current.scrollTo({
          x: width * (activeIndex + 1),
          animated: true,
        });
        setActiveIndex(activeIndex + 1);
      }
    }, 500); // 0.5s interval

    return () => clearInterval(timer);
  }, [activeIndex, images.length]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
      },
    }
  );

  const handleDotPress = (index) => {
    scrollViewRef.current.scrollTo({
      x: width * index,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            style={[
              styles.dot,
              {
                backgroundColor:
                  activeIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width,
    height: 300, // You can adjust this height
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default OfferCarouselItem;
