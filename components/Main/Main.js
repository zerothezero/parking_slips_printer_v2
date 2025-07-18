import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Button, Text } from 'native-base';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { MenuProvider } from 'react-native-popup-menu';
import SQLite from 'react-native-sqlite-storage';

import { footer1 as slipFooter1, footer2 as slipFooter2, header as slipHeader } from '../../app.json';
import { getError, itemToArray, toast, dt_now } from '../helper';
import MainCP from './MainCP';
import MainInfo from './MainInfo';
import MainPos from './MainPos';
import MainRecentCars from './MainRecentCars';
import RNFS from "react-native-fs";
import Icon from "react-native-vector-icons/SimpleLineIcons"

// v2
// import moment from "moment";
// import 'moment/locale/th';
// config locale for moment
// moment.locale('th');

// import BluetoothService.js (from Cluade AI)
import BluetoothService from '../BluetoothService';

const pathDir = `/storage/emulated/0/.psb-config`;
const pathName = `parking_slip_printer.txt`;
const pathNameDb = `parking_slip_printer.db`;
const pathNameLog = 'parking_slip_printer.log';
const path = `${pathDir}/${pathName}`;
const pathDb = `${pathDir}/${pathNameDb}`;
const pathLog = `${pathDir}/${pathNameLog}`;

