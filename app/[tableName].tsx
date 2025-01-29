import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, DataTable, Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { DataBase } from "@/services/database";

export default function TableDataScreen() {
  const { tableName } = useLocalSearchParams();
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof tableName === "string") {
          const data = await DataBase.queryAll(tableName);
          setTableData(data);
          
          if (data.length > 0) {
            setColumns(Object.keys(data[0]));
          }
        }
      } catch (error) {
        console.error("Error loading table data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tableName]);

  if (typeof tableName !== "string") {
    return <Text>Invalid table name</Text>;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {tableName}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <DataTable>
          <DataTable.Header>
            {columns.map((column) => (
              <DataTable.Title key={column}>{column}</DataTable.Title>
            ))}
          </DataTable.Header>

          {tableData.map((row, index) => (
            <DataTable.Row key={index}>
              {columns.map((column) => (
                <DataTable.Cell key={`${index}-${column}`}>
                  {String(row[column])}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}

          {tableData.length === 0 && (
            <DataTable.Row>
              <DataTable.Cell>No data found</DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
});