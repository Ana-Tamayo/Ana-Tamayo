# Exportador de PDF para Solicitudes de ServiceNow

## 📋 Descripción

Sistema completo para generar PDFs de solicitudes (Request) en ServiceNow con la capacidad de adjuntar automáticamente el archivo generado y permitir la descarga sin cerrar automáticamente la ventana del navegador.

## 🔧 Componentes

### 1. **UI Action** - `exportPDF.js`
- **Tabla**: `sc_request`
- **Función**: Botón que inicia el proceso de generación del PDF
- **Ubicación**: `ui-actions/exportPDF.js`

### 2. **Script Include AJAX** - `ExportRITMPDFAjaxRQ.js`
- **API Name**: `ExportRITMPDFAjaxRQ`
- **Client Callable**: ✅ Sí
- **Función**: Procesa la solicitud AJAX y coordina la generación del PDF
- **Ubicación**: `script-includes/ExportRITMPDFAjaxRQ.js`

### 3. **Script Include** - `ExportRequestPDF.js`
- **API Name**: `ExportRequestPDF`
- **Función**: Construye el HTML y genera el PDF usando la API de ServiceNow
- **Ubicación**: `script-includes/ExportRequestPDF.js`

### 4. **UI Page** - `pdf_request_ui_page.xml`
- **Name**: `pdf_request`
- **Función**: Renderiza el HTML y descarga el PDF usando html2pdf.js
- **Ubicación**: `ui-pages/pdf_request_ui_page.xml`

## ✨ Cambios Principales

### ❌ Comportamiento Anterior
```javascript
// La ventana se cerraba automáticamente después de la descarga
setTimeout(function() {
    try {
        if (opener) {
            opener.location.reload();
        }
    } catch(e) {
        console.log('No se pudo recargar ventana padre');
    }
    window.close(); // ⚠️ Cierre automático
}, 1000);
```

### ✅ Nuevo Comportamiento
```javascript
// La ventana permanece abierta con un mensaje de confirmación
mostrarMensaje('✅ PDF descargado exitosamente. Puedes cerrar esta ventana.', true);

// El usuario puede cerrar manualmente cuando lo desee
// Botón visible para cerrar la ventana
```

## 🎯 Características Mejoradas

1. **No Cierre Automático**: La ventana popup permanece abierta después de la descarga del PDF
2. **Mensaje de Estado**: Muestra el progreso de la generación del PDF
3. **Botón de Cierre Manual**: El usuario decide cuándo cerrar la ventana
4. **Recarga Opcional**: Posibilidad de recargar la ventana padre (comentado por defecto)
5. **Manejo de Errores**: Mensajes claros en caso de errores

## 📦 Instalación en ServiceNow

### 1. Crear UI Action
1. Ve a **System Definition > UI Actions**
2. Haz clic en **New**
3. Configura:
   - **Name**: Export PDF
   - **Table**: sc_request
   - **Action name**: export_pdf
   - **Client**: ✅ Marcado
   - **Script**: Copia el contenido de `ui-actions/exportPDF.js`

### 2. Crear Script Include AJAX
1. Ve a **System Definition > Script Includes**
2. Haz clic en **New**
3. Configura:
   - **Name**: ExportRITMPDFAjaxRQ
   - **API Name**: ExportRITMPDFAjaxRQ
   - **Client callable**: ✅ Marcado
   - **Script**: Copia el contenido de `script-includes/ExportRITMPDFAjaxRQ.js`

### 3. Crear Script Include
1. Ve a **System Definition > Script Includes**
2. Haz clic en **New**
3. Configura:
   - **Name**: ExportRequestPDF
   - **API Name**: ExportRequestPDF
   - **Script**: Copia el contenido de `script-includes/ExportRequestPDF.js`

### 4. Crear UI Page
1. Ve a **System UI > UI Pages**
2. Haz clic en **New**
3. Configura:
   - **Name**: pdf_request
   - **HTML**: Copia el contenido de `ui-pages/pdf_request_ui_page.xml`
4. **IMPORTANTE**: Anota el **sys_id** de la UI Page creada
5. Actualiza el `uiPageSysId` en la UI Action con el sys_id correcto

