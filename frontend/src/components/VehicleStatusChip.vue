<script setup>
import { CHIPS_STATUS_CONFIG } from '@/constants/vehicleConstants';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})


const currentStatus = CHIPS_STATUS_CONFIG[props.status] || {
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