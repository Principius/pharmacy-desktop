import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,         // for logged-in user
    users: [],          // for list of all users (e.g. in permissions management)
  }),

  getters: {
    permissions: (state) => state.user?.permissions || [],
    hasPermission: (state) => (perm) => state.user?.permissions?.includes(perm),
  },

  actions: {
    setUser(userData) {
      this.user = {
        ...userData,
        permissions: Array.isArray(userData.permissions)
          ? userData.permissions
          : JSON.parse(userData.permissions || '[]'),
      }
    },

    setUsers(userList) {
      this.users = userList.map((u) => ({
        ...u,
        permissions: Array.isArray(u.permissions)
          ? u.permissions
          : JSON.parse(u.permissions || '[]'),
      }))
    },

    updateUserInList(updatedUser) {
      const index = this.users.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = {
          ...updatedUser,
          permissions: Array.isArray(updatedUser.permissions)
            ? updatedUser.permissions
            : JSON.parse(updatedUser.permissions || '[]'),
        }
      }
    }
  }
})
