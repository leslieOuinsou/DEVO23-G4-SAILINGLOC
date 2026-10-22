import axios from 'axios';
import { getToken } from "./authService";

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

let csrfToken = null;

const getCsrfToken = async () => {
  try {
    const res = await axios.get(`${api_url}/csrf-token`, { withCredentials: true });
    csrfToken = res.data.csrfToken;
  } catch (err) {
    console.error("Erreur lors de la récupération du token CSRF :", err);
  }
};

// Intercepteur pour gérer les tokens expirés
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('Token expiré ou invalide, déconnexion...');
//       // Nettoyer le storage et rediriger
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

export const request = async (endpoint, options = {}) => {

  const token = getToken();
  const method = options.method || 'GET';

  // Récupération du token CSRF
  if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase()) ) {
    await getCsrfToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...options.headers,
  };

  // Si le body est FormData, on laisse Axios gérer le Content-Type
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await axios({
      url: `${api_url}${endpoint}`,
      method,
      headers,
      data: options.body || undefined,
      withCredentials: true, // Envoyer les cookies
    });

    return response.data;

  } catch (err) {
    if (err.response) {
        // Erreur HTTP avec code - on propage toute la réponse
        const error = new Error(err.response.data?.message || `Erreur ${err.response.status}`);
        error.response = err.response; // On ajoute la réponse complète à l'erreur
        throw error;
    } else if (err.request) {
        throw new Error("Impossible de contacter le serveur");
    } else {
        throw new Error(err.message);
    }
}
};