/**
 * DAO (Database access object) for creating and manipulating flat databases using expo-sqlite
 */
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

import { getCurrentLocation } from "./geotag";

export type TableInfo = {
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: string | null;
    pk: number;
};

export type TableSettings = {
    auto_ids: boolean;
    date: boolean;
    geoTag: boolean;
};

export const TABLE_DIR = `${FileSystem.documentDirectory}DataTaker/tables/`;
export const DATA_DIR = `${FileSystem.documentDirectory}DataTaker/data/`;

export const DataBase = {
    /** creating a database with one table (aka flat db)
     * 
     * @param tableName - string name for the table and db
     * @param tableSchema - keys are the columns, values a string for the type and further requirements
     * example of a tableSchema:
     *  const tableSchema = {
            id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
            name: 'TEXT NOT NULL',
            email: 'TEXT UNIQUE NOT NULL'
        };
     */
    initializeDatabase: async (
        tableName: string,
        tableSchema: object,
        tableSettings: TableSettings
    ) => {
        console.log("DEBUG: initializing Database.");
        console.log("DEBUG: talbeName: ", tableName);

        // create empty db with file
        const db = await SQLite.openDatabaseAsync(
            `${TABLE_DIR}${tableName}.db`
        );

        // add an auto-incrementing ID column to the table schema
        if (tableSettings.auto_ids) {
            tableSchema = {
                id: "INTEGER PRIMARY KEY AUTOINCREMENT",
                ...tableSchema, // Spread the rest of the schema
            };
            console.log("DEBUG: tableSchema: ", tableSchema);
        }

        // add date to table schema
        if (tableSettings.date) {
            tableSchema = {
                date: "TEXT",
                ...tableSchema, // Spread the rest of the schema
            };
            console.log("DEBUG: tableSchema: ", tableSchema);
        }

        // add geo tag to table schema
        if (tableSettings.geoTag) {
            tableSchema = {
                latitude: "REAL",
                longitude: "REAL",
                ...tableSchema, // Spread the rest of the schema
            };
            console.log("DEBUG: tableSchema: ", tableSchema);
        }

        // put together tableSchema string for the SQL query
        // the quotes around ${column} are necessary in case sql key-words are used as column names
        const columns = Object.entries(tableSchema)
            .map(([column, type]) => `"${column}" ${type}`)
            .join(", ");
        console.log("DEBUG: columns:", columns);

        const query = `
PRAGMA journal_mode = WAL; --Write-Ahead Logging for perfomance boost
CREATE TABLE IF NOT EXISTS [${tableName}] (${columns});
            `;
        console.log("DEBUG: query: ", query);

        // execute query
        await db.execAsync(query);

        await db.closeAsync();
    },

    /** Reading data from table tableName.
     *
     * @param tableName - string name of the table (that is also by default the database name)
     * @returns - Promise<object[]> table
     */
    queryAll: async (tableName: string): Promise<object[]> => {
        const tableSettings: TableSettings = await DataBase.getTableSettings(
            tableName
        );
        console.log("DEBUG: tableSettings: ", tableSettings);

        console.log("DEBUG: querying ", tableName);

        // Check if db and table exist
        const db = await SQLite.openDatabaseAsync(
            `${TABLE_DIR}${tableName}.db`
        );

        try {
            // First verify table exists
            const tableExists = await db.getFirstAsync(
                `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
                [tableName]
            );

            if (!tableExists) {
                throw new Error(`Table ${tableName} does not exist`);
            }

            // If id column exists, include it in the query
            if (tableSettings.auto_ids) {
                // Get all rows from the table
                const allRows: object[] = await db.getAllAsync(
                    `SELECT id, * FROM [${tableName}];`
                );

                await db.closeAsync();
                return allRows;
            }

            // Get all rows from the table
            const allRows: object[] = await db.getAllAsync(
                `SELECT * FROM [${tableName}];`
            );

            await db.closeAsync();
            return allRows;
        } catch (error) {
            let message;
            if (error instanceof Error) {
                message = error.message;
            } else {
                message = String(error);
            }
            throw new Error(`Failed to query table ${tableName}: ${message}`);
        }
    },

    getImagePaths: async (tableName: string): Promise<string[]> => {
        // this is a hack and will not worked if there is a string that looks like a path but isnt
        //TODO: think of more robust solution
        const tableData: object[] = await DataBase.queryAll(tableName);

        // Function to check if a value is an image path (hacky)
        const isImagePath = (value: any): boolean => {
            return typeof value === "string" && value.startsWith("file://");
        };

        // Extract all image paths from the table data
        const imagePaths: string[] = tableData
            .flatMap((row) => Object.values(row)) // Flatten all values into a single array
            .filter((value) => isImagePath(value)); // Filter for values that are image paths

        console.log("DEBUG: imagePaths: ", imagePaths);
        return imagePaths;
    },

    /** adding data to a given table
     * 
     * @param tableName - string name of the table (that is also by default the database name)
     * @param record - the column to insert as an object of form:
     *  const exampleRecord = {
            name: 'Findus',
            age: 12,
            type: 'Cat'
        };
     */
    addRow: async (tableName: string, record: object) => {
        const tableSettings: TableSettings = await DataBase.getTableSettings(
            tableName
        );
        console.log("DEBUG: addRow: tableSettings: ", tableSettings);

        console.log("DEBUG: adding to ", tableName);
        //TODO: check if db and table exist
        //TODO: check matching table schema to record
        const db = await SQLite.openDatabaseAsync(
            `${TABLE_DIR}${tableName}.db`
        ); // open db
        // Get the current date
        if (tableSettings.date) {
            console.log("DEBUG: adding date to record");
            const currentDate = new Date().toISOString(); // ISO format date
            record = {
                ...record,
                date: currentDate,
            };
        }
        console.log("DEBUG: not adding date to record");

        // Get the current location
        if (tableSettings.geoTag) {
            console.log("DEBUG: adding geotag to record");
            const geotag: { latitude: number; longitude: number } | null =
                await getCurrentLocation();
            record = {
                ...record,
                longitude: geotag?.latitude,
                latitude: geotag?.longitude,
            };
        }
        console.log("DEBUG: not adding geotag to record");

        // convert object to strings used for query
        const columns = Object.keys(record)
            .map((key) => `'${key}'`)
            .join(", ");
        console.log("DEBUG: columns: ", columns);
        const values = Object.values(record);
        console.log("DEBUG: values: ", values);
        const placeholders = Object.keys(record)
            .map(() => "?")
            .join(", ");
        console.log("DEBUG: placeholders: ", placeholders);

        const sql = `INSERT INTO [${tableName}] (${columns}) VALUES (${placeholders});`;
        console.log("DEBUG: sql: ", sql);
        //example: "INSERT INTO animals (name, age, type) VALUES (?, ?, ?)"
        //the '?' will be replaced by the values (e.g. 'Findus', 12, 'Cat')

        //add to table with sql query
        await db.runAsync(sql, values);
        await db.closeAsync();
        console.log("DEBUG: finished adding to ", tableName);
    },

    deleteDatabase: async (tableName: string) => {
        console.log("DEBUG: deleting ", tableName);
        await SQLite.deleteDatabaseAsync(`${TABLE_DIR}${tableName}.db`); // might require some permissions
        const fileInfo = await FileSystem.getInfoAsync(
            `${TABLE_DIR}${tableName}.db`
        );

        if (fileInfo.exists) {
            console.error("Database deletion failed - file still exists");
            return false;
        } else {
            console.log("DEBUG: deletion successful.");
        }
    },

    /**
     * * Retrieves the schema information (columns) of a given table in the database.
     *
     * This method executes a `PRAGMA table_info()` query to fetch detailed information
     * about the columns of the specified table, such as column names, types, default values,
     * and whether the column is part of the primary key.
     *
     * @param tableName - The name of the table whose column information is to be retrieved.
     *                    This table name should match the name used during database creation.
     *
     * @returns - A promise that resolves to an array of `TableInfo` objects, each representing
     *            a column in the table. The `TableInfo` objects contain the following properties:
     *            - `cid`: The column ID (integer).
     *            - `name`: The name of the column (string).
     *            - `type`: The type of the column (string).
     *            - `notnull`: A flag indicating whether the column is `NOT NULL` (integer).
     *            - `dflt_value`: The default value of the column (string or null).
     *            - `pk`: A flag indicating whether the column is part of the primary key (integer).
     *
     *            Example of the returned structure:
     *            [
     *              {
     *                cid: 0,
     *                name: "id",
     *                type: "INTEGER",
     *                notnull: 1,
     *                dflt_value: null,
     *                pk: 1
     *              },
     *              ...
     *            ]
     *
     * @example
     * // Example usage of `getColumns` method
     * const columns = await DataBase.getColumns("users");
     * console.log(columns); // Logs an array of column details for the "users" table
     */
    getColumns: async (tableName: string) => {
        console.log("DEBUG: getting columns of ", tableName);
        //TODO: check if db and table exist
        //TODO: check matching table schema to record
        try {
            // Open the database
            const db = await SQLite.openDatabaseAsync(
                `${TABLE_DIR}${tableName}.db`
            );

            const query = `PRAGMA table_info([${tableName}]);`;
            console.log("DEBUG: trying to query", query);

            // Execute the PRAGMA query and await the result
            const result: TableInfo[] = await db.getAllAsync(query);

            await db.closeAsync();

            // Log the result for testing
            console.log(result);

            return result; // Return the result for further use
        } catch (error) {
            console.error("Error getting columns:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    },

    getTableSettings: async (tableName: string): Promise<TableSettings> => {
        console.log("DEBUG: getting table settings of ", tableName);
        // re-create table settings by looking ad column names
        const DBcols: TableInfo[] = await DataBase.getColumns(tableName);
        console.log("DEBUG: DBcols: ", DBcols);

        return {
            auto_ids: DBcols.some((col) => col.name === "id"),
            date: DBcols.some((col) => col.name === "date"),
            geoTag:
                DBcols.some((col) => col.name === "latitude") &&
                DBcols.some((col) => col.name === "longitude"),
        };
    },
};
