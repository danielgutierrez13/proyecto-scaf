/**
 * Configuracion de produccion (build de Vercel).
 *
 * Antes de presentar: levanta el tunel con
 *   cloudflared tunnel --url http://localhost:9091
 * copia la URL https://....trycloudflare.com que imprime y pegala aqui,
 * luego haz commit y push. Vercel redespliega en ~1 minuto.
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://meeting-approach-hearings-generations.trycloudflare.com',
};
