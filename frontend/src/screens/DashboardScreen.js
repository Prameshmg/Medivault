import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const API_URL = 'https://medivault-production-888f.up.railway.app/api/records';

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRecords();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || record.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('RecordDetails', { record: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons name="file-document" size={20} color="#007bff" />
          <Text style={styles.cardTitle}>{item.category}</Text>
        </View>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="account" size={16} color="#555" />
          <Text style={styles.cardText}> Patient: {item.patientName}</Text>
        </View>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="stethoscope" size={16} color="#555" />
          <Text style={styles.cardText}> Doctor: {item.doctorName}</Text>
        </View>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="hospital-box" size={16} color="#555" />
          <Text style={styles.cardText}> {item.hospitalName}</Text>
        </View>
      </View>

      <View style={styles.feeContainer}>
        <Text style={styles.feeText}>Base Fee: {item.fee > 0 ? `Rs. ${item.fee} LKR` : 'Free (Gov)'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, {user.fullName}</Text>
          <Text style={styles.nicText}>NIC Profile: {user.nicNumber}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search by Doctor Name..." 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
        <View style={styles.toggleRow}>
          {['All', 'Prescription', 'Lab Report'].map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.toggleBtn, filterCategory === cat && styles.activeToggleBtn]}
              onPress={() => setFilterCategory(cat)}
            >
              <Text style={[styles.toggleText, filterCategory === cat && styles.activeToggleText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />
      ) : filteredRecords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="file-alert" size={60} color="#bbb" />
          <Text style={styles.emptyText}>No records found.</Text>
          <Text style={styles.emptySubText}>Click 'Add Record' below to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={fetchRecords}
          refreshing={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', elevation: 2 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  nicText: { fontSize: 12, color: '#666', marginTop: 2 },
  logoutBtn: { backgroundColor: '#dc3545', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  
  filterContainer: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  searchInput: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: '#eee', marginHorizontal: 2, borderRadius: 5 },
  activeToggleBtn: { backgroundColor: '#007bff' },
  toggleText: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  activeToggleText: { color: '#fff' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 15 },
  emptySubText: { fontSize: 14, color: '#888', marginTop: 5, textAlign: 'center' },
  
  card: { backgroundColor: '#fff', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10, marginBottom: 10 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginLeft: 8 },
  dateText: { color: '#888', fontSize: 12 },
  cardContent: { marginBottom: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#444' },
  feeContainer: { backgroundColor: '#e9f5ff', padding: 8, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  feeText: { color: '#0056b3', fontWeight: 'bold', fontSize: 13 }
});

export default DashboardScreen;
