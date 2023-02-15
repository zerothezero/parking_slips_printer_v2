/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';

import Main from './components/Main/Main';
import { StyleSheet } from "react-native";

// SQLite.DEBUG(true);
const AppJs = () => {
    // const pathDir = `${RNFS.DocumentDirectoryPath}/psb-config`;
    // const pathDir = `/storage/emulated/0/.psb-config`;
    // const pathName = `parking_slip_printer.txt`;
    // const pathNameDb = `parking_slip_printer.db`;
    // const path = `${pathDir}/${pathName}`;
    // const pathDb = `${pathDir}/${pathNameDb}`;
    // const [printer, setPrinter] = useState('');
    // let db;
    //
    // async function config() {
    //     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    //     // create directory .psb-config
    //     await RNFS.mkdir(pathDir);
    //
    //     // check files
    //     const isFileExists = await RNFS.exists(path);
    //     const isDbExists = await RNFS.exists(pathDb);
    //     if (!isFileExists || !isDbExists) {
    //         if (!isFileExists) {
    //             await RNFS.writeFile(path, '', 'utf8');
    //         }
    //         if (!isDbExists) {
    //             await RNFS.writeFile(pathDb, '', 'utf8');
    //         }
    //     } else {
    //         // load config
    //         dbOpen();
    //         const text = await RNFS.readFile(path, 'utf8');
    //         setPrinter(text);
    //     }
    // }
    //
    // const dbOpen = () => {
    //     if (!db) {
    //         db = SQLite.openDatabase({
    //             name: pathDb,
    //             createFromLocation: pathDb
    //         });
    //
    //         db.executeSql('CREATE TABLE IF NOT EXISTS "parking" ( "id" INTEGER, "plate" TEXT, "created" INTEGER NOT NULL DEFAULT (strftime(\'%s\', \'now\') || substr(strftime(\'%f\', \'now\'), 4)), "created_by" TEXT NOT NULL, "modified" INTEGER, "modified_by" TEXT, PRIMARY KEY("id" AUTOINCREMENT) );');
    //     }
    //
    // }
    //
    // function dbClose() {
    //     if (db) {
    //         db.close();
    //     }
    // }
    //
    // useEffect(() => {
    //     config();
    //
    //     return () => {
    //         dbClose();
    //     }
    // }, []);

    // DC:0D:51:09:BC:9B
    return <>
        <NativeBaseProvider>
            <SafeAreaProvider>
                <SafeAreaView style={StyleSheet.flatten([defaultStyles.view, green])}>
                    {/*<Center height={'100%'}>*/}
                    {/*    <Button width={'50%'}*/}
                    {/*            colorScheme={printer ? ("primary") : 'danger'}*/}
                    {/*            onPress={async () => {*/}
                    {/*                await config();*/}
                    {/*                if (printer) {*/}
                    {/*                    const connected = await BluetoothManager.getConnectedDeviceAddress();*/}
                    {/*                    if (connected) {*/}
                    {/*                        await BluetoothManager.connect(printer);*/}
                    {/*                    }*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*    >*/}
                    {/*        {printer || 'ตั้งค่าเครื่องพิมพ์ก่อน'}*/}
                    {/*    </Button>*/}
                    {/*</Center>*/}
                    <Main/>
                </SafeAreaView>
            </SafeAreaProvider>
        </NativeBaseProvider>
    </>
}

const green = {backgroundColor: '#28b672'};
const defaultStyles = StyleSheet.create({
    view: {
        flex: 1,
    },
});

export default AppJs;
