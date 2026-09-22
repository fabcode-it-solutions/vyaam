module.exports = {
  expo: {
    name: "Vyaam",
    slug: "Vyaam",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "vyaam",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: "com.vyaam.app",
      googleServicesFile:
        process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.vyaam.app",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      adaptiveIcon: {
        backgroundColor: "#0F3D34",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#0F3D34",
          image: "./assets/images/vyaam_icon.png",
          imageWidth: 160,
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Vyaam uses your location to show nearby trainers and gyms.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "Vyaam uses your camera to verify your identity and capture progress photos.",
          microphonePermission: false,
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/android-icon-foreground.png",
          color: "#0F3D34",
        },
      ],
      "@react-native-google-signin/google-signin",
      "expo-apple-authentication",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "29cf5c1f-02cb-4374-9a89-ba7387b17f2b",
      },
    },
  },
};
