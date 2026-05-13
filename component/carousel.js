import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Animated,
  Linking,
  TouchableOpacity,
  Text,
} from "react-native";
import { useMutation, useQuery } from "react-query";
import { fetchAdverts, updateAdvert } from "../api/advert";
import { moderateScale } from "react-native-size-matters";
import { GlobalContext } from "../context/Provider";

export default function AdvertCarousel({ page, subPage }) {
  const flatListRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const advertQuery = useQuery(["fetchAdvertss"], fetchAdverts);
  const fetchedAdverts = advertQuery?.data?.data || [];

  const updateAdvertMutation = useMutation(updateAdvert, {
    onSuccess: (res) => {},
    onError: (err) => {},
  });

  const adverts = fetchedAdverts?.filter((advert) => {
    if (subPage) {
      return (
        advert?.placement_of_banner?.includes(page) &&
        advert.subcategory_marketplace === subPage
      );
    }
    return advert?.placement_of_banner?.includes(page);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (adverts?.length) {
        let nextIndex = (activeIndex + 1) % adverts.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, adverts]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // at least 50% visible
  };
  const viewedAdIds = useRef(new Set());

  return adverts?.length ? (
    <View
      style={[
        styles.container,
        { height: width ? width * (144 / 344) + 30 : moderateScale(120) },
      ]}
    >
      <Text style={{ fontWeight: 600, marginBottom: 5 }}>Ads</Text>
      <View
        style={[styles.innerContainer, { height: "100%" }]}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setWidth(width);
        }}
      >
        <FlatList
          ref={flatListRef}
          data={adverts}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          viewabilityConfig={viewabilityConfig}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);

            const currentItem = adverts[index];

            if (currentItem && !viewedAdIds.current.has(currentItem?.id)) {
              viewedAdIds.current.add(currentItem?.id);
              updateAdvertMutation.mutate({
                advert_id: currentItem?.id,
                interaction_type: "VIEW",
              });
            }
          }}
          renderItem={({ item }) => (
            <ImageItem
              width={width}
              item={item}
              onClick={() => {
                updateAdvertMutation.mutate({
                  advert_id: item.id,
                  interaction_type: "CLICK",
                });
              }}
            />
          )}
        />

        {/* <View style={styles.pagination}>
          {adverts.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : null,
              ]}
            />
          ))}
        </View> */}
      </View>
    </View>
  ) : null;
}

const ImageItem = ({ item, width, onClick }) => {
  const [loading, setLoading] = useState(true);
  const shimmer = useRef(new Animated.Value(0)).current;
  const {
    authState: { user, estateData },
  } = useContext(GlobalContext);

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        onClick?.();
        const message = `Hello, I would like to reach out to this brand ${item.title} as advertised on EstateIQ.

From,
${user?.first_name} ${user?.last_name},
"${estateData?.estate?.name}".`;

        const encodedMessage = encodeURIComponent(message);
        const link = `https://wa.me/234${item?.phone_number}?text=${encodedMessage}`;

        if (item.ad_link) Linking.openURL(item?.url);
        else Linking.openURL(link);
      }}
      activeOpacity={0.9}
    >
      <View
        style={[
          styles.imageWrapper,
          {
            width,
            height: width ? width * (144 / 344) + 10 : moderateScale(110),
          },
          { backgroundColor: "#e0e0e0" },
        ]}
      >
        {loading && (
          <View style={styles.skeletonContainer}>
            <View style={[styles.shimmerOverlay]} />
          </View>
        )}
        {item?.type === "local" ? (
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            source={item.image}
            style={[styles.image]}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        ) : (
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            source={{ uri: item?.image }}
            style={[styles.image]}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", marginTop: 15 },
  innerContainer: {
    justifyContent: "center",
    height: moderateScale(100),
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    objectFit: "cover",
    resizeMode: "cover",
  },
  skeletonContainer: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 10,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
  },
  dot: {
    height: 5,
    width: 5,
    backgroundColor: "#888",
    margin: 5,
    borderRadius: 10,
  },
  activeDot: {
    backgroundColor: "blue",
    width: 6,
    height: 6,
  },
});
