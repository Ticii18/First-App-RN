import { Tabs } from "expo-router";

export default function ScreensLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Dashboard"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Tabs.Screen
        name="ViewCountrys"
        options={{ title: "Países", headerShown: false }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Cerrar sesión",
          tabBarLabelStyle: { color: "red" },
        }}
      />
    </Tabs>
  );
}
