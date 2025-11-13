/**
 * Script Include: ExportRITMPDFAjaxRQ
 * Description: AJAX processor para generar PDF de solicitudes
 * API Name: ExportRITMPDFAjaxRQ
 * Client Callable: true
 */

var ExportRITMPDFAjaxRQ = Class.create();
ExportRITMPDFAjaxRQ.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    generate: function() {
        try {
            var requestSysId = this.getParameter('sysparm_request_id');

            gs.info('[ExportRITMPDFAjaxRQ] Request ID recibido: ' + requestSysId);

            if (!requestSysId) {
                gs.error('[ExportRITMPDFAjaxRQ] ERROR: No se recibió sysparm_request_id');
                return '❌ Error: No se recibió el ID de la solicitud';
            }

            var request = new GlideRecord('sc_request');
            if (!request.get(requestSysId)) {
                gs.error('[ExportRITMPDFAjaxRQ] ERROR: Request no encontrado: ' + requestSysId);
                return '❌ Error: La solicitud no existe';
            }

            var requestNumber = request.getDisplayValue('number');
            gs.info('[ExportRITMPDFAjaxRQ] Generando PDF para Request: ' + requestNumber);

            var exporter = new ExportRequestPDF();
            var result = exporter.generatePDF(requestSysId);

            gs.info('[ExportRITMPDFAjaxRQ] Resultado: ' + result);

            if (result.indexOf('✅') !== -1) {
                gs.info('[ExportRITMPDFAjaxRQ] PDF adjuntado correctamente para: ' + requestNumber);
                return '✅ATTACHMENT_LISTO';
            }

            return result;

        } catch (e) {
            gs.error('[ExportRITMPDFAjaxRQ] Excepción: ' + e.message);
            gs.error('[ExportRITMPDFAjaxRQ] Stack: ' + e.stack);
            return '❌ Error al generar PDF: ' + e.message;
        }
    },

    type: 'ExportRITMPDFAjaxRQ'
});