### 5. Actualizar sys_id de UI Page
En `exportPDF.js`, actualiza:
```javascript
var uiPageSysId = 'TU_SYS_ID_AQUI'; // Reemplaza con el sys_id de tu UI Page
```

## 🔗 Dependencias

### Bibliotecas JavaScript Requeridas
1. **html2pdf.js** - Para generar PDFs en el cliente
   - Cargar como **UI Script** en ServiceNow
   - Nombre: `html2pdf.js.jsdbx`

2. **download_pdf.js** - Script auxiliar (si existe)
   - Cargar como **UI Script** en ServiceNow
   - Nombre: `download_pdf.js.jsdbx`

## 📸 Recursos
- **Logo**: Actualiza el `sys_id` de la imagen del logo en:
  - `ExportRequestPDF.js` línea ~161
  - `pdf_request_ui_page.xml` línea ~145

```javascript
// Actualiza este sys_id con el de tu logo
'https://TU_INSTANCIA.service-now.com/sys_attachment.do?sys_id=TU_SYS_ID_LOGO'
```

## 🚀 Uso

1. Abre una solicitud (Request) en ServiceNow
2. Haz clic en el botón **Export PDF** (o el nombre que le hayas dado)
3. Espera el mensaje: "Generando PDF y adjuntando a la solicitud..."
4. Se abrirá un popup que:
   - Genera el PDF automáticamente
   - Lo descarga a tu computadora
   - Muestra un mensaje de confirmación
   - **Permanece abierto** para que puedas revisar el contenido o cerrarla manualmente

## ⚙️ Configuración Opcional

### Habilitar Recarga Automática de la Ventana Padre
Si deseas que la ventana padre se recargue automáticamente (para ver el attachment adjuntado), descomenta esta línea en `pdf_request_ui_page.xml`:

```javascript
// Línea ~310
// recargarVentanaPadre();
```

Cámbiala a:
```javascript
recargarVentanaPadre();
```

### Ajustar Tiempo de Recarga en UI Action
En `exportPDF.js`, puedes ajustar el tiempo de espera antes de recargar:

```javascript
setTimeout(function() {
    g_form.reload();
}, 2500); // Cambiar a 3000, 4000, etc.
```

## 📊 Contenido del PDF

El PDF generado incluye:

1. **Cabecera**
   - Logo de la organización
   - Número de solicitud

2. **Información Principal**
   - Solicitado por
   - Fecha
   - Asignado a
   - Grupo asignado
   - Estado
   - Etapa
   - Descripción corta
   - Descripción completa

3. **Artículos de Solicitud**
   - Número
   - Artículo
   - Precio

4. **Aprobadores**
   - Aprobador
   - Estado
   - Fecha de aprobación
   - Comentarios

## 🐛 Solución de Problemas

### El PDF no se genera
- Verifica que el plugin **PDF Generator** esté activado en ServiceNow
- Revisa los logs del servidor: `syslog` tabla

### El popup no se abre
- Verifica que tu navegador no esté bloqueando popups
- Revisa que el `uiPageSysId` sea correcto

### El attachment no se guarda
- Verifica permisos en la tabla `sys_attachment`
- Revisa que el API `sn_pdfgeneratorutils.PDFGenerationAPI` esté disponible

### La ventana se cierra automáticamente
- Verifica que estés usando la versión actualizada de `pdf_request_ui_page.xml`
- Busca que NO exista la línea `window.close()` en el script

## 📝 Logs y Debug

Los logs se pueden revisar en:
```
System Logs > System Log > Application Logs
```

Busca por:
- `[ExportRITMPDFAjaxRQ]`
- `[ExportRequestPDF]`

## 🤝 Contribuciones

Si encuentras algún problema o tienes sugerencias de mejora, por favor:
1. Documenta el problema
2. Incluye los logs relevantes
3. Describe el comportamiento esperado vs el actual

## 📄 Licencia

Este código es proporcionado como está, para uso en proyectos de ServiceNow.

---

**Versión**: 2.0
**Última actualización**: 2025-11-13
**Cambio principal**: Eliminación del cierre automático del popup
