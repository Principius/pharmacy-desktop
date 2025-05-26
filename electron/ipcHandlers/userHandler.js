import db from '../db/connection.js';
import bcrypt from 'bcryptjs';

/** CRUD operations **/

// Get all users
const getUsers = async () => {
    return await db('users').select('*');
};

// Get user by ID
const getUserById = async (id) => {
    return await db('users').where({ id }).first();
};

// Create user
const createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await db('users').insert({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
    });
};

// Update user
const updateUser = async (id, user) => {
    return await db('users').where({ id }).update(user);
};

// Delete user
const deleteUser = async (id) => {
    return await db('users').where({ id }).del();
};

/** IPC handler registration **/
export default function registerUserHandler(ipcMain) {
    ipcMain.handle('users:getAll', async () => {
        return await getUsers();
    });

    ipcMain.handle('users:getById', async (_, id) => {
        return await getUserById(id);
    });

    ipcMain.handle('users:create', async (_, user) => {
        return await createUser(user);
    });

    ipcMain.handle('users:update', async (_, id, user) => {
        return await updateUser(id, user);
    });

    ipcMain.handle('users:delete', async (_, id) => {
        return await deleteUser(id);
    });

    ipcMain.handle('updateUserPermissions', async (_, userId, permissions) => {
        return await db('users').where({ id: userId }).update({ permissions: JSON.stringify(permissions) });
    });

}
