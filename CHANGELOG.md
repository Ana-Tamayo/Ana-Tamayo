# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [2.0.0] - 2025-11-13

### 🎯 Cambio Principal
**Prevenir el cierre automático del popup al recargar la página**

### ✨ Agregado
- Mensaje de estado visual en la UI Page que muestra el progreso de la generación del PDF
- Botón manual para cerrar la ventana popup cuando el usuario lo desee
- Función `mostrarMensaje()` para mostrar notificaciones al usuario
- Función `cerrarVentana()` para permitir el cierre manual del popup
- Función `recargarVentanaPadre()` para recargar opcionalmente la ventana padre
- Estilos CSS para el mensaje de estado (#statusMessage)
- Mensaje de carga mientras se genera el PDF
- Manejo de errores mejorado con mensajes visuales

### 🔧 Modificado
- **UI Page (`pdf_request_ui_page.xml`)**:
  - ❌ Eliminado `window.close()` automático después de la descarga
  - ✅ Agregado mensaje de confirmación "PDF descargado exitosamente"
  - ✅ Agregado botón "Cerrar Ventana" para cierre manual
  - ✅ Recarga de ventana padre está ACTIVA por defecto (puede deshabilitarse si se desea)
  - Mejorado el flujo del script `window.onload`
  - Agregado manejo de errores con `.catch()` en la promesa de html2pdf

- **UI Action (`exportPDF.js`)**:
  - Descomentadas las líneas de recarga del formulario
  - Mejorados los comentarios para claridad
  - Añadida documentación JSDoc

- **Script Includes**:
  - Añadida documentación JSDoc completa
  - Sin cambios funcionales (mantienen compatibilidad)

### 📝 Documentación
- Creado `README.md` con instrucciones completas de instalación y uso
- Documentadas las características mejoradas
- Agregadas secciones de solución de problemas
- Incluidas instrucciones de configuración opcional

### 🔄 Comportamiento Anterior vs Nuevo

#### Antes (v1.0)
```javascript
html2pdf().set(opt).from(element).save().then(function() {
    console.log('PDF descargado exitosamente - Recargando REQUEST');
    setTimeout(function() {
        try {
            if (opener) {
                opener.location.reload();
            }
        } catch(e) {
            console.log('No se pudo recargar ventana padre');
        }
        window.close(); // ⚠️ Se cerraba automáticamente
    }, 1000);
});
```

#### Ahora (v2.0)
```javascript
html2pdf().set(opt).from(element).save().then(function() {
    console.log('PDF descargado exitosamente: ' + filename);

    // ✅ Mensaje de éxito con botón para cerrar
    mostrarMensaje('✅ PDF descargado exitosamente. Puedes cerrar esta ventana.', true);

    // ✅ NO se cierra automáticamente
    // Usuario puede cerrar manualmente cuando lo desee

    // ✅ Recarga automática de ventana padre (ACTIVA)
    recargarVentanaPadre();

}).catch(function(error) {
    // ✅ Manejo de errores mejorado
    console.error('Error al generar PDF:', error);
    mostrarMensaje('❌ Error al generar el PDF. Por favor, inténtelo de nuevo.', true);
});
```

### 🎨 Mejoras de UI/UX
1. **Barra de estado superior**: Fondo verde (#27ae60) con mensaje claro
2. **Botón de cierre**: Diseño moderno con hover effects
3. **Mensaje de carga**: Indicador visual mientras se genera el PDF
4. **Transiciones suaves**: Mejor experiencia visual

### 🐛 Correcciones
- Eliminado el problema de la ventana cerrándose antes de que el usuario pueda revisarla
- Mejorado el control del usuario sobre el flujo de la aplicación
- Corregido el timing de la recarga de la ventana padre

### 📌 Notas de Migración
Si estás actualizando desde v1.0:

1. **Actualizar UI Page**: Reemplaza completamente el código de la UI Page
2. **Revisar UI Action**: Opcional, pero recomendado para tener los comentarios actualizados
3. **Probar**: Verifica que el popup ya no se cierre automáticamente
4. **Configurar recarga opcional**: Si necesitas que la ventana padre se recargue automáticamente, descomenta la línea indicada

### 🔐 Seguridad
- Sin cambios en seguridad
- Mantiene las mismas validaciones y permisos

### ⚡ Rendimiento
- Sin impacto en el rendimiento
- La generación del PDF sigue siendo igual de rápida

---

## [1.0.0] - Fecha Original

### Funcionalidades Iniciales
- Generación de PDF de solicitudes (Request)
- Adjunto automático del PDF al registro
- Descarga del PDF en el navegador
- Recarga automática de la ventana padre
- Cierre automático del popup después de la descarga

### Componentes Iniciales
- UI Action: exportPDF
- Script Include AJAX: ExportRITMPDFAjaxRQ
- Script Include: ExportRequestPDF
- UI Page: pdf_request

---

## Leyenda
- ✨ **Agregado**: Nuevas características
- 🔧 **Modificado**: Cambios en características existentes
- ❌ **Eliminado**: Características removidas
- 🐛 **Corregido**: Corrección de bugs
- 🔒 **Seguridad**: Correcciones de seguridad
- 📝 **Documentación**: Cambios solo en documentación
- ⚡ **Rendimiento**: Mejoras de rendimiento
