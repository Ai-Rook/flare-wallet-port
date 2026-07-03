import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

const STEP_IMAGES = {
  0: require('../assets/kyc/Account-verify-1.png'),
  1: require('../assets/kyc/Passport Scan.png'),
  2: require('../assets/kyc/Account-verify-5.png'),
  3: require('../assets/kyc/Account-verify-10.png'),
  4: require('../assets/kyc/Doc Upload Info.png'),
};

export default function KycStepImage({ step }) {
  const source = STEP_IMAGES[step];
  if (!source) return null;
  return (
    <View style={styles.wrapper}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  image: {
    width: SCREEN_W * 0.8,
    height: SCREEN_W * 0.55,
    borderRadius: 12,
    backgroundColor: '#F8F8FC',
  },
});
