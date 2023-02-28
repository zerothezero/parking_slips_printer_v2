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

const AppJs = () => {
    // DC:0D:51:09:BC:9B
    return <>
        <NativeBaseProvider>
            <SafeAreaProvider>
                <SafeAreaView style={StyleSheet.flatten([defaultStyles.view, bgc])}>
                    <Main />
                </SafeAreaView>
            </SafeAreaProvider>
        </NativeBaseProvider>
    </>
}

// green:
// const bgc = {backgroundColor: '#28b672'};
const bgc = { backgroundColor: '#d4d4d4' };
const defaultStyles = StyleSheet.create({
    view: {
        flex: 1,
    },
});

export default AppJs;
