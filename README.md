# Welcome to DataTaker

This is our app for the Fortgeschrittenen Praktikum.

DataTaker is designed to simplify for taking data and the creation of (currently flat) databases.

## Collaborators

- Christian Voß
- Parviz Moskalenko
- Nguyen Ngoc Le Luong

## Features

- Easily create flat databases
- Input data of currently up to five data types:
- Text
- Numbers
- Booleans
- Pictures (by taking pictures or selecting from files)
- Enums (fully definable in-app)
- Save tables and continue taking data at any time
- Preview tables with image links
- Share .csv-files
- Compress .csv-files and images into .zip-files and share them
- Intuitive user interface
- Dark mode
- apk download for android
- iOS compatibility

## Developer Guide

### Setting Up the Development Environment

0. **Install Node.js**
   - Download and install Node.js from [nodejs.org](https://nodejs.org).
   - Ensure `npm` (Node Package Manager) is installed along with Node.js.

1. **Clone the Repository**
   
   Use Git to clone the project repository from GitHub:
   ```bash
   git clone https://github.com/vosschr/DataTaker.git
   ```
   Navigate into the project directory:
   ```bash
   cd DataTaker
   ```

2. **Install Project Dependencies**
   This step assumes you have already navigated to the cloned project directory. Run the following command to install all dependencies:
   ```bash
   npm install
   ```
   > Note: `react` and `react-native` are installed automatically.
   > If working in VSCode you might need to restart the TypeScript server by pressing `Ctrl + Shift + P` while having a `.tsx` file focused in the editor and selecting `TypeScript: Restart TS Server`.

3a. **Set Up Android Studio (Optional)**
   - Download and install [Android Studio](https://developer.android.com/studio) to use a virtual Android phone.
   - Configure an Android Virtual Device (AVD).

3b. **Expo Go App (Optional)**
   - Install the Expo Go app on your physical phone from the [Google Play Store](https://play.google.com/store) or [Apple App Store](https://www.apple.com/app-store/).

### Running the Project

1. **Start the Expo Development Server**
   Open a terminal (e.g., in VS Code) and run:
   ```bash
   npx expo start [-c]
   ```
   > The `-c` flag clears the cache, however it is significantly slower.

2. **Connect to the App**
   - **Using Expo Go App:**
     - Scan the QR code displayed in the terminal or browser using the Expo Go app.
   - **Using Virtual Device:**
     - Press `a` in the terminal to connect to an Android virtual phone.

### Debugging

- **Open Developer Menu**
  - **On Physical Device:** Shake the phone while running the app in Expo Go.
  - **On Terminal:** Press `Shift + M` and select **Toggle Developer Menu**.

This guide should help developers get started quickly with the project. For further assistance, refer to the [Expo Documentation](https://docs.expo.dev).
