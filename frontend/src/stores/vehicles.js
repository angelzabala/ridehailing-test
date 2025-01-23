import { defineStore } from 'pinia'
import axios from 'axios'

export const useVehicleStore = defineStore('vehicles', {
  state: () => ({
    vehicles: [],
    totalVehicles: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    filters: {
      brand: '',
      model: '',
      year: '',
      status: ''
    },
    sortBy: 'createdAt',
    sortDesc: true
  }),



  actions: {
    async fetchVehicles(page = 1, limit = 10) {
      try {
        this.loading = true
        this.error = null
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(this.sortBy != undefined && { sortBy: this.sortBy }),
          sortDesc: this.sortDesc,
          ...Object.fromEntries(
            Object.entries(this.filters).filter(([_, value]) => value)
          )
        })

        const { data } = await axios.get(`/vehicles?${params}`)
        
        this.vehicles = data.vehicles
        this.totalVehicles = data.total
        this.currentPage = data.page
        this.totalPages = data.totalPages
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al cargar los vehículos'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async createVehicle(vehicleData) {
      try {
        this.loading = true
        this.error = null
        const { data } = await axios.post('/vehicles', vehicleData)
        await this.fetchVehicles(1) // Recargar la primera página
        return data
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al crear el vehículo'
        throw this.error
      } finally {
        this.loading = false
      }
    },
    async deleteVehicle(id) {
      try {
        await axios.delete(`/vehicles/${id}`);
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
      }
    },

    async updateVehicleStatus(vehicleId, status) {
      try {
        this.loading = true
        this.error = null
        const { data } = await axios.patch(`/vehicles/${vehicleId}/status`, { status })
        
        // Actualizar el vehículo en el estado local
        const index = this.vehicles.findIndex(v => v._id === vehicleId)
        if (index !== -1) {
          this.vehicles[index] = data
        }
        
        return data
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al actualizar el estado'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      this.fetchVehicles(1) // Recargar con nuevos filtros desde la primera página
    },

    clearFilters() {
      this.filters = {
        brand: '',
        model: '',
        year: '',
        status: ''
      }
      this.fetchVehicles(1)
    }
  }
})