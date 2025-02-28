import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, Menu, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

type TableProps = {
  tableName: string;
  onAction: (action: string, tableName: string) => void;
};

export default function Table({ tableName, onAction }: TableProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const router = useRouter();

  function pushRouter() {
    router.push(`/${encodeURIComponent(tableName)}`);
    console.log("Navigating to:", `/${encodeURIComponent(tableName)}`);
  }

  return (
    <Card style={styles.card} onPress={pushRouter} >
      <Card.Title
        titleStyle={{fontWeight: "bold"}}
        title={tableName}
        right={(props) => (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            // Das IconButton ist der Anker für das Menü
            anchor={
              <IconButton
                {...props}
                icon="dots-vertical"
                onPress={openMenu}
              />
            }
          >
            <Menu.Item
              leadingIcon="forward"
              onPress={() => {
                closeMenu();
                onAction("take data", tableName);
              }}
              title="Take Data"
            />
            <Menu.Item
              leadingIcon="trash-can-outline"
              onPress={() => {
                closeMenu();
                onAction("delete", tableName);
              }}
              title="Delete Table"
            />
            <Menu.Item
              leadingIcon="export-variant"
              onPress={() => {
                closeMenu();
                onAction("export", tableName);
              }}
              title="Export .csv"
            />
          </Menu>
        )}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "center",
    elevation: 2, // kleiner Schatten
    marginBottom: 5, //unterer Abstand zu jedem anderen table
  },
});
