import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import { formatNumber } from '../helper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MainCP = (props) => {
    let [isVisible, setIsVisible] = useState(false);
    let [cars, setCars] = useState(0);

    const show = () => {
        props.getCars();
        setIsVisible(true);
        setCars(props.cars || 0)
    };

    const hide = () => {
        setIsVisible(false);
    };

    return (
        <TouchableOpacity activeOpacity={1} onPressIn={show} onPressOut={hide}
                          style={[props.content, {flexDirection: 'row', justifyContent: 'flex-start'}]}>
            {
                isVisible && (
                    <>
                        <Icon name="car-multiple" size={30} style={{paddingLeft: '10%'}} />
                        <Text
                            alignSelf={'center'}
                            style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                                paddingTop: 15,
                                paddingLeft: '10%'
                            }}
                        >
                            {formatNumber(cars.toString())}
                        </Text>
                    </>
                )
            }
        </TouchableOpacity>
    );
}

export default MainCP;