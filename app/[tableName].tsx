import { useEffect, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Image as RNImage } from "react-native";
import { ActivityIndicator, DataTable, Text, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { DataBase } from "@/services/database";

export default function TableDataScreen() {
  const { tableName } = useLocalSearchParams();
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Helper-Funktion: Gibt nur den Dateinamen zurück
  const extractFileName = (path: string): string => {
    return path.substring(path.lastIndexOf("/") + 1);
  };

  // Helper-Funktion: Prüft, ob ein Pfad auf ein Bild verweist
  const isImagePath = (path: string): boolean => {
    return /\.(jpg|jpeg|png|gif)$/i.test(path);
  };

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
              {columns.map((column) => {
                const cellValue = String(row[column]);
                let displayValue = cellValue;
                if (isImagePath(cellValue)) {
                  displayValue = extractFileName(cellValue);
                }
                return (
                  <DataTable.Cell key={`${index}-${column}`}>
                    {isImagePath(cellValue) ? (
                      <TouchableOpacity onPress={() => setSelectedImage(cellValue)}>
                        <Text style={styles.imageText}>{displayValue}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text>{displayValue}</Text>
                    )}
                  </DataTable.Cell>
                );
              })}
            </DataTable.Row>
          ))}

          {tableData.length === 0 && (
            <DataTable.Row>
              <DataTable.Cell>No data found</DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      )}

      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedImage && (
              <RNImage source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
            )}
            <Button mode="contained" onPress={() => setSelectedImage(null)}>
              Schließen
            </Button>
          </View>
        </View>
      </Modal>
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
  imageText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "80%",
    marginBottom: 10,
  },
});
