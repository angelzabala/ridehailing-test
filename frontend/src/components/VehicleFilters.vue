<script setup>
import { ref, watch } from 'vue'
import { useVehicleStore } from '@/stores/vehicles'

const vehicleStore = useVehicleStore()

const filters = ref({
  brand: '',
  model: '',
  year: '',
  status: ''
})

const statusOptions = [
  { text: 'Todos', value: '' },
  { text: 'Disponible', value: 'disponible' },
  { text: 'En Mantenimiento', value: 'en_mantenimiento' },
  { text: 'En Servicio', value: 'en_servicio' }
]

watch(filters, (newFilters) => {
  vehicleStore.setFilters(newFilters)
}, { deep: true })

const clearFilters = () => {
  filters.value = {
    brand: '',
    model: '',
    year: '',
    status: ''
  }
  vehicleStore.clearFilters()
}
</script>

<template>
  <v-card class="pa-4">
    <div class="filters-container d-flex flex-wrap align-center ga-4 d-sm-column">
      <v-text-field
        v-model="filters.brand"
        label="Marca"
        hide-details
        density="compact"
      />

      <v-text-field
        v-model="filters.model"
        label="Modelo"
        hide-details
        density="compact"
      />

      <v-text-field
        v-model="filters.year"
        label="Año"
        type="number"
        hide-details
        density="compact"
      />

      <v-select
        v-model="filters.status"
        :items="statusOptions"
        item-title="text"
        item-value="value"
        label="Estado"
        hide-details
        density="compact"
      />

      <v-btn
        color="error"
        variant="outlined"
        @click="clearFilters"
      >
        Limpiar Filtros
      </v-btn>
    </div>
  </v-card>
</template> 

<style scoped>
  @media(max-width: 720px){
    .filters-container{
      flex-direction: column;
    }
    .filters-container *{
      width: 100%;
    }
  }
</style>