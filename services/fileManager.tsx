import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { createZipFile } from 'react-native-zip-stream'; // (does not work)
//import { zip } from 'react-native-zip-archive'; (did not work)
//import jszip from 'jszip'; (did not work)

export default class FileManager {
  /**
   * Converts a plain JavaScript object into a CSV format and saves it to the
   * specified directory under `${FileSystem.documentDirectory}DataTaker/data/`.
   * @param data - An array of plain JavaScript objects.
   * @returns A promise that resolves with the file URI on success or rejects with an error message.
   */
  static async outputCSV(data: object[]): Promise<string> {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Input must be an array of plain objects.');
      }

      if (data.length === 0) {
        throw new Error('Input array must not be empty.');
      }

      // Generate the CSV header from the object keys
      const headers = Object.keys(data[0]);

      // Map the data to CSV rows
      const csvRows = data.map((row: any) => {
        return headers.map(header => {
          const cell = row[header];
          // Escape double quotes by doubling them and wrap fields containing commas or quotes in quotes
          return typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell;
        }).join(',');
      });

      // Combine headers and rows into a single CSV string
      const csvContent = [headers.join(','), ...csvRows].join('\n');

      // Define file path
      const filePath = `${FileSystem.documentDirectory}DataTaker/data/output.csv`;

      // Write the CSV content to the file
      await FileSystem.writeAsStringAsync(filePath, csvContent);

      await Sharing.shareAsync(
        `${FileSystem.documentDirectory}DataTaker/data/output.csv`, 
        {dialogTitle: 'share or copy your DB via'}
     ).catch(error =>{
        console.log(error);
     })

      return filePath;
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw error;
    }
  }

  /**
   * Copys a picture from cache to app-directory and returns new path
   * @param localUri - Path from ImagePicker (file:///...)
   * @returns New Path in App-Directory
   */
  static async saveImageToAppFolder(localUri: string): Promise<string> {
    try {
      const imagesDir = `${FileSystem.documentDirectory}DataTaker/images/`;
      // Generate folder (if needed)
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

      // Generate name
      const timestamp = Date.now();
      const fileName = `photo_${timestamp}.jpg`; 
      const newPath = imagesDir + fileName;

      // Copy
      await FileSystem.copyAsync({
        from: localUri,
        to: newPath,
      });

      return newPath;
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  }

  /**
   * Shares a folder containing a CSV file and an images subfolder.
   * @param data - An array of plain JavaScript objects to be converted to CSV.
   * @param imageUris - An array of URIs of the images to be included in the images subfolder.
   * @returns A promise that resolves when the folder is shared.
   */
  static async shareFolderWithCSVAndImages(data: object[], imageUris: string[]) {
    try {
      // Create a temporary directory
      console.log("DEBUG: creating temporary directory.");
      const tempDir: string = `${FileSystem.cacheDirectory}DataTakerExport_${Date.now()}/`;
      console.log("DEBUG: tempDir (source): ", tempDir);
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

      // Generate and save the CSV file
      console.log("DEBUG: generating CSV file.");
      const csvFilePath = `${tempDir}output.csv`;
      console.log("DEBUG: csvFilePath: ", csvFilePath);
      await this.csvToPath(data, csvFilePath);

      // Create an images subfolder
      console.log("DEBUG: creating images subfolder.");
      const imagesDir = `${tempDir}images/`;
      console.log("DEBUG: imagesDir: ", imagesDir);
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

      // Copy images to the images subfolder
      console.log("DEBUG: copying images to images subfolder.");
      for (const imageUri of imageUris) {
        const timestamp = Date.now();
        const fileName = `photo_${timestamp}.jpg`;
        const newPath = `${imagesDir}${fileName}`;
        await FileSystem.copyAsync({
          from: imageUri,
          to: newPath,
        });
      }

      // Compress the folder into a ZIP file (doesn't seem to work)
      console.log("DEBUG: compressing folder into ZIP file.");
      const zipFilePath: string = `${FileSystem.cacheDirectory}DataTakerExport_${Date.now()}.zip`;
      console.log("DEBUG: zipFilePath (target): ", zipFilePath);
      //await zip([tempDir], zipFilePath);
      const exampleCreateZipFile = async () => {
        try {
          const success = await createZipFile(tempDir, zipFilePath);
          console.log('Zip creation successful:', success);
        } catch (error) {
          console.error('Error creating zip file:', error);
        }
      };

      await exampleCreateZipFile();

      // Share the ZIP file
      console.log("DEBUG: sharing ZIP file.");
      await Sharing.shareAsync(zipFilePath, {
        dialogTitle: 'Share your data and images',
      }).catch(error =>{
        console.log(error);
      })

      // Share the folder (Android only) (does also not seem to work)
      //await Sharing.shareAsync(tempDir, {
      //  dialogTitle: 'Share your data and images',
      //});

      // Clean up temporary files and directories
      console.log("DEBUG: cleaning up temporary files and directories.");
      await FileSystem.deleteAsync(tempDir, { idempotent: true });
      await FileSystem.deleteAsync(zipFilePath, { idempotent: true });

    } catch (error) {
      console.error('Error sharing folder:', error);
      throw error;
    }
  }

  /**
   * Helper method to output CSV to a specific file path.
   * @param data - An array of plain JavaScript objects.
   * @param filePath - The file path where the CSV should be saved.
   */
  private static async csvToPath(data: object[], filePath: string): Promise<void> {
    if (!Array.isArray(data)) {
      throw new Error('Input must be an array of plain objects.');
    }

    if (data.length === 0) {
      throw new Error('Input array must not be empty.');
    }

    const headers = Object.keys(data[0]);
    const csvRows = data.map((row: any) => {
      return headers.map(header => {
        const cell = row[header];
        return typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
          ? `"${cell.replace(/"/g, '""')}"`
          : cell;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    await FileSystem.writeAsStringAsync(filePath, csvContent);
  }
  
}
