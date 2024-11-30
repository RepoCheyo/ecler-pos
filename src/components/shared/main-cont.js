import React from 'react';
import { View, StyleSheet } from 'react-native';
import spacing from '../../styles/spacing';
import colors from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const Holder = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.xl,
    alignSelf: 'center',
    width: '95%',
    height: '100%',
  },
});

export default Holder;
