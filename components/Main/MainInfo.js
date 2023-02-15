import {format} from 'date-fns';
import {th} from 'date-fns/locale';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'native-base';

const MainInfo = (props) => {
    const textStyle = {
        fontSize: 30,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    };

    let [date, setDate] = useState('');
    let [time, setTime] = useState('');
    let [isBdYear, setIsBdYear] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const _date = new Date();
            const _locale = {locale: th};
            const year = format(_date, 'yyyy', _locale);
            const customYear = isBdYear ? parseInt(year) + 543 : year;
            setDate(format(_date, 'EEE dd/MM/', _locale) + customYear);
            setTime(format(_date, 'HH:mm:ss', _locale));
        }, 250);

        return () => {
            clearInterval(timer);
        };
    }, [])

    return (
        <View style={props.content}>
            <Text style={textStyle}
                  onPress={() => {
                      setIsBdYear(!isBdYear)
                  }}>
                {date}
            </Text>
            <Text style={textStyle}>
                {time}
            </Text>
        </View>
    );
}

export default MainInfo;