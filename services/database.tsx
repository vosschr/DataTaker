/**
 * DAO (Database access object) for creating and manipulating flat databases using expo-sqlite
 */
import * as SQLite from 'expo-sqlite';

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
        const db = await SQLite.openDatabaseAsync(`${tableName}.db`);

        // put together tableSchema string for the SQL query
        // the quotes around ${column} are necessary in case sql key-words are used as column names
        const columns = Object.entries(tableSchema)
            .map(([column, type]) => `"${column}" ${type}`)
            .join(', ');
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

    /** reading data from table tableName
     * 
     * @param tableName - string name of the table (that is also by default the database name)
     * @returns - table in object form
    */
    query: async (tableName: string) => {
        //TODO: check if db and table exist
        const db = await SQLite.openDatabaseAsync(`${tableName}.db`); // open db
        //TODO: read table with sql query
        //TODO: convert to object and return
        //temporary test query:
        const allRows: object[] = await db.getAllAsync(`SELECT * FROM ${tableName};`);
        for (const row of allRows) { // iterate through all rows
            for (const [key, value] of Object.entries(row)) {  // iterate through all columns
                console.log(`${key}: ${value}`);  // test console output
            }
        }
        await db.closeAsync();
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
        const db = await SQLite.openDatabaseAsync(`${tableName}.db`); // open db

        // convert object to strings used for query
        const columns = Object.keys(record).join(', ');
        const values = Object.values(record);
        const placeholders = Object.keys(record).map(() => '?').join(', ');

        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;
        //example: "INSERT INTO animals (name, age, type) VALUES (?, ?, ?)"
        //the '?' will be replaced by the values (e.g. 'Findus', 12, 'Cat')

        //add to table with sql query
        await db.runAsync(sql, values);
        await db.closeAsync();
    },

    deleteDatabase: async (tableName: string) => {
        //TODO: warning for deleting database
        await SQLite.deleteDatabaseAsync(tableName); // might require some permissions
    },
}
