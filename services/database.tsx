/**
 * DAO (Database access object) for creating and manipulating flat databases using expo-sqlite
 */
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export type TableInfo = {
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: string | null;
    pk: number;
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
    initializeDatabase: async (tableName: string, tableSchema: object) => {
        console.log("DEBUG: initializing Database.");
        console.log("DEBUG: talbeName: ", tableName);
        console.log("DEBUG: tableSchema: ", tableSchema);

        // create empty db with file
        const db = await SQLite.openDatabaseAsync(
            `${TABLE_DIR}${tableName}.db`
        );

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

            // Get all rows from the table
            const allRows: object[] = await db.getAllAsync(
                `SELECT * FROM [${tableName}];`
            );

            return allRows;
        } catch (error) {
            let message;
            if (error instanceof Error) {
                message = error.message;
            }
	        else {
                message = String(error);
            }
            throw new Error(`Failed to query table ${tableName}: ${message}`);
        } finally {
            await db.closeAsync();
        }
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
        //TODO: check if db and table exist
        //TODO: check matching table schema to record
        const db = await SQLite.openDatabaseAsync(
            `${TABLE_DIR}${tableName}.db`
        ); // open db

        // convert object to strings used for query
        const columns = Object.keys(record).map(key => `'${key}'`).join(", ");
        const values = Object.values(record);
        const placeholders = Object.keys(record)
            .map(() => "?")
            .join(", ");

        const sql = `INSERT INTO [${tableName}] (${columns}) VALUES (${placeholders});`;
        //example: "INSERT INTO animals (name, age, type) VALUES (?, ?, ?)"
        //the '?' will be replaced by the values (e.g. 'Findus', 12, 'Cat')

        //add to table with sql query
        await db.runAsync(sql, values);
        await db.closeAsync();
    },

    deleteDatabase: async (tableName: string) => {
        //TODO: warning for deleting database
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
        //TODO: check if db and table exist
        //TODO: check matching table schema to record
        try {
            // Open the database
            const db = await SQLite.openDatabaseAsync(
                `${TABLE_DIR}${tableName}.db`
            );

            // Execute the PRAGMA query and await the result
            const result: TableInfo[] = await db.getAllAsync(
                `PRAGMA table_info([${tableName}]);`
            );

            db.closeAsync();

            // Log the result for testing
            console.log(result);

            return result; // Return the result for further use
        } catch (error) {
            console.error("Error getting columns:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    },
};
