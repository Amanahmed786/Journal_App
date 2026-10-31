// User API service
import { apiClient } from './client';
import { login } from './auth';

// GET /user - retrieves greeting with live weather info
export async function getUserGreeting() {
  try {
    const greeting = await apiClient('/user', { method: 'GET' });
    return typeof greeting === 'string' ? greeting : '';
  } catch (err) {
    console.warn('Could not fetch user greeting:', err.message);
    return '';
  }
}

// PUT /user - update username and password
// Note: If username changes, the previous JWT is for the old username,
// so we re-authenticate to obtain a fresh valid token.
export async function updateUserDetails(newUsername, newPassword) {
  await apiClient('/user', {
    method: 'PUT',
    body: JSON.stringify({
      username: newUsername,
      password: newPassword,
    }),
  });

  // Re-login with the updated credentials to acquire a fresh JWT
  const authResult = await login(newUsername, newPassword);
  return authResult;
}

// DELETE /user - delete account
export async function deleteUserAccount() {
  return await apiClient('/user', {
    method: 'DELETE',
  });
}
