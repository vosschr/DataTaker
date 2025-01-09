# Welcome to DataTaker

This is our app for the Fortgeschrittenen Praktikum.

## Collaborators

- Parviz Moskalenko
- Nguyen Ngoc Le Luong
- Christian Voß

# Developer Guide

## Setting Up the Development Environment

1. **Clone the Repository**
   
   Use Git to clone the project repository from GitHub:
   ```bash
   git clone https://github.com/vosschr/DataTaker.git
   ```
   Navigate into the project directory:
   ```bash
   cd DataTaker
   ```

3. **Install Node.js**
   - Download and install Node.js from [nodejs.org](https://nodejs.org).
   - Ensure `npm` (Node Package Manager) is installed along with Node.js.

4. **Install Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

5. **Install Project Dependencies**
   This step assumes you have already navigated to the cloned project directory. Run the following command to install all dependencies:
   ```bash
   npm install
   ```

6. **Additional Expo Packages**
   Install the following Expo packages if needed:
   ```bash
   npm install expo-router expo-sqlite expo-camera expo-file-system @react-native-picker/picker
   ```
   > Note: `react` and `react-native` are installed automatically.
   > If working in VSCode you might need to restart the TypeScript server by pressing `Ctrl + Shift + P` while having a `.tsx` file focused in the editor and selecting `TypeScript: Restart TS Server`.

7. **Set Up Android Studio (Optional)**
   - Download and install [Android Studio](https://developer.android.com/studio) to use a virtual Android phone.
   - Configure an Android Virtual Device (AVD).

8. **Expo Go App** (Optional)
   - Install the Expo Go app on your physical phone from the [Google Play Store](https://play.google.com/store) or [Apple App Store](https://www.apple.com/app-store/).

## Running the Project

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

## Debugging

- **Open Developer Menu**
  - **On Physical Device:** Shake the phone while running the app in Expo Go.
  - **On Terminal:** Press `Shift + M` and select **Toggle Developer Menu**.

This guide should help developers get started quickly with the project. For further assistance, refer to the [Expo Documentation](https://docs.expo.dev).
