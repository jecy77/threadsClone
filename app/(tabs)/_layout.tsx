import { Ionicons } from "@expo/vector-icons";
import { type BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = true;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const AnimatedTabBarButton = ({
    children,
    onPress,
    style,
    ...restProps // spread 문법
  }: BottomTabBarButtonProps) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const handlePressOut = () => {
      Animated.sequence([
        Animated.spring(scaleValue, {
          // spring, decay, timing 있음
          toValue: 2,
          useNativeDriver: true, // 켜두는게 좋음 (자바스크립트 스레드가 아니라서 자바스크립트 스레드 블로킹 없이 할 수 있음)
          speed: 200,
          // friction: 100, // friction이 높을수록 스프링 효과가 적음
        }),

        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 200,
          // friction: 100,
        }),
      ]).start();
    };

    return (
      <Pressable
        {...restProps} // rest 문법
        onPress={onPress}
        onPressOut={handlePressOut}
        style={[
          { flex: 1, justifyContent: "center", alignItems: "center" },
          style,
        ]}
        android_ripple={{ borderless: false, radius: 0 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          {/* transform 에서 scale말고 x,y좌표를 옮기도록 할 수도 있음 */}
          {children}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />, // 버튼을 다른 컴포넌트로 대체 가능
        }}
      >
        ;
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="search"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="add"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="heart-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="[username]"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        {/* Following을 탭 바에서 없애는 방법 1
      <Tabs.Screen
        name="following"
        options={{
          tabBarLabel: () => null, 
          href: null,
        }}
      />*/}
        <Tabs.Screen
          name="(post)/[username]/post/[postID]"
          options={{
            tabBarLabel: () => null,
            href: null,
          }}
        />
      </Tabs>
      <Modal
        visible={isLoginModalOpen}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>Login Modal</Text>
            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
