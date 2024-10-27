// src/constants/typography.ts
import { StyleSheet } from "react-native";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

export const useTypography = () => {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return StyleSheet.create({
    // Headers and Titles
    title: {
      fontFamily: "Poppins_800ExtraBold",
      fontSize: 28,
      lineHeight: 36,
    },
    header1: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      lineHeight: 32,
    },
    header2: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 20,
      lineHeight: 28,
    },

    // Subheadings
    subHeading1: {
      fontFamily: "Poppins_500Medium",
      fontSize: 18,
      lineHeight: 26,
    },
    subHeading2: {
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
      lineHeight: 24,
    },

    // Body Text
    bodyText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 14,
      lineHeight: 22,
    },
    bodyTextBold: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 14,
      lineHeight: 22,
    },
    smallBodyText: {
      fontFamily: "Poppins_300Light",
      fontSize: 12,
      lineHeight: 20,
    },

    // Caption and Footnotes
    caption: {
      fontFamily: "Poppins_300Light",
      fontSize: 10,
      lineHeight: 16,
    },
    captionBold: {
      fontFamily: "Poppins_500Medium",
      fontSize: 10,
      lineHeight: 16,
    },

    // Special Styles
    buttonText: {
      fontFamily: "Poppins_700Bold",
      fontSize: 16,
    },
    linkText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 14,
      color: "#007AFF", // Modify color as per theme
    },
    highlightedText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 14,
      color: "#FF9500", // Modify color as per theme
    },
  });
};
