// ไฟล์: components/BluetoothService.js
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';

class BluetoothService {
  constructor() {
    this.currentDeviceAddress = null; // เก็บข้อมูลเครื่องที่เชื่อมต่ออยู่
  }
  async autoConnectPrinter() {
    // สแกนหาอุปกรณ์ที่ paired แล้ว
    const pairedDevices = await this.getPairedDevices();
    
    if (pairedDevices.length === 0) {
      return { 
        success: false, 
        message: 'ไม่พบอุปกรณ์ที่จับคู่ไว้ กรุณาจับคู่กับเครื่องพิมพ์ก่อน' 
      };
    }
    
    // ลองเชื่อมต่อกับแต่ละเครื่องที่ paired ไว้
    for (const device of pairedDevices) {
      try {
        await BluetoothManager.connect(device.address);

        // เก็บข้อมูลเครื่องที่เชื่อมต่อสำเร็จ
        this.currentDeviceAddress = device;

        return { 
          success: true, 
          device,
          message: `เชื่อมต่อกับ ${device.name || 'เครื่องพิมพ์'} สำเร็จ`
        };
      } catch (error) {
        // ข้ามไปลองเครื่องถัดไป
        continue;
      }
    }
    
    return { 
      success: false, 
      message: 'ไม่พบเครื่องพิมพ์ที่เปิดอยู่ กรุณาเปิดเครื่องพิมพ์' 
    };
  }

  async disconnect() {
    try {
      if (this.currentDeviceAddress) {
        await BluetoothManager.disconnect(device.address);
        this.currentDeviceAddress = null;
        return true;
      }
    } catch (error) {
      // ไม่ต้องแสดง error
    }
    return false;
  }

  async getPairedDevices() {
    // ดึงรายการอุปกรณ์ที่ paired แล้ว
    const devices = await BluetoothManager.scanDevices();
    const {found,paired} = JSON.parse(devices);
    
    // กรองเฉพาะที่ paired แล้ว
    return paired;
  }

  getCurrentDevice() {
    return this.currentDeviceAddress;
  }

  setCurrentDevice(address) {
    this.currentDeviceAddress = address;
  }
}

export default new BluetoothService();