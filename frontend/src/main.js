import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import { useAuthStore } from './stores/auth'

// Configuración global de axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Interceptor para manejar errores de autenticación si intenta acceder a una ruta protegida
axios.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/auth/login');
    }
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
);

// Interceptor para agregar el token a las solicitudes
axios.interceptors.request.use(config => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

// Inicializar autenticación
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app') 