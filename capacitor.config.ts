import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kimhun55.ionic',
  appName: 'TestIonic',
  webDir: 'dist',
  server: {
    // androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  // server: {
  //   url: "http://192.168.1.49:5173",
  //   cleartext: true
  // }
};
export default config;
