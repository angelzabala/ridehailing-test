import { vehicleService } from '../services/vehicleService.js';

export const vehicleController = {
  async getVehicles(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortDesc = req.query.sortDesc === 'true' ? -1 : 1;

      const filters = {
        brand: req.query.brand,
        model: req.query.model,
        year: req.query.year,
        status: req.query.status
      };

      const { vehicles, total } = await vehicleService.getVehicles({
        page,
        limit,
        filters,
        sortBy,
        sortDesc
      });

      res.json({
        vehicles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("Error obteniendo vehículos:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async createVehicle(req, res) {
    try {
      const vehicle = await vehicleService.createVehicle({
        ...req.body,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateVehicleStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedVehicle = await vehicleService.updateVehicleStatus(id, status);
      res.json(updatedVehicle);
    } catch (error) {
      console.error("Error actualizando el estado del vehículo:", error);
      res.status(500).json({ message: 'Error actualizando el estado del vehículo', error: error.message });
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
      await vehicleService.deleteVehicle(id);
      res.json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
  },
};  