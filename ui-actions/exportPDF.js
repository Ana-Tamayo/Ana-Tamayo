/**
 * UI Action: Export PDF
 * Description: Genera un PDF de la solicitud y lo adjunta al registro
 * Table: sc_request
 */

function exportPDF() {
    var requestId = g_form.getUniqueValue();
    var uiPageSysId = '11d197222b853210ec20f933c891bfd7';
    var url = '/ui_page.do?sys_id=' + uiPageSysId + '&sysparm_request_id=' + requestId;

    g_form.addInfoMessage('Generando PDF y adjuntando a la solicitud...');

    var ga = new GlideAjax('ExportRITMPDFAjaxRQ');
    ga.addParam('sysparm_name', 'generate');
    ga.addParam('sysparm_request_id', requestId);

    ga.getXMLAnswer(function(response) {
        if (response.indexOf('PDF_DESCARGADO_RECARGA_REQUEST') !== -1) {
            g_form.addInfoMessage('PDF generado. Abriendo descarga...');

            // Abrir popup para descargar el PDF
            g_navigation.openPopup(url);

            // Opcional: Recargar el formulario después de un tiempo para ver el attachment
            // Si no necesitas recargar, comenta o elimina estas líneas
            setTimeout(function() {
                g_form.reload();
            }, 2500);

        } else if (response.indexOf('✅') !== -1) {
            g_form.addInfoMessage(response);
            g_navigation.openPopup(url);

            setTimeout(function() {
                g_form.reload();
            }, 2500);

        } else {
            g_form.addErrorMessage('Error: ' + response);
        }
    });
}
