import { Button, Text } from 'native-base';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';

const MainPos = (props) => {
    let [plate, setPlate] = useState('');

    const handlePlate = (plate) => {
        setPlate(plate);
    };

    const handlePrint = () => {
        props.printslip(plate);
        setPlate('');
    };

    return (
        <View style={props.content}>
            <Grid>
                <Row size={1.5}>
                    <TextInput
                        ref={props.posInputRef}
                        style={styles.txtPlate}
                        autoFocus={false}
                        autoCorrect={false}
                        keyboardType="number-pad" autoCompleteType="off" textAlignVertical="center"
                        value={plate} onChangeText={handlePlate} maxLength={4} />
                </Row>
                <Row size={1}>
                    <Button
                        bg='success.300'
                        onPress={handlePrint}
                        style={styles.btnPrint}
                        isDisabled={!props.connected}>
                        <Text bold fontSize="xl">PRINT</Text>
                    </Button>
                </Row>
            </Grid>
        </View>
    );
}

const styles = StyleSheet.create({
    txtPlate: {
        borderColor: 'black',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 1,
        backgroundColor: 'white',
        marginHorizontal: '15%',
        marginTop: '4%',
        includeFontPadding: false,
        fontSize: 80,
        letterSpacing: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        flex: 1,
    },
    btnPrint: {
        flex: 1,
        alignSelf: 'center',
        height: '75%',
        marginHorizontal: '15%',
    },
});

export default MainPos;