const Main = () => {
    let [cars, setCars] = useState(0);
    let [listCars, setListCars] = useState([]);
    let [connecting, setConnecting] = useState(false);
    let [connected, setConnected] = useState(false); // true if connected to printer - TODO: change back to false for production
    const dbRef = useRef(null); // Use a ref to hold the database connection
    const mainPosRef = useRef(null);

    const getAddress = async () => {
        return await RNFS.readFile(path, 'utf8');
    }

    const dbOpen = () => {
        if (!dbRef.current) {
            dbRef.current = SQLite.openDatabase(
                {
                    name: pathDb,
                    createFromLocation: pathDb
                },
                () => {
                    try {
                        dbRef.current.executeSql('CREATE TABLE IF NOT EXISTS "parking" ( "id" INTEGER, "plate" TEXT, "created" INTEGER NOT NULL DEFAULT (strftime(\'%s\', \'now\') || substr(strftime(\'%f\', \'now\'), 4)), "created_by" TEXT NOT NULL, "modified" INTEGER, "modified_by" TEXT, PRIMARY KEY("id" AUTOINCREMENT) );');
                        getCountCars();
                        getRecentCars();
                    } catch (e) {
                        toast(getError(e));
                    }
                },
                (error) => {
                    toast(getError(error));
                }
            );
        }
    }

    function dbClose() {
        try {
            if (dbRef.current) {
                dbRef.current.close();
            }
        } catch (e) {
            toast(getError(e));
        }
    }

    useEffect(() => {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_CONNECTED,
                () => {
                    setConnecting(false);
                    setConnected(true);
                }
            );
            DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_CONNECTION_LOST,
                () => {
                    // toast('Connection Lost');
                    setConnecting(false);
                    setConnected(false);
                }
            );
            DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_UNABLE_CONNECT,
                () => {
                    // toast('Unable to Connect Printer');
                    setConnecting(false);
                    setConnected(false);
                }
            );

            const config = async () => {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                // create directory .psb-config
                await RNFS.mkdir(pathDir);

                // check files
                const [isFileExists, isDbExists, isLogExists] = await Promise.all([RNFS.exists(path), RNFS.exists(pathDb), RNFS.exists(pathLog)]);
                if (!isFileExists || !isDbExists || !isLogExists) {
                    await Promise.all([
                        !isFileExists && RNFS.writeFile(path, '', 'utf8'),
                        !isDbExists && RNFS.writeFile(pathDb, '', 'utf8'),
                        !isLogExists && RNFS.writeFile(pathLog, '', 'utf8')
                    ]);
                }
            }

            const init = async () => {
                try {
                    dbOpen();
                    await config();
                    if (!connected) {
                        await connectPrinter();
                    }
                } catch (e) {
                    toast(getError(e));
                }
            }
            init().then(() => { toast('--- Ready ---') });
            if (mainPosRef.current) {
                setTimeout(() => {
                    mainPosRef.current.focus();
                }, 100); // หน่วงเวลาเล็กน้อย
            }
        }

        return () => {
            // Cleanup เมื่อ component unmount
            dbClose();
        }
    }, []);

    const connectPrinter = async () => {
        try {
            setConnecting(true);
            
            // Auto-connect กับเครื่องที่ paired และเปิดอยู่
            const result = await BluetoothService.autoConnectPrinter();
            
            if (result.success) {
                setConnected(true);
            }
            
            toast(result.message);
        } catch (error) {
            toast('เกิดข้อผิดพลาด กรุณาลองใหม่');
            setConnected(false);
        } finally {
            setConnecting(false);
        }
    };

    const sql_today = () => {
        const _dateStart = new Date().toDateString() + ' 00:00:00',
            _dateEnd = new Date().toDateString() + ' 23:59:59';
        const start = format(new Date(_dateStart), 'TT', {locale: th}),
            end = format(new Date(_dateEnd), 'TT', {locale: th});

        return [start, end];
    }

    const getCountCars = () => {
        if (dbRef.current) {
            dbRef.current.transaction(
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
        }
    }

    const getRecentCars = () => {
        const sql = 'select * from parking where created >= ? and created <= ? order by id desc limit 5';
        const args = sql_today();

        dbRef.current.transaction(
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
    }

    const printslip = async (plate) => {
        if (plate) {
            dbRef.current.transaction((tx) => {
                const sql = 'insert into parking(plate, created_by) values (?,?)';
                const created_by = 'app';
                tx.executeSql(
                    sql,
                    [plate, created_by],
                    (tx, {rowsAffected}) => {
                        if (rowsAffected > 0) {
                            print(plate);
                            // saveDataToGoogleSheet(plate);
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
    }

    const print = async (plate = '') => {
        const opts = {widthtimes: 0, heigthtimes: 0, fonttype: 0};
        const opts2 = {widthtimes: 0, heigthtimes: 1, fonttype: 0};
        await BluetoothEscposPrinter.printerInit();
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printPic(slipHeader, {width: 180, left: 90});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.printText('06.30 - 19.00\r\n', opts);
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
    }

    const reprintslip = async (plate) => {
        if (plate) {
            await print(plate);
        }
    }

    return (
        <MenuProvider>
            <Grid>
                <Row size={0.8}>
                    <Col size={1.8}>
                        <MainInfo
                            content={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_left])}
                        />
                    </Col>
                    <Col size={1}>
                        <Row size={1}>
                            <View style={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_right])}>
                                <Button full
                                        isDisabled={connecting || connected}
                                        _disabled={{opacity: 0.6}}
                                        onPress={connectPrinter}
                                        iconLeft
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            width: '100%'
                                        }}
                                        colorScheme={connected ? 'success' : 'warning'}
                                        leftIcon={
                                            <Icon name="printer"
                                                  style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}
                                            />
                                        }
                                >
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        paddingTop: 5,
                                        paddingLeft: '5%'
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
                <Row size={1.5}>
                    <Col>
                        <MainPos printslip={printslip}
                                 connected={connected}
                                 posInputRef={mainPosRef}
                                 content={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_center])}
                        />
                    </Col>
                </Row>
                <Row size={1.5}>
                    <MainRecentCars onReprint={reprintslip}
                                    plates={listCars}
                                    connected={connected}
                                    style={StyleSheet.flatten([defaultStyles.content, defaultStyles.content_bottom])}/>
                </Row>
            </Grid>
        </MenuProvider>
    );
}

const defaultStyles = StyleSheet.create({
    content: {
        backgroundColor: '#fcffc9',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderWidth: 1
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