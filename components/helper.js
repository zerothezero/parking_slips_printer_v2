import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ToastAndroid } from 'react-native';
import RNFS from "react-native-fs";
import moment from "moment/moment";

export function formatNumber(string) {
    return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function itemToArray(rows) {
    let arr = [], i;
    if (rows.length > 0) {
        for (i = 0; i < rows.length; i++) {
            arr.push(rows.item(i));
        }
    }

    return arr;
}

// control array size
// 1. push() + shift()
// 2. splice(0,0, $) + pop()
// 3. unshift() + pop() **
export function setPlates(plates, plate) {
    plates.unshift(plate);
    if (plates.length > 5) {
        plates.pop();
    }
}

export function dt_now() {
    return format(new Date(), 'dd/MM/yyyy HH:mm:ss', {locale: th});
}

export function dt_now_sql() {
    return format(new Date(), 'TT', {locale: th});
}

export function dt_format(timestamp, dateformat = 'dd/MM/yyyy HH:mm:ss') {
    return format(timestamp, dateformat, {locale: th});
}

export function toast(text, time = ToastAndroid.LONG) {
    ToastAndroid.show(text, time);
}

export function getError(obj) {
    if ('string' === typeof obj) {
        return obj;
    } else {
        if ('message' in obj) {
            return obj.message;
        } else {
            return obj;
        }
    }
}

/**
 *
 * @param {string}  path    path of log file
 * @param {string}  text    text to write
 * @param {string}  type    type of log:<br/>
 *      &emsp;&emsp;&emsp;- err = error<br/>
 *      &emsp;&emsp;&emsp;- warn = warning<br/>
 *      &emsp;&emsp;&emsp;- info = info<br/>
 *      &emsp;&emsp;&emsp;- debug = debug
 * @return {Promise<void>}
 **/
export async function writeLog(path: string, text: string, type = 'err') {
    try {
        let format = `${moment().format('YYYY/MM/DD HH:mm:ss:SSSSSS')}\t${type.toUpperCase().padEnd(5, ' ')} ${text}\n`;
        await RNFS.appendFile(path, text, 'utf8');
    } catch (e) {
        toast('Saving log failed.');
    }
}
