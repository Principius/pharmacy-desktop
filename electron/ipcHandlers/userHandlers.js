
import registerUser from '../../logic/registerUser.js';
import loginUser from '../../logic/loginUser.js';

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
      const user = await loginUser(credentials);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}
