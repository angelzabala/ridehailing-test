<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusConfig = {
  disponible: {
    color: 'success',
    text: 'Disponible'
  },
  en_mantenimiento: {
    color: 'warning',
    text: 'En Mantenimiento'
  },
  en_servicio: {
    color: 'info',
    text: 'En Servicio'
  }
}

const currentStatus = statusConfig[props.status] || {
  color: 'error',
  text: 'Estado Desconocido'
}
</script>

<template>
  <v-chip
    :color="currentStatus.color"
    size="small"
  >
    {{ currentStatus.text }}
  </v-chip>
</template> 