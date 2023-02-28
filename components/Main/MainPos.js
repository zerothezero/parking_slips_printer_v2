import {Button, Icon, Text} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Grid, Row} from 'react-native-easy-grid';

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
        fontSize: 60,
        letterSpacing: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        flex: 1,
    },
    btnPrint: {
        flex: 1,
        alignSelf: 'center',
        height: '65%',
        marginHorizontal: '15%',
    },
});

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
                <Row size={1}>
                    <TextInput style={styles.txtPlate} autoFocus={true} autoCorrect={false}
                               keyboardType="number-pad" autoCompleteType="off" textAlignVertical="center"
                               value={plate} onChangeText={handlePlate} maxLength={4}/>
                </Row>
                <Row size={1}>
                    <Button rounded success onPress={handlePrint} style={styles.btnPrint}
                            disabled={!props.connected} iconLeft>
                        <Icon name="print" style={{fontSize: 36}}/>
                        <Text style={{fontSize: 36, fontWeight: 'bold', textAlignVertical: 'center'}}>Print</Text>
                    </Button>
                </Row>
            </Grid>
        </View>
    );
}

export default MainPos;