/**
 * Script Include: ExportRequestPDF
 * Description: Genera PDFs de solicitudes con su información completa
 * API Name: ExportRequestPDF
 */

var ExportRequestPDF = Class.create();
ExportRequestPDF.prototype = {
    initialize: function() {},

    generatePDF: function(requestSysId) {
        try {
            var request = new GlideRecord('sc_request');
            if (!request.get(requestSysId)) {
                return '❌ No se encontró la solicitud.';
            }

            var requestNumber = request.getValue('number');
            var pdfName = 'Solicitud_' + requestNumber + '.pdf';

            var html = this.buildFullHTML(request);

            var pageProps = {
                PageSize: 'A4',
                GeneratePageNumber: 'true',
                TopOrBottomMargin: '36',
                LeftOrRightMargin: '36',
                PageNumberPlacement: 'bottom-right'
            };

            var pdfAPI = new sn_pdfgeneratorutils.PDFGenerationAPI();
            var result = pdfAPI.convertToPDFWithHeaderFooter(
                html,
                'sc_request',
                requestSysId,
                pdfName,
                pageProps,
                ''
            );

            if (result && result.status === 'success') {
                var attachmentId = this.savePDFAsAttachment(requestSysId, pdfName, result);
                if (attachmentId) {
                    gs.info('[ExportRequestPDF] PDF generado y guardado como attachment: ' + pdfName + ' - ' + attachmentId);
                    return '✅PDF_DESCARGADO_RECARGA_REQUEST';
                } else {
                    gs.info('[ExportRequestPDF] PDF generado exitosamente: ' + pdfName);
                    return '✅PDF_DESCARGADO_RECARGA_REQUEST';
                }
            } else {
                gs.error('[ExportRequestPDF] Error: ' + JSON.stringify(result));
                return '⚠️ Error al generar el PDF: ' + JSON.stringify(result);
            }

        } catch (e) {
            gs.error('[ExportRequestPDF] Excepción: ' + e.message);
            return '❌ Error interno: ' + e.message;
        }
    },

    savePDFAsAttachment: function(requestSysId, fileName, result) {
        try {
            if (result && result.attachmentSysId) {
                var attachment = new GlideRecord('sys_attachment');
                if (attachment.get(result.attachmentSysId)) {
                    gs.info('[ExportRequestPDF] Attachment guardado: ' + fileName + ' - ' + result.attachmentSysId);
                    return result.attachmentSysId;
                }
            }
        } catch (e) {
            gs.error('[ExportRequestPDF] Error guardando attachment: ' + e.message);
        }
        return null;
    },

    buildFullHTML: function(request) {
        var html = '';
        html += '<html>';
        html += this.getHeadSection(request);
        html += '<body>';
        html += this.getBodyContent(request);
        html += '</body>';
        html += '</html>';
        return html;
    },

    getHeadSection: function(request) {
        var requestNumber = request.getDisplayValue('number');
        var head = '<head>';
        head += '<meta charset="UTF-8">';
        head += '<title>Detalle de Solicitud ' + requestNumber + '</title>';
        head += '<style>';
        head += this.getCSSStyles();
        head += '</style>';
        head += '</head>';
        return head;
    },

    getCSSStyles: function() {
        var css = '';
        css += '*  {font-family: Arial, Helvetica, sans-serif;}';
        css += 'body { margin: 0; padding: 0px; background: white; color: #1a1a1a; }';
        css += 'table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-left: auto; margin-right: auto; background: white; }';
        css += 'th, td { padding: 10px 14px; text-align: left; }';
        css += 'th { background: #2c3e50; color: white; font-weight: 600; font-size: 13px; }';
        css += 'td b { color: #2c3e50; font-weight: 600; }';
        css += '.logo { background: #ffffff; padding: 15px; }';
        css += '.logo img { max-width: 140px; height: auto; }';
        css += '#numeroReporte { font-size: 32px; color: #2c3e50; font-weight: 700; }';
        css += '.section-header { background: #2c3e50; color: white; padding: 10px 16px; font-weight: 600; font-size: 13px; }';
        css += '.spacer { height: 15px; border: none; background: transparent; }';
        css += '.table-items { width: 100%; border-collapse: collapse; }';
        css += '.table-items th { background: #2c3e50; color: white; padding: 10px; }';
        css += '.table-items td { padding: 10px; border-bottom: 1px solid #ddd; }';
        return css;
    },

    getBodyContent: function(request) {
        var body = '<table>';
        body += this.getHeaderSection(request);
        body += this.getMainInfoSection(request);
        body += this.getItemsSection(request);
        body += this.getApproversSection(request);
        body += '</table>';
        return body;
    },

    getHeaderSection: function(request) {
        var requestNumber = request.getDisplayValue('number');
        var html = '';
        html += '<tr>';
        html += '<td class="logo" rowspan="2">';
        html += '<img src="https://ipadedev.service-now.com/sys_attachment.do?sys_id=e1aa60323b8172104fc12911a3e45a10" alt="Logo" />';
        html += '</td>';
        html += '</tr>';
        html += '<tr><td id="numeroReporte">' + requestNumber + '</td></tr>';
        return html;
    },

    getMainInfoSection: function(request) {
        var html = '';
        html += '<tr><td><b>Solicitado por:</b></td><td>' + request.getDisplayValue('opened_by.name') + '</td></tr>';
        html += '<tr><td><b>Fecha:</b></td><td>' + request.getDisplayValue('opened_at') + '</td></tr>';
        html += '<tr><td><b>Asignado a:</b></td><td>' + request.getDisplayValue('assigned_to') + '</td></tr>';
        html += '<tr><td><b>Grupo asignado:</b></td><td>' + request.getDisplayValue('assignment_group') + '</td></tr>';
        html += '<tr><td><b>Estado:</b></td><td>' + request.getDisplayValue('state') + '</td></tr>';
        html += '<tr><td><b>Etapa:</b></td><td>' + request.getDisplayValue('stage') + '</td></tr>';
        html += '<tr><td><b>Descripción corta:</b></td><td>' + request.getDisplayValue('short_description') + '</td></tr>';
        html += '<tr><td><b>Descripción:</b></td><td>' + request.getDisplayValue('description') + '</td></tr>';
        html += '<tr><td colspan="2" class="spacer"></td></tr>';
        return html;
    },

    getItemsSection: function(request) {
        var html = '';
        html += '<tr><th colspan="3" class="section-header">Artículos de la Solicitud</th></tr>';

        var requestId = request.getValue('sys_id');
        var items = new GlideRecord('sc_req_item');
        items.addQuery('request', requestId);
        items.orderBy('number');
        items.query();

        if (items.hasNext()) {
            html += '<tr><td colspan="3" style="padding:0; border:none;">';
            html += '<table class="table-items">';
            html += '<tr>';
            html += '<th style="width: 25%;">Número</th>';
            html += '<th style="width: 50%;">Artículo</th>';
            html += '<th style="width: 25%;">Precio</th>';
            html += '</tr>';

            while (items.next()) {
                html += '<tr>';
                html += '<td>' + items.getDisplayValue('number') + '</td>';
                html += '<td>' + items.getDisplayValue('cat_item') + '</td>';
                html += '<td>' + items.getDisplayValue('price') + '</td>';
                html += '</tr>';
            }

            html += '</table>';
            html += '</td></tr>';
        } else {
            html += '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #666;">';
            html += 'No hay artículos en esta solicitud.';
            html += '</td></tr>';
        }

        html += '<tr><td colspan="3" class="spacer"></td></tr>';
        return html;
    },

    getApproversSection: function(request) {
        var html = '';
        html += '<tr><th colspan="4" class="section-header">Aprobadores</th></tr>';

        var requestId = request.getValue('sys_id');
        if (requestId) {
            var approvers = new GlideRecord('sysapproval_approver');
            approvers.addQuery('sysapproval', requestId);
            approvers.orderBy('order');
            approvers.query();

            if (approvers.hasNext()) {
                html += '<tr><td colspan="4" style="padding:0; border:none;">';
                html += '<table class="table-items">';
                html += '<tr>';
                html += '<th style="width: 25%;">Aprobador</th>';
                html += '<th style="width: 25%;">Estado</th>';
                html += '<th style="width: 25%;">Fecha</th>';
                html += '<th style="width: 25%;">Comentarios</th>';
                html += '</tr>';

                while (approvers.next()) {
                    html += '<tr>';
                    html += '<td>' + approvers.getDisplayValue('approver') + '</td>';
                    html += '<td>' + approvers.getDisplayValue('state') + '</td>';
                    html += '<td>' + approvers.getDisplayValue('sys_updated_on') + '</td>';
                    html += '<td>' + approvers.getDisplayValue('comments') + '</td>';
                    html += '</tr>';
                }

                html += '</table>';
                html += '</td></tr>';
            } else {
                html += '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">';
                html += 'No hay aprobadores registrados.';
                html += '</td></tr>';
            }
        }

        return html;
    },

    type: 'ExportRequestPDF'
};
