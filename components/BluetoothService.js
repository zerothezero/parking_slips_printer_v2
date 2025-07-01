// ไฟล์: components/BluetoothService.js
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';

class BluetoothService {
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

  async getPairedDevices() {
    // เปิด Bluetooth ถ้ายังปิดอยู่
    const isEnabled = await BluetoothManager.isBluetoothEnabled();
    if (!isEnabled) {
      await BluetoothManager.enableBluetooth();
    }
    
    // ดึงรายการอุปกรณ์ที่ paired แล้ว
    const devices = await BluetoothManager.scanDevices();
    const deviceList = JSON.parse(devices);
    
    // กรองเฉพาะที่ paired แล้ว
    return deviceList.filter(device => device.paired === true);
  }
}

export default new BluetoothService();