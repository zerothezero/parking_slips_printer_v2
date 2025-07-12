# Project Context - Parking Slip Printer v2

## Project Overview
React Native application for printing parking slips via Bluetooth thermal printers. Used in parking lots to generate timestamped parking receipts with license plate numbers.

## Current Status
- **Version**: 1.1.0
- **Platform**: React Native 0.71.10
- **Target**: Android (primary), iOS (secondary)
- **Last Major Update**: Enhanced BluetoothService for auto-connection and device management

## Key Features
1. **Bluetooth Printer Integration**: Auto-connects to paired thermal printers
2. **License Plate Input**: Quick entry system for vehicle registration
3. **Receipt Printing**: Custom formatted slips with timestamps and branding
4. **Data Persistence**: SQLite database for parking records
5. **Daily Statistics**: Car count tracking and recent entries display
6. **Thai Language Support**: Localized date/time formatting

## Recent Changes (Based on Git History)
- ✅ Enhanced BluetoothService to manage current device connection
- ✅ Updated disconnect logic in BluetoothService
- ✅ Implemented auto-connecting to paired printers
- ✅ Added connected state management in printer logic

## Project Architecture Quick Reference

### Entry Points
- `index.js` → `AppJs.js` → `components/Main/Main.js`

### Core Services
- `components/BluetoothService.js` - Printer connection management
- `components/helper.js` - Utility functions and date formatting

### Main UI Components
- `components/Main/Main.js` - Primary interface
- `components/Main/MainPos.js` - License plate input
- `components/Main/MainCP.js` - Car counter
- `components/Main/MainRecentCars.js` - Recent entries with reprint

### Data Layer
- SQLite database at `/storage/emulated/0/.psb-config/parking_slip_printer.db`
- Config files in `/storage/emulated/0/.psb-config/`

## Development Patterns

### State Management
- React hooks (useState, useEffect) for component state
- useRef for database connections and UI references
- Singleton pattern for BluetoothService

### Database Operations
- Transaction-based SQLite operations
- Error handling with toast notifications
- Helper functions for row processing

### Bluetooth Integration
- Event-driven connection handling
- Auto-reconnection logic for paired devices
- Graceful error handling for connection failures

## Environment Setup
1. React Native development environment
2. Android SDK for Android development
3. Physical Android device for Bluetooth testing
4. Bluetooth thermal printer for full functionality testing

## Common File Locations
- **Main logic**: `components/Main/Main.js`
- **Bluetooth service**: `components/BluetoothService.js`
- **Utilities**: `components/helper.js`
- **App config**: `app.json` (contains receipt images as base64)
- **Dependencies**: `package.json`

## Known Technical Constraints
- Bluetooth functionality requires physical device testing
- File system operations are Android-specific
- Receipt images stored as base64 in app.json
- Thai locale dependency for date formatting

## Development Workflow
- Use `npm start` for development server
- Use `npm run android` for device testing
- Use `npm run lint` before committing
- Test Bluetooth functionality on physical device only

## For New Claude Instances
1. Read CLAUDE.md for detailed technical info
2. Check DEVELOPMENT_LOG.md for recent changes
3. Use QUICK_START.md for immediate commands
4. Refer to TROUBLESHOOTING.md for common issues