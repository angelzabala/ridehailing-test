import { Vehicle } from '../models/Vehicle.js';

export const vehicleController = {
  async getVehicles(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};

      // Filtros opcionales
      if (req.query.brand) query.brand = new RegExp(req.query.brand, 'i');
      if (req.query.model) query.model = new RegExp(req.query.model, 'i');
      if (req.query.year) query.year = req.query.year;
      if (req.query.status) query.status = req.query.status;

      // Manejo de ordenamiento
      const sortBy = req.query.sortBy || ''; // Valor por defecto
      const sortDesc = req.query.sortDesc === 'true' ? -1 : 1; // Orden ascendente o descendente

      const vehicles = await Vehicle.find(query)
        .sort({ [sortBy]: sortDesc }) // Aplica el ordenamiento
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
        .lean();

      const total = await Vehicle.countDocuments(query);

      res.json({
        vehicles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("Error obteniendo vehiculos:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async createVehicle(req, res) {
    try {
      const vehicle = new Vehicle({
        ...req.body,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });
      
      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateVehicleStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id,
        { status, updatedBy: req.user._id, updatedAt: Date.now() },
        { new: true }
      )
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
        .lean();

      if (!updatedVehicle) {
        return res.status(404).json({ message: 'Vehiculo no encontrado' });
      }

      res.json(updatedVehicle);
    } catch (error) {
      console.error("Error actualizando el estado del vehiculo:", error);
      res.status(500).json({ message: 'Error actualizando el estado del vehiculo', error: error.message });
    }
  },

  async getVehicle(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id)
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
        .lean();

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findByIdAndDelete(id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }

      res.json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
  },
};  