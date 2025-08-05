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

---

## Code Refactoring & Optimization Plan

### Overview
Comprehensive plan for improving code quality, performance, maintainability, and modern React practices.

### Major Issues Identified

#### 1. **Architecture & Structure Issues**
- Monolithic Main.js component (400+ lines) handling too many responsibilities
- Mixed date libraries (both date-fns and moment.js)
- No proper state management pattern
- Missing TypeScript support
- Inconsistent error handling

#### 2. **Performance Issues**
- Database queries triggered on every render
- Missing React.memo optimization for child components
- Unused variables causing TypeScript warnings
- Inefficient re-renders due to direct state mutations

#### 3. **Code Quality Issues**
- Mixed variable declarations (`let` vs `const`)
- Inconsistent naming conventions
- Hardcoded strings throughout the codebase
- Missing PropTypes/TypeScript interfaces
- Commented-out code blocks

#### 4. **Modern React Anti-patterns**
- Missing custom hooks for reusable logic
- useEffect cleanup issues
- No proper dependency arrays
- Direct DOM manipulation with refs

### Refactoring Plan

#### Phase 1: Code Organization & Architecture
1. **Extract Custom Hooks**
   - `useDatabase()` - Database operations and state
   - `useBluetooth()` - Bluetooth connection management
   - `useParkingData()` - Parking records and statistics
   - `useFileSystem()` - File operations

2. **Create Service Layers**
   - `DatabaseService.js` - Centralized database operations
   - `PrinterService.js` - Printer formatting and operations
   - `FileService.js` - File system operations
   - `ConfigService.js` - App configuration management

3. **Component Restructuring**
   - Split Main.js into logical components
   - Create container/presentational component pattern
   - Extract reusable UI components

#### Phase 2: State Management & Data Flow
1. **Implement Context API**
   - AppContext for global state
   - Separate contexts for different concerns
   - Proper state normalization

2. **Optimize Database Operations**
   - Implement connection pooling
   - Add query optimization
   - Cache frequently accessed data
   - Add proper transaction handling

#### Phase 3: Performance Optimization
1. **React Optimization**
   - Add React.memo to components
   - Implement useCallback/useMemo where needed
   - Optimize render cycles
   - Remove unnecessary re-renders

2. **Memory Management**
   - Proper cleanup in useEffect
   - Remove event listeners on unmount
   - Optimize database connections

#### Phase 4: Code Quality & Maintainability
1. **Standardize Dependencies**
   - Remove moment.js, keep only date-fns
   - Consolidate UI libraries (choose between native-base and @rneui)
   - Update to latest React Native practices

2. **Error Handling & Logging**
   - Implement centralized error handling
   - Add proper logging service
   - Create user-friendly error messages
   - Add error boundaries

3. **Constants & Configuration**
   - Extract hardcoded values to constants
   - Create configuration files
   - Add environment-specific settings

#### Phase 5: Modern React Patterns
1. **Add TypeScript Support**
   - Convert .js files to .tsx
   - Add proper type definitions
   - Create interfaces for data structures

2. **Testing Infrastructure**
   - Add unit tests for services
   - Component testing with React Testing Library
   - Integration tests for critical flows

### Specific Optimizations

#### Main.js Refactoring
- Split into 5-6 smaller components
- Extract business logic to custom hooks
- Remove direct database calls from component
- Implement proper error boundaries

#### Database Layer
- Create centralized database service
- Add query builders for complex operations
- Implement proper connection management
- Add data validation layer

#### UI Components
- Create reusable components library
- Standardize styling approach
- Add accessibility features
- Implement responsive design patterns

#### Performance Improvements
- Lazy load components where possible
- Implement virtual scrolling for large lists
- Add image optimization
- Optimize bundle size

### Benefits Expected
- **50%+ reduction** in component complexity
- **Improved performance** through optimized re-renders
- **Better maintainability** with separated concerns
- **Enhanced developer experience** with TypeScript
- **Reduced bugs** through better error handling
- **Easier testing** with modular architecture

### Implementation Strategy
1. Create new optimized files alongside existing ones
2. Gradually migrate functionality
3. Test each phase thoroughly
4. Maintain backward compatibility
5. Update documentation as we go

This plan will transform the codebase into a modern, maintainable, and performant React Native application while preserving all existing functionality.