/**
 * Composable para obtener, crear y actualizar el perfil del usuario.
 * Apunta directamente a localhost:8001.
 */
export function useProfile() {
  const baseURL = 'http://localhost:8001'; // 👈 Cambiado directamente aquí, sin config

  async function getProfile() {
    const { data, error } = await useFetch('/profile', {
      baseURL,
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    if (error.value) {
      throw error.value;
    }

    return data.value;
  }

  async function createProfile(bio: string, preferences: string[]) {
    const { data, error } = await useFetch('/profile', {
      baseURL,
      method: 'POST',
      body: { bio, preferences },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (error.value) {
      throw error.value;
    }

    return data.value;
  }

  async function updateProfile(payload: Partial<{ bio: string, preferences: string[] }>) {
    const { data, error } = await useFetch('/profile', {
      baseURL,
      method: 'PUT',
      body: payload,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (error.value) {
      throw error.value;
    }

    return data.value;
  }

  return {
    getProfile,
    createProfile,
    updateProfile,
  };
}
