<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const authStore = useAuthStore()
const router = useRouter()
const { mobile } = useDisplay()

const drawer = ref(true)

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}

const menuItems = [
  {
    title: 'Lista de Vehículos',
    icon: 'mdi-car',
    to: '/'
  },
  {
    title: 'Nuevo Vehículo',
    icon: 'mdi-car-plus',
    to: '/vehicles/new'
  }
]
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!mobile"
      :temporary="mobile"
      :location="mobile ? 'left' : 'left'"
      :rail="mobile ? false : !drawer"
      elevation="1"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="authStore.user?.email"
        />
      </v-list>

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :value="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
      />
      
      <v-app-bar-title class="text-truncate gb-[#000000]">
        Gestión de Vehículos
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        icon
        @click="handleLogout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="pa-4">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-navigation-drawer {
  transition: transform 0.3s ease-in-out;
}
</style> 