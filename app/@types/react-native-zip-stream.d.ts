declare module 'react-native-zip-stream' {
    export function createZipFile(
      sourcePath: string,
      targetPath: string,
    ): Promise<void>;
  }