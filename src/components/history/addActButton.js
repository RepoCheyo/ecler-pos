import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../utils/dimensions';
import * as Haptics from 'expo-haptics';

export default function AddButton({ btnColor, screenToNav }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        width: horizontalScale(45),
        height: verticalScale(45),
        backgroundColor: btnColor,
        borderRadius: moderateScale(100),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        right: horizontalScale(10),
        bottom: verticalScale(35),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}
      onPress={() =>
        Haptics.selectionAsync().then(navigation.navigate(screenToNav))
      }
    >
      <Entypo name="plus" size={30} color="white" />
    </TouchableOpacity>
  );
}
