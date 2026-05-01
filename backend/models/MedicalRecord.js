import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    patientName: {
      type: String,
      required: [true, 'Please add a patient name'],
    },
    doctorName: {
      type: String,
      required: [true, 'Please add a doctor name'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Please add a hospital name'],
      enum: ['Government', 'Private'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Prescription', 'Lab Report'],
    },
    fee: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      required: false, // Optional fields for image text context
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('MedicalRecord', medicalRecordSchema);
