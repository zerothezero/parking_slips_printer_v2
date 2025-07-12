# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
- `npm start` - Start Metro bundler with cache reset
- `npm run android` - Run on Android device/emulator (active architecture only)
- `npm run ios` - Run on iOS device/simulator
- `npm run android-release` - Run Android in release mode
- `npm run ios-release` - Run iOS in release configuration

### Building and Testing
- `npm run build-android` - Build Android APK (debug)
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

### Maintenance Commands
- `npm run clean-android` - Clean Android build artifacts
- `npm run clean-ios` - Clean iOS dependencies and reinstall pods
- `npm run clear-metro-cache` - Clear Metro bundler cache
- `npm run clear-psb` - Clear app config data from device storage
- `npm run list-psb` - List app-related files on device storage

## Project Architecture

### Application Flow
- **Entry Point**: `index.js` → `AppJs.js` → `components/Main/Main.js`
- **Main Interface**: Grid-based layout with printer connection, car counter, license plate input, and recent cars display
- **Data Persistence**: SQLite database stored at `/storage/emulated/0/.psb-config/parking_slip_printer.db`
- **Configuration**: App config stored at `/storage/emulated/0/.psb-config/parking_slip_printer.txt`

### Core Components Structure
```
components/
├── BluetoothService.js     # Singleton service for printer management
├── Main/
│   ├── Main.js            # Primary app interface and logic
│   ├── MainCP.js          # Car counter display
│   ├── MainInfo.js        # Information panel
│   ├── MainPos.js         # License plate input
│   └── MainRecentCars.js  # Recent cars list with reprint
├── helper.js              # Utility functions
└── google-sheet.js        # Google Sheets integration
```

### Key Technologies
- **React Native 0.71.10** with NativeBase UI library
- **SQLite** for local data storage
- **Bluetooth ESC/POS Printer** integration via `@brooons/react-native-bluetooth-escpos-printer`
- **Thai locale support** using date-fns
- **Android file system access** for configuration persistence

## Database Schema

The SQLite database contains a `parking` table with schema:
```sql
CREATE TABLE parking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate TEXT,
    created INTEGER NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4)),
    created_by TEXT NOT NULL,
    modified INTEGER,
    modified_by TEXT
);
```

## Bluetooth Printer Integration

### BluetoothService Features
- **Auto-connection**: Automatically connects to paired printers on app start
- **Connection management**: Maintains current device state and handles disconnections
- **Error handling**: Graceful fallback when no printers are available
- **Device discovery**: Scans for paired Bluetooth devices

### Printer Functionality
- **Receipt printing**: Custom formatted parking slips with headers, footers, and vehicle plate
- **Image printing**: Supports base64 encoded images in receipts (stored in app.json)
- **ESC/POS commands**: Standard thermal printer command support

## File Storage Locations

### Android Storage Paths
- **Config Directory**: `/storage/emulated/0/.psb-config/`
- **Main Config**: `parking_slip_printer.txt`
- **Database**: `parking_slip_printer.db`
- **Logs**: `parking_slip_printer.log`

## Development Notes

### Permission Requirements
- `WRITE_EXTERNAL_STORAGE` for Android file system access
- Bluetooth permissions for printer connectivity

### Thai Language Support
- Date formatting uses Thai locale via date-fns
- UI elements support Thai text display
- Database stores Thai license plate formats

### Testing Strategy
- Jest configuration included for unit testing
- Manual testing required for Bluetooth printer functionality
- Android device/emulator required for full feature testing

### Common Issues
- Metro cache issues: Use `npm run clear-metro-cache`
- Android build problems: Use `npm run clean-android`
- Bluetooth connection failures: Check device pairing and printer power state
- File permission issues: Ensure proper Android permissions are granted

## Quick Reference

### Essential Files for Development
- **Main Logic**: `components/Main/Main.js:37-388` - Core app functionality
- **Bluetooth Service**: `components/BluetoothService.js:1-81` - Printer management
- **Utilities**: `components/helper.js:1-50+` - Date formatting, database helpers
- **Print Function**: `components/Main/Main.js:262-280` - Receipt printing logic
- **Database Operations**: `components/Main/Main.js:178-236` - SQLite queries

### Quick Commands Reference
```bash
# Essential development workflow
npm start && npm run android    # Start and run
npm run lint && npm test        # Code quality check
npm run clear-metro-cache       # Fix cache issues

# Debug Bluetooth issues
npm run clear-psb              # Clear app data
adb logcat | grep parking     # View logs
```

### Code Patterns Quick Reference
```javascript
// Database query pattern
dbRef.current.transaction((tx) => {
    tx.executeSql(sql, args, successCallback, errorCallback);
});

// Bluetooth connection
const result = await BluetoothService.autoConnectPrinter();

// Print receipt
await BluetoothEscposPrinter.printText('text\r\n', opts);
```

### Cross-Platform Development
- **PROJECT_CONTEXT.md** - Overview for web/CLI context sharing
- **DEVELOPMENT_LOG.md** - Track changes across platforms
- **QUICK_START.md** - Immediate commands and patterns
- **TROUBLESHOOTING.md** - Common issues and solutions