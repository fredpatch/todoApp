import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// app loading
import AppLoading from "expo-app-loading";

// splash screen
import * as SplashScreen from "expo-splash-screen";

// styled components
import { Container } from "./styles/appStyles";

// components
import Home from "./components/Home";

// Keep splashcreen visible while fetching resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // initial todos
  const initialTodos = [];

  // todos state
  const [todos, setTodos] = useState(initialTodos);

  // async storage
  const LoadTodos = () => {
    AsyncStorage.getItem("storedTodos")
      .then((data) => {
        if (data !== null) {
          setTodos(JSON.parse(data));
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    async function prepare() {
      try {
        // make any API calls you need to do here
        LoadTodos();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  // use splashscreen to load while fetching the asyncstorage data if they exist
  // if (!isReady) {
  //   SplashScreen.preventAutoHideAsync();
  //   return (
  //     <AppLoading
  //       startAsync={LoadTodos}
  //       onFinish={() => setIsReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }
  // if (!isReady) {
  //   return (
  //     <AppLoading
  //       startAsync={LoadTodos}
  //       onFinish={() => setIsReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }

  return (
    <Container onLayout={onLayoutRootView}>
      <Home todos={todos} setTodos={setTodos} />
      <StatusBar style="light" />
    </Container>
  );
}
