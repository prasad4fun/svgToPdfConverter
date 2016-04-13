function triggerSvgToPdf(svgDiv) {
  var pdf = new jsPDF();
  var count = 0;
  var graphContainers = svgDiv.getElementsByClassName("svgContainer")

  svgToPdf(pdf, count, graphContainers);
}

var svgToPdf = function(pdf, count, graphContainers) {

  for (var j = 0; j < graphContainers.length; j++) {
    var graphContainer = graphContainers[j].getElementsByTagName("svg")[0];
    var elem_graph = graphContainer;

    svgAsDataUri(elem_graph, {}, function(url) {
      var img = document.createElement('img');
      var canvas = document.createElement('canvas');
      canvas.height = "500";
      canvas.width = "1000";
      var ctx = canvas.getContext("2d");
      img.onload = (function(img) {
        return function() {
          count++;
          ctx.drawImage(img, 0, 0);
          var png = canvas.toDataURL("image/png");
          // pdf.addPage();
          pdf.addImage(png, 'PNG', 0, ((count-1) * 50)+20, 200, 50);
          if (count === graphContainers.length) {
            pdf.save("test.pdf");
          }
        }
      })(img);
      img.src = url;
    });
  }
}
