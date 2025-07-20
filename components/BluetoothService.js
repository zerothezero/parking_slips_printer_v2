// ไฟล์: components/BluetoothService.js
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';

class BluetoothService {
  constructor() {
    this.currentDeviceAddress = null; // เก็บข้อมูลเครื่องที่เชื่อมต่ออยู่
  }

  async autoConnectPrinter() {
    // เปิด Bluetooth ก่อน
    const isEnabled = await BluetoothManager.checkBluetoothEnabled();
    if (!isEnabled) {
      await BluetoothManager.enableBluetooth();
    }

    // สแกนหาอุปกรณ์ที่ paired แล้ว
    const pairedDevices = await this.getPairedDevices();
    
    if (pairedDevices.length === 0) {
      return { 
        success: false, 
        message: 'ไม่พบอุปกรณ์ที่จับคู่ไว้ กรุณาจับคู่กับเครื่องพิมพ์ก่อน' 
      };
    }
    
    // ลอง connect ทีละตัว
    for (const device of pairedDevices) {
      try {
        console.log(`Trying to connect to ${device.name || device.address}...`);
        await BluetoothManager.connect(device.address);
        
        // เก็บข้อมูลเครื่องที่เชื่อมต่อสำเร็จ
        this.currentDeviceAddress = device;
        console.log(`Connected to ${device.name || device.address}`);
        
        return { 
          success: true, 
          device: device,
          message: `เชื่อมต่อกับ ${device.name || 'เครื่องพิมพ์'} สำเร็จ`
        };
      } catch (error) {
        console.log(`Failed to connect to ${device.name || device.address}: ${error.message}`);
        // Continue to next device
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
        await BluetoothManager.disconnect(this.currentDeviceAddress.address);
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