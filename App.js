import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlingGestureHandler,
  Directions,
  State,
  FlingGestureHandlerStateChangeEvent,
  TouchableOpacity,
} from "react-native-gesture-handler";

const pushBulletApiKey = ""; // Change this

export default function App() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const webviewRef = useRef(null);
  const [payload, setPayload] = useState([]);
  const [payloadIndex, setPayloadIndex] = useState(0);
  const [url, setUrl] = useState("");
  useEffect(() => {
    fetch(`http://192.168.0.110:5000/getPayload`, {
      // Change this
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => setPayload(JSON.parse(res)));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.lrContainer}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#000",
                flex: 1,
                paddingHorizontal: 45,
                paddingTop: 5,
              }}
              onPress={() => {
                if (webviewRef.current) webviewRef.current.goBack();
              }}
            >
              <Text style={{ fontSize: 30, color: "#fff" }}>
                {"<--"} Go Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#000",
                paddingHorizontal: 45,
                paddingTop: 5,
                flex: 1,
              }}
              onPress={() => {
                // fetch(`http://192.168.0.110:5000/postUrlToOpen`, {
                //   method: "POST",
                //   headers: { "Content-Type": "application/json" },
                //   body: JSON.stringify({ url }),
                // })
                //   .then((res) => res.json())
                //   .then((res) => console.log(res));

                fetch(`https://api.pushbullet.com/v2/pushes`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Token": `${pushBulletApiKey}`,
                  },
                  body: JSON.stringify({
                    type: "link",
                    title: "Open",
                    body: "The link",
                    link: url,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => console.log(res));
              }}
            >
              <Text style={{ fontSize: 30, color: "#fff" }}>
                Open on Desktop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 12 }}>
          <WebView
            source={{
              uri: `https://google.com/`,
            }}
            onNavigationStateChange={(e) => {
              console.log(e);
            }}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                color="black"
                size="large"
                style={styles.container}
              />
            )}
            ref={webviewRef}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
              setCurrentUrl(navState.url);
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              flex: 1,
              paddingHorizontal: 45,
              paddingTop: 5,
            }}
            onPress={() => {
              console.log(payload[payloadIndex]);
              console.log(payloadIndex);
              if (payloadIndex !== 0) {
                setPayloadIndex(payloadIndex - 1);
              }
              if (webviewRef.current) {
                const newUrl = `${payload[payloadIndex]["url"]}`;
                setUrl(newUrl);
                const redirectTo = 'window.location = "' + newUrl + '"';
                webviewRef.current.injectJavaScript(redirectTo);
              }
            }}
          >
            <Text style={{ fontSize: 30, color: "#fff" }}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              paddingHorizontal: 45,
              paddingTop: 5,
              flex: 1,
            }}
            onPress={() => {
              console.log(payload[payloadIndex]);
              console.log(payloadIndex);
              if (payloadIndex !== payload.length - 1) {
                setPayloadIndex(payloadIndex + 1);
              }
              if (webviewRef.current) {
                const newUrl = `${payload[payloadIndex]["url"]}`;
                setUrl(newUrl);
                const redirectTo = 'window.location = "' + newUrl + '"';
                webviewRef.current.injectJavaScript(redirectTo);
              }
            }}
          >
            <Text style={{ fontSize: 30, color: "#fff" }}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  lrContainer: {
    flex: 1,
    flexDirection: "column",
  },
});
