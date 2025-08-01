const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  powerConnectionNumber: { type: String, required: true },
  address: { type: String, required: true },
  typeOfSolarPlant: { type: String, required: true },
  solarLoadRequirement: { type: String, required: true },
  subsidyOption: { type: String, required: true }, // values: 'Subsidy' or 'Non-Subsidy'
  preferredPanelBrand: { type: String, default: '' }, // optional
  preferredInverterBrand: { type: String, default: '' }, // optional
  remarks: { type: String, default: '' }, // optional
  registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);