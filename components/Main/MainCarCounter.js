import {View, Icon, Text} from 'native-base';
import React from 'react';
import {formatNumber} from '../helper';

const MainCarCounter = (props) => {
    let cars = formatNumber((isNaN(parseInt(props.cars)) ? 0 : props.cars).toString());

    return (
        <View style={[props.content]}>
            <Icon name={'car-multiple'} type={'MaterialCommunityIcons'}/>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{cars}</Text>
        </View>
    );
}

export default MainCarCounter;