# Troubleshooting Guide - Parking Slip Printer v2

## Common Issues and Solutions

### 🔧 Development Environment Issues

#### Metro Bundler Problems
```bash
# Symptoms: Build fails, cache errors, module resolution issues
npm run clear-metro-cache
npm start
```

#### Android Build Failures
```bash
# Clean Android build artifacts
npm run clean-android

# For persistent issues
cd android && ./gradlew clean && cd ..
npm run android
```

#### iOS Build Issues
```bash
# Clean and reinstall iOS dependencies
npm run clean-ios
npm run ios
```

### 📱 Bluetooth Connectivity Issues

#### Printer Not Found
**Symptoms**: "ไม่พบอุปกรณ์ที่จับคู่ไว้" (No paired devices found)
**Solutions**:
1. Pair printer in Android Bluetooth settings first
2. Ensure printer is powered on and in pairing mode
3. Check app has Bluetooth permissions
4. Restart Bluetooth service on device

#### Connection Failures
**Symptoms**: "ไม่พบเครื่องพิมพ์ที่เปิดอยู่" (No active printer found)
**Solutions**:
1. Verify printer is powered on
2. Check printer is within Bluetooth range
3. Try manual reconnection via app button
4. Restart both app and printer

#### Printing Errors
**Symptoms**: App connected but printing fails
**Solutions**:
1. Check printer paper and ribbon
2. Verify printer supports ESC/POS commands
3. Test with minimal print command
4. Check printer error indicators

### 💾 Database Issues

#### Database Connection Errors
**Symptoms**: Car count shows -1, database operations fail
**Solutions**:
```bash
# Clear app data and restart
npm run clear-psb
npm run android
```

#### SQLite Errors
**Symptoms**: SQL execution failures, data corruption
**Solutions**:
1. Check database file permissions
2. Verify SQL syntax in queries
3. Clear database and let app recreate:
```bash
adb shell rm /storage/emulated/0/.psb-config/parking_slip_printer.db
```

### 📂 File System Issues

#### Permission Denied Errors
**Symptoms**: Cannot write to external storage
**Solutions**:
1. Grant storage permissions in Android settings
2. Check `WRITE_EXTERNAL_STORAGE` permission in app
3. Verify target API level compatibility

#### Config File Not Found
**Symptoms**: App fails to initialize, missing config
**Solutions**:
1. App should auto-create config directory
2. Manually verify directory exists:
```bash
adb shell ls /storage/emulated/0/.psb-config/
```

### 🌐 Network and External Service Issues

#### Google Sheets Integration Errors
**Symptoms**: Data not syncing to Google Sheets
**Solutions**:
1. Check network connectivity
2. Verify Google Sheets API credentials
3. Review `google-sheet.js` implementation
4. Check API rate limits

### 🔍 Debugging Tools and Commands

#### View App Data
```bash
# List app files
npm run list-psb

# View database content (requires SQLite tools)
adb pull /storage/emulated/0/.psb-config/parking_slip_printer.db
```

#### Android Debugging
```bash
# View app logs
adb logcat | grep "parking_slip"

# Check device info
adb devices

# Install APK manually
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### React Native Debugging
```bash
# Enable debug mode
npm run android -- --mode debug

# Remote debugging
# Shake device → Debug → Remote JS Debugging
```

### 🏗️ Build and Deployment Issues

#### Gradle Build Failures
**Solutions**:
1. Check Java version compatibility
2. Update Android SDK components
3. Clean gradle cache:
```bash
cd android && ./gradlew clean && cd ..
```

#### Dependency Conflicts
**Symptoms**: Module resolution errors, version conflicts
**Solutions**:
1. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```
2. Check for duplicate dependencies
3. Use patch-package for specific fixes

#### APK Generation Issues
**Symptoms**: Build succeeds but APK not generated
**Solutions**:
1. Check Android SDK path
2. Verify keystore configuration
3. Use manual gradle build:
```bash
cd android && ./gradlew assembleDebug
```

### 🚨 Emergency Recovery

#### Complete Reset
```bash
# Clear all caches and data
npm run clear-metro-cache
npm run clean-android
npm run clear-psb
rm -rf node_modules
npm install
npm run android
```

#### Rollback Changes
```bash
# If recent changes broke the app
git status
git checkout -- <problematic-file>
# or
git reset --hard HEAD~1
```

### 📞 Getting Help

#### Log Information to Collect
1. Error messages from Metro bundler
2. Android logcat output
3. Device and OS version
4. Printer model and specifications
5. Steps to reproduce the issue

#### Useful Debug Information
```bash
# System info
npx react-native info

# Check dependencies
npm ls

# Environment variables
env | grep ANDROID
```

### 💡 Prevention Tips

1. **Always test on physical device** for Bluetooth functionality
2. **Keep dependencies updated** but test thoroughly
3. **Use version control** before major changes
4. **Document custom patches** in DEVELOPMENT_LOG.md
5. **Regular database backups** for important data
6. **Test printer compatibility** before deployment