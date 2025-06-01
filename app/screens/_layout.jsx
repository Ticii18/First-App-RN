import { Tabs } from "expo-router";

export default function ScreensLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{ title: "Dashboard" }}
      />
      <Tabs.Screen
        name="ViewCountrys"
        options={{ title: "Países" }}
      />
      <Tabs.Screen
        name="Logout"
        options={{ title: "Cerrar sesión", tabBarLabelStyle: { color: "red" } }}
      />
      
    </Tabs>
  );
}
