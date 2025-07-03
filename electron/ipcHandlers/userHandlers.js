import registerUser from '../../logic/registerUser.js';
import loginUser from '../../logic/loginUser.js';

let currentLoggedInUser = null; // ✅ Store logged-in user in memory

export default function registerUserHandlers(ipcMain) {
  ipcMain.handle('register-user', async (_event, userData) => {
    try {
      await registerUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('login-user', async (_event, credentials) => {
    try {
      const result = await loginUser(credentials);
      if (result.success) {
        // ✅ Store the user in memory for later access
        currentLoggedInUser = {
          ...result.user,
          permissions: Array.isArray(result.user.permissions)
            ? result.user.permissions
            : JSON.parse(result.user.permissions || '[]'),
        };
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // ✅ Used in App.vue to rehydrate the current session
  ipcMain.handle('get-logged-in-user', async () => {
    return currentLoggedInUser;
  });

  // Optional: logout
  ipcMain.handle('logout-user', () => {
    currentLoggedInUser = null;
    return { success: true };
  });
}
