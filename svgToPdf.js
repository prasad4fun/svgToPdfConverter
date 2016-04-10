function triggerSvgToPdf() {
    svgToPdf(document.querySelector("div#graph svg"), function(pdf) {
        download_pdf('Income of Country (In trillion dollars).pdf', pdf.output('dataurlstring'));
    });
};

function svgToPdf(svg, callback) {

    //If you just want a dataURI for an SVG,
    //you can call svgAsDataUri with an SVG node, options,
    //and a callback in which dataURI will be returned

    svgAsDataUri(svg, {}, function(svg_uri) {
        var image = document.createElement('img');

        image.src = svg_uri;
        image.onload = function() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var pdfDoc = new jsPDF('portrait', 'pt');
            var dataUrl;

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
            dataUrl = canvas.toDataURL('image/jpeg', 1.0); //fullQuality image
            pdfDoc.addImage(dataUrl, 'JPEG', 0, 0, 600, 400); //image.width overflowing in the pdf page resolution
            callback(pdfDoc);
        }
    });
}

function download_pdf(name, dataUriString) {
    var pdfDocLink = document.createElement('a');
    pdfDocLink.addEventListener('click', function(ev) {
        pdfDocLink.href = dataUriString;
        pdfDocLink.download = name;
        document.body.removeChild(pdfDocLink);
    }, false);
    document.body.appendChild(pdfDocLink);
    pdfDocLink.click();
}
