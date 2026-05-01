import MedicalRecord from '../models/MedicalRecord.js';

// @desc    Get medical records for logged in user
// @route   GET /api/records
// @access  Private
export const getRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private
export const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Make sure the logged in user matches the record user
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private
export const createRecord = async (req, res) => {
  try {
    const { patientName, doctorName, hospitalName, category, date } = req.body;

    if (!patientName || !doctorName || !hospitalName || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const calculatedFee = hospitalName === 'Private' ? 1500 : 0;

    const recordData = {
      user: req.user.id,
      patientName,
      doctorName,
      hospitalName,
      category,
      fee: calculatedFee,
      date: date || Date.now(),
    };

    // If an image was uploaded, add the URL
    if (req.file) {
      recordData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const record = await MedicalRecord.create(recordData);

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update medical record
// @route   PUT /api/records/:id
// @access  Private
export const updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check for user
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updateData = { ...req.body };

    // Auto-recalculate fee if hospitalName was updated
    if (updateData.hospitalName) {
      updateData.fee = updateData.hospitalName === 'Private' ? 1500 : 0;
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after' }
    );

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/records/:id
// @access  Private
export const deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await record.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
