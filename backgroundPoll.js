
var API_PREFIX = "https://r-a-d.io/api";
var API_DJ_IMG = "/dj-image/"


function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}
// 
// // Usage
// getDataUri('/logo.png', function(dataUri) {
//     // Do whatever you'd like with the Data URI!
// });
//


function poll() {

  $.getJSON(
    API_PREFIX,
    function(res) {
      var djName = res.main.djname;
      console.log(res.main.djname);

      chrome.storage.local.set({"djName":djName});

      var djImageId = res.main.dj.djimage;
      var imgUrl = API_PREFIX + API_DJ_IMG + djImageId;

      getDataUri(imgUrl, function(dataURI) {
        chrome.storage.local.set({"djImage":dataURI});
      });
    },
    function(err) {
      console.log(err);
    }
  );
}

poll();
