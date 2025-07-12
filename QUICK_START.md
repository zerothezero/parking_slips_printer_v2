# Quick Start - Parking Slip Printer v2

> Essential commands and file locations for immediate development

## Instant Development Commands

```bash
# Start development
npm start

# Run on Android
npm run android

# Run tests
npm test

# Check code quality
npm run lint

# Clear cache issues
npm run clear-metro-cache
```

## Key File Locations

### 🎯 Most Important Files
- `components/Main/Main.js` - Main app logic and UI
- `components/BluetoothService.js` - Printer connection service
- `components/helper.js` - Utility functions
- `package.json` - Dependencies and scripts

### 📱 UI Components
- `components/Main/MainPos.js` - License plate input
- `components/Main/MainCP.js` - Car counter display
- `components/Main/MainRecentCars.js` - Recent cars list
- `AppJs.js` - App wrapper with providers

### ⚙️ Configuration
- `app.json` - App config + receipt images (large file)
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler config

## Quick Code Patterns

### Database Query Pattern
```javascript
dbRef.current.transaction((tx) => {
    tx.executeSql(
        'SELECT * FROM parking WHERE created >= ? AND created <= ?',
        [startTime, endTime],
        (tx, {rows}) => {
            const data = itemToArray(rows);
            // Handle data
        },
        (error) => toast(getError(error))
    );
});
```

### Bluetooth Connection Pattern
```javascript
const result = await BluetoothService.autoConnectPrinter();
if (result.success) {
    setConnected(true);
    toast(result.message);
}
```

### Print Receipt Pattern
```javascript
await BluetoothEscposPrinter.printerInit();
await BluetoothEscposPrinter.printText('Text here\r\n', opts);
await BluetoothEscposPrinter.printPic(imageBase64, {width: 180});
```

## Common Tasks

### Add New UI Component
1. Create in `components/Main/` directory
2. Import in `Main.js`
3. Add to grid layout
4. Follow existing styling patterns

### Modify Database Schema
1. Update SQL in `Main.js` dbOpen function
2. Test with `npm run clear-psb` to reset data
3. Update related query functions

### Debug Bluetooth Issues
1. Check device pairing in Android settings
2. Verify printer is powered on
3. Use `BluetoothService.getPairedDevices()` to debug
4. Check Android permissions

### Update Receipt Format
1. Modify print function in `Main.js`
2. Update images in `app.json` if needed
3. Test on physical printer

## Environment Requirements
- **Node.js** (for React Native)
- **Android SDK** (for Android development)
- **Physical Android device** (for Bluetooth testing)
- **Bluetooth thermal printer** (for full testing)

## Quick Debugging
```bash
# Android issues
npm run clean-android

# iOS issues  
npm run clean-ios

# Metro cache issues
npm run clear-metro-cache

# App data issues (Android)
npm run clear-psb
```

## File Size Note
⚠️ `app.json` is ~743KB due to base64 encoded receipt images. Use `Read` tool with offset/limit for partial reading.

## Next Steps After Quick Start
1. Read `PROJECT_CONTEXT.md` for full project understanding
2. Check `DEVELOPMENT_LOG.md` for recent changes
3. See `CLAUDE.md` for detailed technical information