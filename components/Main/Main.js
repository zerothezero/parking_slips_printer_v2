import {format} from 'date-fns';
import {th} from 'date-fns/locale';
import {Button, Icon, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, DeviceEventEmitter, PermissionsAndroid, Platform} from 'react-native';
import {BluetoothEscposPrinter, BluetoothManager} from '@brooons/react-native-bluetooth-escpos-printer';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {MenuProvider} from 'react-native-popup-menu';
// import {openDatabase} from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';

import {footer1 as slipFooter1, footer2 as slipFooter2, header as slipHeader} from '../../app.json';
import {getError, itemToArray, toast, dt_now} from '../helper';
import MainCP from './MainCP';
import MainInfo from './MainInfo';
import MainPos from './MainPos';
import MainRecentCars from './MainRecentCars';
import RNFS from "react-native-fs";

const database_name = 'parking_slips.sqlite3';

// const address = '02:04:36:C7:65:7A'; // MTP-II 02:04:36:C7:65:7A

const Main = () => {
    let [plate, setPlate] = useState('');
    let [cars, setCars] = useState(0);
    let [listCars, setListCars] = useState([]);
    let [connecting, setConnecting] = useState(false);
    let [connected, setConnected] = useState(false); // true if connected to printer - TODO: change back to false for production
    let db;
    // v2
    const pathDir = `/storage/emulated/0/.psb-config`;
    const path = `${pathDir}/parking_slips_printer.txt`;
    const [address, setAddress] = useState('');

    async function config() {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        const isFileExists = await RNFS.exists(path);
        if (!isFileExists) {
            await RNFS.mkdir(pathDir);
            await RNFS.writeFile(path, '', 'utf8');
        } else {
            const text = await RNFS.readFile(path, 'utf8');
            setAddress(text);
        }
    }

    useEffect(() => {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTED, () => {
                setConnecting(false);
                setConnected(true);
            })
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                setConnecting(false);
                setConnected(false);
            })
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_UNABLE_CONNECT, () => {
                toast('Unable to Connect Printer');
                setConnecting(false);
                setConnected(false);
            })

            config().then();
        }
        if (!connected) {
            connectPrinter();
        }
        opendb().then();

        return () => {
            if (db) db.close();
        }
    }, []);

    const opendb = async () => {
        try {
            db = await SQLite.openDatabase(
                {name: database_name, createFromLocation: `${path}/${database_name}`},
                () => {
                },
                (error) => {
                    toast(getError(error));
                }
            );
            // this.db = await SQLite.openDatabase(database_name, database_version, database_displayname, -1);
            await getCountCars();
            await getRecentCars();
        } catch (e) {
            toast(getError(e));
        }
    };

    const connectPrinter = () => {
        config().then();
        setConnecting(true);
        BluetoothManager.connect(address)
            .then(
                () => {
                    setConnected(true);
                },
                (e) => {
                    toast(getError(e));
                    setConnected(false);
                }
            )
            .catch(
                (e) => {
                    toast(getError(e));
                    setConnected(false);
                }
            )
            .finally(
                () => {
                    setConnecting(false);
                }
            );
    };

    const sql_today = () => {
        const _dateStart = new Date().toDateString() + ' 00:00:00',
            _dateEnd = new Date().toDateString() + ' 23:59:59';
        const start = format(new Date(_dateStart), 'TT', {locale: th}),
            end = format(new Date(_dateEnd), 'TT', {locale: th});

        return [start, end];
    };

    const getCountCars = () => {
        db.transaction(
            (tx) => {
                const sql = 'select count(id) as "cars" from parking where created >= ? and created <= ?';
                const args = sql_today();
                tx.executeSql(
                    sql,
                    args,
                    (tx, {rows}) => {
                        const arrRows = itemToArray(rows);
                        if (arrRows.length < 1) {
                            setCars(-1);
                        } else {
                            setCars(arrRows[0].cars);
                        }
                    },
                    (error) => {
                        toast(getError(error));
                        setCars(-1);
                    }
                );
            },
            (error) => {
                toast(getError(error));
                setCars(-1);
            }
        );
    };

    const getRecentCars = () => {
        const sql = 'select * from parking where created >= ? and created <= ? order by id desc limit 5';
        const args = sql_today();

        db.transaction(
            (tx) => {
                tx.executeSql(
                    sql,
                    args,
                    (tx, {rows}) => {
                        const arrRows = itemToArray(rows);
                        if (arrRows.length < 1) {
                            setListCars([]);
                        } else {
                            setListCars(arrRows);
                        }
                    },
                    (error) => {
                        toast(getError(error));
                    }
                );
            },
            (error) => {
                toast(getError(error));
                setCars(-1);
            }
        );
    };

    const printslip = async (plate) => {
        setPlate(plate)
        if (plate) {
            db.transaction((tx) => {
                const sql = 'insert into parking(plate, created_by) values (?,?)';
                const created_by = 'app';
                tx.executeSql(
                    sql,
                    [plate, created_by],
                    (tx, {rowsAffected}) => {
                        if (rowsAffected > 0) {
                            print(plate);
                        }
                        getCountCars();
                        getRecentCars();
                    },
                    (error) => {
                        toast(getError(error));
                    }
                );
            });
        }
    };

    const reprintslip = async (plate) => {
        if (plate) {
            await print(plate);
        }
    };

    const print = async (plate = '') => {
        const opts = {widthtimes: 0, heigthtimes: 0, fonttype: 0};
        const opts2 = {widthtimes: 0, heigthtimes: 1, fonttype: 0};
        await BluetoothEscposPrinter.printerInit();
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printPic(slipHeader, {width: 180, left: 90});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.printText('07.00 - 15.00\r\n', opts);
        await BluetoothEscposPrinter.printText('--------------------------------\r\n', opts);
        await BluetoothEscposPrinter.printText(dt_now() + '\r\n', opts);
        await BluetoothEscposPrinter.printText('--------------------------------\r\n', opts);
        await BluetoothEscposPrinter.printColumn([16, 16], [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ['Plate :', plate], opts2);
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.printText('--------------------------------\r\n', opts);
        await BluetoothEscposPrinter.printPic(slipFooter1, {width: 250, left: 60});
        await BluetoothEscposPrinter.printPic(slipFooter2, {width: 250, left: 60});
        // await BluetoothEscposPrinter.printText('-------------------------------\r\n\r\n', opts);
        await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', opts);
    };

    return (
        <MenuProvider>
            <Grid>
                <Row size={0.8}>
                    <Col size={1.8}>
                        <MainInfo
                            content={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_left])}/>
                    </Col>
                    <Col size={1}>
                        <Row size={1}>
                            <View style={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_right])}>
                                <Button full
                                        disabled={connecting || connected}
                                        onPress={connectPrinter}
                                        iconLeft
                                        style={{
                                            flex: 1,
                                            alignSelf: 'center',
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            width: '100%'
                                        }}>
                                    <Icon name="printer" type={'SimpleLineIcons'} style={{fontSize: 20}}/>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 12
                                    }}>
                                        {connected ? 'เชื่อมต่อแล้ว' : 'เชื่อมต่อ'}
                                    </Text>
                                </Button>
                            </View>
                        </Row>
                        <Row size={1}>
                            <MainCP cars={cars}
                                    getCars={getCountCars}
                                    content={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_right])}/>
                        </Row>
                    </Col>
                </Row>
                <Row size={1.2}>
                    <Col>
                        <MainPos printslip={printslip}
                                 connected={connected}
                                 content={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_center])}/>
                    </Col>
                </Row>
                <Row size={2}>
                    <MainRecentCars onReprint={reprintslip}
                                    plates={listCars}
                                    connected={connected}
                                    style={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_bottom])}/>
                </Row>
            </Grid>
        </MenuProvider>
    );
}

// const pastel_yellow = {backgroundColor: '#fcffc9'};
// const pastel_green = {backgroundColor: '#c7ffc8'};
// const green = {backgroundColor: '#28b672'};
const defaultStyles = StyleSheet.create({
    content: {
        backgroundColor: '#fcffc9',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content_left: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 2.5,
    },
    content_right: {
        marginTop: 5,
        marginRight: 5,
        marginLeft: 2.5,
    },
    content_center: {
        marginTop: 5,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    content_bottom: {
        margin: 5,
        flexDirection: 'row',
    },
    view: {
        flex: 1,
    },
});

export default Main;