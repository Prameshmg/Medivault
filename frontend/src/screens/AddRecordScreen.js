import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';

const AddRecordScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  
  const [patientName, setPatientName] = useState(user.fullName);
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('Government');
  const [category, setCategory] = useState('Prescription');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://medivault-production-888f.up.railway.app/api/records';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!patientName || !doctorName || !hospitalName || !category) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('patientName', patientName);
      formData.append('doctorName', doctorName);
      formData.append('hospitalName', hospitalName);
      formData.append('category', category);

      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
          uri: image,
          name: filename,
          type
        });
      }

      await axios.post(API_URL, formData, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Alert.alert('Success', 'Record added successfully!');
      navigation.navigate('Dashboard');

      // Reset form
      setDoctorName('');
      setImage(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Patient Name:</Text>
      <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} />
      
      <Text style={styles.label}>Doctor Name:</Text>
      <TextInput style={styles.input} value={doctorName} onChangeText={setDoctorName} placeholder="Dr. XYZ" />

      <Text style={styles.label}>Hospital Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={hospitalName} onValueChange={(val) => setHospitalName(val)}>
          <Picker.Item label="Government" value="Government" />
          <Picker.Item label="Private" value="Private" />
        </Picker>
      </View>

      <Text style={styles.label}>Record Category:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={category} onValueChange={(val) => setCategory(val)}>
          <Picker.Item label="Prescription" value="Prescription" />
          <Picker.Item label="Lab Report" value="Lab Report" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>{image ? 'Change Document Photo' : 'Upload Document Photo'}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Save Record</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f1f1f1', flexGrow: 1 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
  imageBtn: { backgroundColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  imageBtnText: { color: '#fff', fontWeight: 'bold' },
  previewImage: { width: '100%', height: 200, marginTop: 15, borderRadius: 8 },
  submitBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default AddRecordScreen;
