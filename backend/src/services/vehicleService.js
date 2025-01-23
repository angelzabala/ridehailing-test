import { Vehicle } from '../models/Vehicle.js';

export const vehicleService = {
  async getVehicles(query) {
    const { page, limit, filters, sortBy, sortDesc } = query;
    const skip = (page - 1) * limit;

    const queryFilters = {};

    // Filtros opcionales
    if (filters.brand) queryFilters.brand = new RegExp(filters.brand, 'i');
    if (filters.model) queryFilters.model = new RegExp(filters.model, 'i');
    if (filters.year) queryFilters.year = filters.year;
    if (filters.status) queryFilters.status = filters.status;

    const vehicles = await Vehicle.find(queryFilters)
      .sort({ [sortBy]: sortDesc }) // Aplica el ordenamiento
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .lean();

    const total = await Vehicle.countDocuments(queryFilters);

    return { vehicles, total };
  },

  async createVehicle(vehicleData) {
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    return vehicle;
  },

  async updateVehicleStatus(vehicleId, status) {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('createdBy', 'email').populate('updatedBy', 'email').lean();

    if (!updatedVehicle) {
      throw new Error('Vehículo no encontrado');
    }

    return updatedVehicle;
  },

  async deleteVehicle(vehicleId) {
    const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }
    return vehicle;
  }
}; 