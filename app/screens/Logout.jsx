import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); 
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Cerrando sesión...</Text>
    </View>
  );
}
