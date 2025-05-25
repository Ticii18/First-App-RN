import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ title: "Inicio sesion", headerShown:false }} />
    </Stack>
  );
}
