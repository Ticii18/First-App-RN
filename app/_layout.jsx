import { Stack } from "expo-router";
import '~/global.css';

export default function ScreensLayout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ title: "Inicio sesion", headerShown:false }} />
    </Stack>
  );
}
