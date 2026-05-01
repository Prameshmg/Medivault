import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RecordDetailsScreen = ({ route, navigation }) => {
  const { record } = route.params;
  const { user } = useContext(AuthContext);
  const API_URL = `https://medivault-production-888f.up.railway.app/api/records/${record._id}`;

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(API_URL, {
                headers: { Authorization: `Bearer ${user.token}` }
              });
              navigation.navigate('MainTabs', { screen: 'Dashboard' });
            } catch (error) {
              console.error(error);
              alert('Failed to delete record');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{record.category}</Text>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Patient:</Text>
          <Text style={styles.value}>{record.patientName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{record.doctorName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hospital:</Text>
          <Text style={styles.value}>{record.hospitalName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(record.date).toLocaleDateString()}</Text>
        </View>

        {record.imageUrl && (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>Attached Document:</Text>
            {/* The base URL must be the backend server IP */}
            <Image 
              source={{ uri: `https://medivault-production-888f.up.railway.app${record.imageUrl}` }} 
              style={styles.image} 
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditRecord', { record })}>
            <Text style={styles.btnText}>Edit Record</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.btnText}>Delete Record</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 20, elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#007bff', textAlign: 'center', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#ddd', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  value: { fontSize: 16, color: '#333', flexShrink: 1, marginLeft: 10 },
  imageContainer: { marginTop: 20 },
  image: { width: '100%', height: 300, marginTop: 10, borderRadius: 8, backgroundColor: '#eee' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  editBtn: { flex: 1, backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginRight: 10 },
  deleteBtn: { flex: 1, backgroundColor: '#dc3545', padding: 15, borderRadius: 8, alignItems: 'center', marginLeft: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default RecordDetailsScreen;
