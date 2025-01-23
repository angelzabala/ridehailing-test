<script setup>
import { onMounted, computed, ref } from 'vue'
import { useVehicleStore } from '@/stores/vehicles'
import { useDisplay } from 'vuetify'
import VehicleFilters from '@/components/VehicleFilters.vue'
import VehicleStatusChip from '@/components/VehicleStatusChip.vue'
import { VEHICLE_TABLE_HEADERS, STATUS_OPTIONS } from '@/constants/vehicleConstants'

const vehicleStore = useVehicleStore()
const { mobile, mdAndDown } = useDisplay()

const headers = computed(() => VEHICLE_TABLE_HEADERS)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('')
const dialog = ref(false)
const dialogLoading = ref(false)
const dialogError = ref('')
const selectedVehicle = ref(null)


const handleStatusChange = async (vehicle, newStatus) => {
  try {
    const updatedVehicle = await vehicleStore.updateVehicleStatus(vehicle._id, newStatus);
    const index = vehicleStore.vehicles.findIndex(v => v._id === updatedVehicle._id);
    if (index !== -1) {
      vehicleStore.vehicles[index] = updatedVehicle;
    }
    snackbarMessage.value = 'Estado actualizado exitosamente';
    snackbarColor.value = 'success';
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    snackbarMessage.value = 'Error al actualizar estado';
    snackbarColor.value = 'error';
  } finally {
    snackbar.value = true;
  }
};

const confirmDeleteVehicle = (vehicle) => {
  selectedVehicle.value = vehicle;
  dialog.value = true;
}

const deleteVehicle = async () => {
  dialogLoading.value = true;
  dialogError.value = '';
  try {
    await vehicleStore.deleteVehicle(selectedVehicle.value._id);
    vehicleStore.vehicles = vehicleStore.vehicles.filter(v => v._id !== selectedVehicle.value._id);
    snackbarMessage.value = 'Vehículo eliminado exitosamente';
    snackbarColor.value = 'success';
    dialog.value = false;
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    dialogError.value = 'Error al eliminar vehículo. Intenta de nuevo.';
  } finally {
    dialogLoading.value = false;
    snackbar.value = true;
    vehicleStore.fetchVehicles() //recargar la lista resulta más consistente
  }
}

onMounted(() => {
  vehicleStore.fetchVehicles()
})
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between align-center ga-4 mb-4">
      <h1 class="text-h4 mb-0">Vehículos</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        to="/vehicles/new"
        :block="mobile"
      >
        Nuevo Vehículo
      </v-btn>
    </div>

    <VehicleFilters class="mb-4" />

    <v-card>
      <v-data-table-server
      :headers="headers"
      :items="vehicleStore.vehicles"
        :items-length="vehicleStore.totalVehicles"
        :loading="vehicleStore.loading"
        :items-per-page="10"
        :server-items-length="vehicleStore.totalVehicles"
        :page="vehicleStore.currentPage" 
        @update:page="vehicleStore.fetchVehicles"
        class="elevation-1"
        :density="mdAndDown ? 'compact' : 'default'"
        :sort-by="['createdAt']"
        :sort-desc="[true]"
      >
      
        <template #[`item._id`]="{ item }">
          <span >{{ item._id }}</span>
        </template>

        <template #[`item.status`]="{ item }">
          <VehicleStatusChip :status="item.status" />
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>

        <template #[`item.updatedAt`]="{ item }">
          {{ new Date(item.updatedAt).toLocaleString() }}
        </template>

        <template #[`item.createdBy`]="{ item }">
          {{ item.createdBy.email }}
        </template>

        <template #[`item.updatedBy`]="{ item }">
          {{ item.updatedBy.email }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                v-bind="props"
                size="small"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="option in STATUS_OPTIONS"
                :key="option.value"
                :disabled="item.status === option.value"
                @click="handleStatusChange(item, option.value)"
                :density="mobile ? 'compact' : 'default'"
              >
                <v-list-item-title>
                  Cambiar a {{ option.text }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="confirmDeleteVehicle(item)"
                :density="mobile ? 'compact' : 'default'"
              >
                <v-list-item-title>
                  Eliminar
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template #no-data>
          <div class="pa-4 text-center">
            No hay vehículos registrados
          </div>
        </template>

        <template #loading>
          <div class="pa-4 text-center">
            Cargando vehículos...
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>
          <p>¿Estás seguro de que deseas eliminar este vehículo?</p>
          <v-alert v-if="dialogError" type="error" class="mb-4">
            {{ dialogError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="red" :loading="dialogLoading" @click="deleteVehicle">
            {{ dialogLoading ? 'Eliminando...' : 'Confirmar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-if="!dialogError" v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.v-data-table {
  width: 100%;
}

:deep(.v-data-table-header__content) {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

:deep(.v-data-table) {
  overflow-x: auto;
}

:deep(.v-table) {
  width: 100%;
  min-width: 600px;
}

:deep(.v-data-table-footer__items-per-page){
  display: none;
}
</style>