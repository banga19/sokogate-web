// Export page as PDF
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
    install(Vue) {
        Vue.prototype.getPdf = function (title) {
            var element = document.querySelector('#pdfDom'); // DOM element to export as PDF
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    html2Canvas(element).then(function (canvas) {
                        try {
                            var contentWidth = canvas.width;
                            var contentHeight = canvas.height;

                            // Canvas height for one PDF page;
                            var pageHeight = contentWidth / 592.28 * 841.89;
                            // HTML page height not yet in PDF
                            var leftHeight = contentHeight;
                            // Page offset
                            var position = 0;
                            // A4 paper [595.28,841.89], canvas dimensions in PDF
                            var imgWidth = 595.28;
                            var imgHeight = 592.28 / contentWidth * contentHeight;

                            var pageData = canvas.toDataURL('image/jpeg', 1.0);

                            var pdf = new JsPDF('', 'pt', 'a4');

                            // Two heights: actual HTML vs PDF page height (841.89)
                            // Content fits one PDF page, no pagination needed
                            if (leftHeight < pageHeight) {
                                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                            } else {
                                while (leftHeight > 0) {
                                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                                    leftHeight -= pageHeight;
                                    position -= 841.89;
                                    // Avoid adding blank pages
                                    if (leftHeight > 0) {
                                        pdf.addPage();
                                    }
                                }
                            }
                            pdf.save(title + '.pdf');
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    }).catch(reject);
                }, 0);
            });
        }
    }
}