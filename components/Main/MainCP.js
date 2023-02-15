import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text, Icon} from 'native-base';
import {formatNumber} from '../helper';

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
        <TouchableOpacity activeOpacity={1} onPressIn={show} onPressOut={hide} style={props.content}>
            <View>
                {
                    isVisible && (
                        <>
                            <Icon name='car-multiple' type={'MaterialCommunityIcons'} style={{alignSelf: 'center'}}/>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>{formatNumber(cars.toString())}</Text>
                        </>
                    )
                }
            </View>
        </TouchableOpacity>
    );
}

export default MainCP;