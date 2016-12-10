
var API_PREFIX = "https://r-a-d.io/api";
var API_DJ_IMG = "/dj-image/"

var prevDjName = "";

// get the DataUri of an external img via URL
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

function createNotification(djName, djImage) {
  chrome.notifications.create("R/a/dio", {
    type: "basic",
    title: "R/a/dio",
    iconUrl: djImage,
    message: djName + "has started DJing"
  });
}

// Polls r-a-d.io for the name and image
function pollRadio() {
  $.getJSON(
    API_PREFIX,
    function(res) {
      var djName = res.main.djname;

      if (prevDjName == djName) {
        return;
      }

      chrome.storage.local.set({"djName":djName});

      var djImageId = res.main.dj.djimage;
      var imgUrl = API_PREFIX + API_DJ_IMG + djImageId;
      getDataUri(imgUrl, function(dataURI) {
        chrome.storage.local.set({"djImage":dataURI});
        createNotification(djName, dataURI);
      });
    },
    function(err) {
      console.log(err);
    }
  );
}

pollRadio();
// polls r-a-dio every 5 minutes
window.setInterval(pollRadio, 1000*60*5);
