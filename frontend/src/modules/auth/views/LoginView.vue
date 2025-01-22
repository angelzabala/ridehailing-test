<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const isFormValid = ref(false);

const rules = {
  email: [
    v => !!v || 'El email es requerido',
    v => /.+@.+\..+/.test(v) || 'El email debe ser válido'
  ],
  password: [
    v => !!v || 'La contraseña es requerida',
    v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
  ]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.login(form.value)
    router.push('/')
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="text-center text-h5 mb-4">
      Iniciar Sesión
    </v-card-title>

    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
      closable
      @click:close="error = ''"
    >
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        :rules="rules.email"
        required
        prepend-icon="mdi-email"
      />

      <v-text-field
        v-model="form.password"
        label="Contraseña"
        :type="showPassword ? 'text' : 'password'"
        :rules="rules.password"
        required
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
      />

      <v-btn
        type="submit"
        color="primary"
        block
        :loading="loading"
        :disabled="!isFormValid"
        class="mt-4"
      >
        Iniciar Sesión
      </v-btn>

      <div class="text-center mt-4">
        ¿No tienes cuenta?
        <v-btn
          variant="text"
          color="primary"
          to="/auth/register"
          class="ml-2"
        >
          Regístrate aquí
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template> 