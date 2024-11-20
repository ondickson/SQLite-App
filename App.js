import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

export default function App() {
  const [db, setDb] = useState(null);
  const [offlineDB, setOfflineDB] = useState([]); // Replaces 'todos'
  const [name, setName] = useState("");
  const [type, setType] = useState();
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [areaid, setAreaId] = useState();
  const [meterno, setMeterNo] = useState();
  const [metersize, setMeterSize] = useState();

  // Open the database asynchronously
  const openDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync("OfflineDB.db");
      setDb(database); // Save the db reference
      console.log("Database opened:", database);

      // Initialize the database if it's the first time opening
      await initializeDatabase(database);
    } catch (error) {
      console.log("Failed to open database:", error);
    }
  };

  // Initialize the database: create tables
  const initializeDatabase = async (db) => {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL, 
        type TEXT NOT NULL,
        address TEXT NOT NULL, 
        status TEXT NOT NULL,
        areaid TEXT NOT NULL,
        metersize TEXT NOT NULL, 
        meterno TEXT NOT NULL
      );
    `);
    console.log("Database initialized.");
  };

  // Insert data into the database
  const saveData = async () => {
    if (!db) return;
    if (
      !name ||
      !type ||
      !address ||
      !status ||
      !areaid ||
      !metersize ||
      !meterno
    ) {
      console.log("Please fill in all fields.");
      return;
    }
    try {
      await db.runAsync(
        "INSERT INTO accounts (name, type, address, status, areaid, metersize, meterno) VALUES (?, ?, ?, ?, ?, ?, ?)",
        name,
        type,
        address,
        status,
        areaid,
        metersize,
        meterno
      );
      console.log("Data saved successfully.");
      setName("");
      setType("");
      setAddress("");
      setStatus("");
      setAreaId("");
      setMeterSize("");
      setMeterNo("");
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  // Fetch all data from the database
  const fetchData = async () => {
    if (!db) return;
    try {
      const result = await db.getAllAsync("SELECT * FROM accounts");
      setOfflineDB(result);
      console.log("Data fetched successfully.");
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    openDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>OfflineDB - User Data</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Status (active/inactive)"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Area ID"
        value={areaid}
        onChangeText={setAreaId}
      />
      <TextInput
        style={styles.input}
        placeholder="Meter Size"
        value={metersize}
        onChangeText={setMeterSize}
      />
      <TextInput
        style={styles.input}
        placeholder="Meter No."
        value={meterno}
        onChangeText={setMeterNo}
      />

      {/* Save and View Buttons */}
      <Button title="Save" onPress={saveData} />
      <Button title="View All Data" onPress={fetchData} />

      {/* Display Data */}
      {offlineDB.length === 0 ? (
        <Text>No data available</Text>
      ) : (
        <FlatList
          data={offlineDB}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <Text>Name: {item.name}</Text>
              <Text>Type: {item.type}</Text>
              <Text>Address: {item.address}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Area ID: {item.areaid}</Text>
              <Text>Meter Size: {item.metersize}</Text>
              <Text>Meter No: {item.meterno}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todoItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
