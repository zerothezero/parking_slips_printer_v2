import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { Menu, MenuTrigger, MenuOptions, renderers } from 'react-native-popup-menu';
import { dt_format } from '../helper';
import { Box, FlatList, HStack, Spacer } from 'native-base';

const TooltipReprint = (props) => {
    const { text, plate, onReprint, connected } = props;
    return (
        <Menu renderer={renderers.Popover}
            rendererProps={{ placement: 'right', preferredPlacement: 'right', anchorStyle: { left: '40%' } }}>
            <MenuTrigger disabled={!connected} text={text} />
            <MenuOptions optionsContainerStyle={{ width: '40%', left: '40%' }}>
                <Button type='clear' title={'พิมพ์ซ้ำ'} onPress={() => {
                    onReprint(plate);
                }} />
            </MenuOptions>
        </Menu>
    );
};

const MainRecentCars = (props) => {
    let [showReprint, setShowReprint] = useState(false);

    const show = () => {
        setShowReprint(true);
    };

    const hide = () => {
        setShowReprint(false);
    };

    return (
        <View style={[props.style, style.section]}>
            <Text style={style.header}>รถที่เข้ามาล่าสุด 5 คัน</Text>
            {
                props.plates &&
                <FlatList
                    data={props.plates}
                    keyExtractor={(item) => item.id}
                    renderItem={
                        ({ item }) => (
                            <Box
                                bg={'white'}
                                borderBottomWidth='1'
                                py='2'
                                px='3'
                                mx='10%'
                            >
                                <HStack justifyContent='space-between'>
                                    <TooltipReprint
                                        plate={item.plate}
                                        onReprint={props.onReprint}
                                        onSelect={hide}
                                        connected={props.connected}
                                        text={dt_format(item.created, 'HH:mm:ss')}
                                        style={{ fontSize: 20 }}
                                    />
                                    <Spacer />
                                    <Text
                                        style={{ fontWeight: 900 }}
                                    >{item.plate}</Text>
                                </HStack>
                            </Box>
                        )
                    }
                />
            }
        </View>
    );
}

const style = StyleSheet.create({
    section: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    header: {
        marginVertical: '3%',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        marginLeft: '10%',
        marginRight: '20%',
    },
});

export default MainRecentCars;