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
    
    // ลอง connect เฉพาะ paired devices แบบ parallel
    const connectPromises = pairedDevices.map(device => 
      BluetoothManager.connect(device.address)
        .then(() => ({ success: true, device }))
        .catch(() => ({ success: false, device }))
    );
    
    // รอแค่ตัวแรกที่ connect สำเร็จ
    const results = await Promise.all(connectPromises);
    const connected = results.find(r => r.success);
    
    if (connected) {
      // เก็บข้อมูลเครื่องที่เชื่อมต่อสำเร็จ
      this.currentDeviceAddress = connected.device;

      return { 
        success: true, 
        device: connected.device,
        message: `เชื่อมต่อกับ ${connected.device.name || 'เครื่องพิมพ์'} สำเร็จ`
      };
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