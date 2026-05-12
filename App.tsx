import { SafeAreaProvider } from "react-native-safe-area-context";

import * as Notifications from "expo-notifications";

import { useEffect } from "react";

import AppNavigator from "./src/navigation/AppNavigator";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {

  useEffect(() => {

  const requestPermissions = async () => {

    const permissions =
      await Notifications.requestPermissionsAsync();

  };

  requestPermissions();

}, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}