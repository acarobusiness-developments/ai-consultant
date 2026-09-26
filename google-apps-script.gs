/**
 * AI CONSULTANT — Formulario de contacto → Google Sheets
 * ============================================================
 * INSTRUCCIONES DE INSTALACIÓN (una sola vez, ~3 minutos):
 *
 * 1. Crea una hoja de cálculo nueva en Google Drive: sheets.new
 *    (o abre una que ya tengas y quieras usar).
 *
 * 2. Menú "Extensiones" → "Apps Script".
 *
 * 3. Borra todo el contenido de "Code.gs" y pega ESTE archivo completo.
 *
 * 4. Guarda (icono de disquete o Cmd/Ctrl+S). Ponle un nombre al
 *    proyecto si te lo pide, ej. "Formulario AI Consultant".
 *
 * 5. Arriba a la derecha, botón azul "Implementar" → "Nueva implementación".
 *      - Hacé clic en el ⚙️ junto a "Seleccionar tipo" → "Aplicación web".
 *      - Descripción: lo que quieras (ej. "Formulario web v1").
 *      - Ejecutar como: "Yo" (tu cuenta).
 *      - Quién tiene acceso: "Cualquier usuario".
 *      - Clic en "Implementar".
 *
 * 6. La PRIMERA vez, Google va a pedirte autorizar permisos:
 *      "Autorizar acceso" → elegí tu cuenta →
 *      va a decir "Google no verificó esta app" (es NORMAL, es TU
 *      script en TU cuenta) → clic en "Avanzado" →
 *      "Ir a [nombre del proyecto] (no seguro)" → "Permitir".
 *
 * 7. Te va a dar una URL que termina en "/exec". Copiala completa.
 *
 * 8. Pegala en tu index.html, reemplazando este texto:
 *      var GOOGLE_SHEETS_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
 *    por:
 *      var GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
 *
 * Listo. Cada envío del formulario va a aparecer como una fila nueva
 * en la hoja de cálculo, con encabezados automáticos en la primera fila.
 *
 * Si más adelante cambiás algo en este script, tenés que volver a
 * "Implementar" → "Gestionar implementaciones" → ✏️ → "Nueva versión"
 * → "Implementar" (la URL /exec se mantiene igual).
 * ============================================================
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }

  // Si la hoja está vacía, agrega los encabezados primero.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha', 'Nombre', 'Email', 'Teléfono', 'Necesidad', 'Mensaje', 'Idioma', 'Página']);
  }

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.need || '',
    data.message || '',
    data.lang || '',
    data.page || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('El formulario está conectado correctamente. Este endpoint solo acepta solicitudes POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}
