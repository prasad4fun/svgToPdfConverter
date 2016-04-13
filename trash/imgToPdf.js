// Because of security restrictions, getImageFromUrl will
// not load images from other domains.  Chrome has added
// security restrictions that prevent it from loading images
// when running local files.  Run with: chromium --allow-file-access-from-files --allow-file-access
// to temporarily get around this issue.
var getImageFromUrl = function(url, callback) {
	var img = new Image();

	img.onError = function() {
		alert('Cannot load image: "'+url+'"');
	};
	img.onload = function() {
		callback(img);
	};
	img.src = url;
}

// Since images are loaded asyncronously, we must wait to create
// the pdf until we actually have the image.
// If we already had the jpeg image binary data loaded into
// a string, we create the pdf without delay.
var createPDF = function(imgData) {
	var doc = new jsPDF();

	// This is a modified addImage example which requires jsPDF 1.0+
	// You can check the former one at examples/js/basic.js

	doc.addImage(imgData, 'JPEG', 10, 10, 50, 50, 'monkey'); // Cache the image using the alias 'monkey'
	doc.addImage('monkey', 70, 10, 100, 120); // use the cached 'monkey' image, JPEG is optional regardless
	// As you can guess, using the cached image reduces the generated PDF size by 50%!

	// Rotate Image - new feature as of 2014-09-20
	doc.addImage({
		imageData : imgData,
		angle     : -20,
		x         : 10,
		y         : 78,
		w         : 45,
		h         : 58
	});

	// Output as Data URI
	// doc.output('datauri');
	download_pdf('thinking-monkey.pdf', doc.output('dataurlstring'));
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

function svgToPdf(svgs, callback) {

  var pdfDoc = new jsPDF('portrait', 'pt');

    //If you just want a dataURI for an SVG,
    //you can call svgAsDataUri with an SVG node, options,
    //and a callback in which dataURI will be returned
    // console.log(svgs);
    // for(i = 0; i < svgs.length; i++)
		{
      var svg = svgs[i];

      svgAsDataUri(svg, {}, function(svg_uri) {
          var image = document.createElement('img');

          image.src = svg_uri;
          image.onload = function() {
              var canvas = document.createElement('canvas');
              var context = canvas.getContext('2d');
              var dataUrl;

              canvas.width = image.width;
              canvas.height = image.height;
              context.drawImage(image, 0, 0, image.width, image.height);
              dataUrl = canvas.toDataURL('image/jpeg', 1.0); //fullQuality image
              pdfDoc.addImage(dataUrl, 'JPEG', 0, 0, 600, 400); //image.width overflowing in the pdf page resolution

              if (i == svgs.length - 1) {
                callback(pdfDoc);
              }
          }
      });
    }
}
var invoke = function(){
	getImageFromUrl([thinking-monkey.jpg, thinking-monkey2.jpg, thinking-monkey3.jpg,], createPDF);
}
