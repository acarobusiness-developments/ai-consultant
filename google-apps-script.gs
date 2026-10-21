/**
 * AI CONSULTANT — Formulario Web & WebChat Leads → Google Sheets
 * ============================================================
 * INSTRUCCIONES DE ACTUALIZACIÓN / INSTALACIÓN:
 *
 * 1. Abre tu hoja de cálculo de Google Drive.
 * 2. Menú "Extensiones" → "Apps Script".
 * 3. Reemplaza el contenido de "Code.gs" con ESTE archivo completo y Guarda (Cmd/Ctrl+S).
 * 4. Botón azul "Implementar" → "Gestionar implementaciones" → ✏️ (Editar) →
 *    Versión: "Nueva versión" → Clic en "Implementar".
 *
 * La URL /exec se mantiene igual y ahora organiza automáticamente los datos en 2 pestañas:
 *  - "WebChat Leads": Todas las consultas y datos de contacto recolectados por Pilar y Martín.
 *  - "Formulario Web": Los envíos del formulario de contacto de la landing page.
 * ============================================================
 */

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }

  var isWebChat = data.tipo === 'webchat' || data.sessionId;

  // Formato seguro para teléfono (Opción 1: ="+..."):
  // Evita que Google Sheets interprete el '+' inicial como fórmula errónea y devuelva #ERROR!
  var rawPhone = (data.phone || '').toString().trim();
  var phoneVal = rawPhone;
  if (phoneVal && phoneVal.charAt(0) === '+' && !phoneVal.startsWith('="')) {
    phoneVal = '="' + phoneVal + '"';
  }

  try {
    if (isWebChat) {
      // Pestaña dedicada para WebChat
      var sheetChat = ss.getSheetByName('WebChat Leads');
      if (!sheetChat) {
        sheetChat = ss.insertSheet('WebChat Leads');
        sheetChat.appendRow([
          'Fecha y Hora',
          'ID Sesión (Chat)',
          'Consultor',
          'Nombre Visitante',
          'Celular / WhatsApp',
          'Email',
          'Servicio / Interés',
          'Mensaje del Visitante',
          'Respuesta del Asesor',
          'Modo'
        ]);
        sheetChat.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#E8F0FE');
        sheetChat.setFrozenRows(1);
      }

      sheetChat.appendRow([
        new Date(),
        data.sessionId || '',
        data.consultant || '',
        data.name || 'Visitante WebChat',
        phoneVal,
        data.email || '',
        data.need || 'Consulta General',
        data.userMessage || data.message || '',
        data.agentResponse || '',
        data.mode || 'text'
      ]);
    } else {
      // Pestaña para Formulario Web
      var sheetForm = ss.getSheetByName('Formulario Web');
      if (!sheetForm) {
        // Si no existe, revisar la hoja activa
        sheetForm = ss.getActiveSheet();
        if (sheetForm.getLastRow() === 0) {
          sheetForm.appendRow(['Fecha', 'Nombre', 'Email', 'Teléfono', 'Necesidad', 'Mensaje', 'Idioma', 'Página']);
          sheetForm.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#E6F4EA');
          sheetForm.setFrozenRows(1);
        }
      }

      sheetForm.appendRow([
        new Date(),
        data.name || '',
        data.email || '',
        phoneVal,
        data.need || '',
        data.message || '',
        data.lang || '',
        data.page || ''
      ]);
    }
  } catch (error) {
    // Fallback de seguridad: si falla la selección de pestaña, guardar en la hoja activa
    var fallbackSheet = ss.getActiveSheet();
    fallbackSheet.appendRow([
      new Date(),
      data.name || 'Visitante',
      data.email || '',
      phoneVal,
      data.need || '',
      data.message || data.userMessage || '',
      data.lang || '',
      data.page || (isWebChat ? 'WebChat' : 'Formulario')
    ]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('El webhook de AI Consultant está conectado correctamente. Este endpoint solo acepta solicitudes POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}
