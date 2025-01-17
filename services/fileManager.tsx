import * as FileSystem from 'expo-file-system';

class FileManager {
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

      return filePath;
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw error;
    }
  }
}

export default FileManager;
