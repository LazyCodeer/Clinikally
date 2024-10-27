import Container from "@/components/Container";
import { useTypography } from "@/constants/Typography";
import { View, Text } from "react-native";

const Profile = () => {
  const typography = useTypography();

  if (!typography) {
    return null;
  }
  return (
    <Container>
      <Text style={typography.header1}>Profile</Text>
    </Container>
  );
};

export default Profile;
