// CardImage — renders a Rain card image
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const cardImages = {
  simple: require('../assets/card-simple.png'),
  signature: require('../assets/card-signature.png'),
  black: require('../assets/card-black.png'),
};

export default function CardImage({ tier, style }) {
  const source = tier?.id ? cardImages[tier.id] : cardImages.simple;
  return <Image source={source} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: undefined,
    aspectRatio: 400 / 250,
    borderRadius: 16,
    resizeMode: 'contain',
  },
});
