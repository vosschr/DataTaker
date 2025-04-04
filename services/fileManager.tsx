import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";

export default class FileManager {
    private static uriToFileName(uri: string): string {
        // Extract the file name from the URI
        const parts = uri.split("/");
        return parts[parts.length - 1];
    }

    /**
     * Creates a CSV string from an array of objects
     * and returns this string (e.g. to add it to the ZIP).
     */
    private static generateCSV(data: object[]): string {
        if (!Array.isArray(data) || data.length === 0) {
            return "";
        }

        // CSV header from the keys of the first object
        const headers = Object.keys(data[0]);

        // go through each row and get the string value of each cell
        const csvRows = data.map((row: any) => {
            return headers
                .map((header) => {
                    let cell = row[header];

                    // If the cell is a string and contains slashes, keep everything after the last slash
                    if (typeof cell === "string" && cell.includes("/")) {
                        cell = cell.split("/").pop(); // Get everything after the last slash
                    }

                    // If commas or quotes are present, escape them properly
                    return typeof cell === "string" &&
                        (cell.includes(",") || cell.includes('"'))
                        ? `"${cell.replace(/"/g, '""')}"`
                        : cell;
                })
                .join(",");
        });

        // Combine header and rows
        const csvContent = [headers.join(","), ...csvRows].join("\n");
        return csvContent;
    }

    /**
     * Copies an image from the cache directory to the app directory and returns the new path.
     */
    static async saveImageToAppFolder(localUri: string): Promise<string> {
        try {
            const imagesDir = `${FileSystem.documentDirectory}DataTaker/images/`;
            await FileSystem.makeDirectoryAsync(imagesDir, {
                intermediates: true,
            });

            const fileName = this.uriToFileName(localUri);
            const newPath = imagesDir + fileName;

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
     * Reads an array of objects (data) as CSV
     * plus images (imageUris) from the file system,
     * packs everything into a ZIP in memory using JSZip, and shares it.
     */
    static async shareFolderWithCSVAndImages(
        data: object[],
        imageUris: string[]
    ) {
        try {
            console.log("DEBUG: Generating in-memory ZIP with JSZip.");

            // 1) Create a new JSZip instance
            const zip = new JSZip();

            // 2) Generate CSV and add it to the ZIP
            const csvContent = this.generateCSV(data);
            zip.file("output.csv", csvContent);

            // 3) Create an images subfolder in the ZIP
            const imagesFolder = zip.folder("images");
            if (!imagesFolder) {
                throw new Error("Could not create images folder in ZIP.");
            }

            // 4) For each image, read it as Base64 and add it to the images/ folder
            for (const imageUri of imageUris) {
                const fileName = this.uriToFileName(imageUri);

                // Read the image as Base64
                const base64Data = await FileSystem.readAsStringAsync(
                    imageUri,
                    {
                        encoding: FileSystem.EncodingType.Base64,
                    }
                );

                // Add the Base64 data to the images/ folder in the ZIP
                imagesFolder.file(fileName, base64Data, { base64: true });
            }

            // 5) Generate the ZIP in Base64 format
            const base64Zip = await zip.generateAsync({ type: "base64" });

            // 6) Write the ZIP file to the device
            const zipFilePath = `${
                FileSystem.cacheDirectory
            }DataTakerExport_${Date.now()}.zip`;
            await FileSystem.writeAsStringAsync(zipFilePath, base64Zip, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // 7) Share the ZIP file
            console.log("DEBUG: Sharing ZIP file at", zipFilePath);
            await Sharing.shareAsync(zipFilePath, {
                dialogTitle: "Share your data and images",
            }).catch((error) => {
                console.log(error);
            });

            // 8) Clean up: delete the ZIP file (optional)
            await FileSystem.deleteAsync(zipFilePath, { idempotent: true });

            console.log("DEBUG: Finished sharing ZIP file.");
        } catch (error) {
            console.error("Error creating or sharing ZIP:", error);
            throw error;
        }
    }

    /**
     * Example function to export/share a CSV separately.
     */
    static async outputCSV(data: object[]): Promise<string> {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Input data array must not be empty.");
            }

            const csvContent = this.generateCSV(data);
            const filePath = `${FileSystem.documentDirectory}DataTaker/data/output.csv`;

            // Create the directory if needed
            await FileSystem.makeDirectoryAsync(
                `${FileSystem.documentDirectory}DataTaker/data/`,
                { intermediates: true }
            );

            // Write the CSV content to the file
            await FileSystem.writeAsStringAsync(filePath, csvContent);

            // Share the file
            await Sharing.shareAsync(filePath, {
                dialogTitle: "Share or copy your DB via",
            }).catch((error) => {
                console.log(error);
            });

            return filePath;
        } catch (error) {
            console.error("Error generating CSV:", error);
            throw error;
        }
    }
}
