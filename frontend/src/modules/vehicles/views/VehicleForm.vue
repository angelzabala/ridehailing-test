<script setup>
import { ref } from 'vue'
import { useVehicleStore } from '@/stores/vehicles'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const vehicleStore = useVehicleStore()
const router = useRouter()
const { mobile } = useDisplay()

const loading = ref(false)
const error = ref('')
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('')

const form = ref({
  brand: '',
  model: '',
  year: '',
  status: 'disponible'
})

const statusOptions = [
  { text: 'Disponible', value: 'disponible' },
  { text: 'En Mantenimiento', value: 'en_mantenimiento' },
  { text: 'En Servicio', value: 'en_servicio' }
]

const rules = {
  brand: [
    v => !!v || 'La marca es requerida'
  ],
  model: [
    v => !!v || 'El modelo es requerido'
  ],
  year: [
    v => !!v || 'El año es requerido',
    v => (v >= 1900 && v <= new Date().getFullYear()) || 'Año inválido'
  ]
}

const isFormValid = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await vehicleStore.createVehicle(form.value)
    snackbarMessage.value = 'Vehículo creado exitosamente'
    snackbarColor.value = 'success'
    router.push('/')
  } catch (err) {
    error.value = err.toString()
    snackbarMessage.value = 'Error al crear vehículo'
    snackbarColor.value = 'error'
  } finally {
    loading.value = false
    snackbar.value = true
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center ga-4 mb-4">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="router.back()"
        size="small"
      />
      <h1 class="text-h4 mb-0">Nuevo Vehículo</h1>
    </div>

    <v-card class="pa-4">
      <v-alert
        v-if="error"
        type="error"
        class="mb-4"
        closable
        variant="tonal"
        @click:close="error = ''"
      >
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
        <v-row>
          <v-col cols="12" :md="6">
            <v-text-field
              v-model="form.brand"
              label="Marca"
              :rules="rules.brand"
              required
              :density="mobile ? 'compact' : 'default'"
            />
          </v-col>

          <v-col cols="12" :md="6">
            <v-text-field
              v-model="form.model"
              label="Modelo"
              :rules="rules.model"
              required
              :density="mobile ? 'compact' : 'default'"
            />
          </v-col>

          <v-col cols="12" :md="6">
            <v-text-field
              v-model.number="form.year"
              label="Año"
              type="number"
              :rules="rules.year"
              required
              :density="mobile ? 'compact' : 'default'"
            />
          </v-col>

          <v-col cols="12" :md="6">
            <v-select
              v-model="form.status"
              :items="statusOptions"
              item-title="text"
              item-value="value"
              label="Estado"
              required
              :density="mobile ? 'compact' : 'default'"
            />
          </v-col>
        </v-row>

        <div class="d-flex flex-wrap ga-4 mt-4">
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="!isFormValid"
            :block="mobile"
          >
            Guardar Vehículo
          </v-btn>

          <v-btn
            variant="outlined"
            @click="router.back()"
            :block="mobile"
          >
            Cancelar
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>