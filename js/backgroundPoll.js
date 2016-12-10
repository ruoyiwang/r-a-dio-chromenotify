var API_MAIN = "https://r-a-d.io/api";
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

// sends a notification based on the dj name and image
function createNotification(djName, djImage) {
  chrome.notifications.create("R/a/dio", {
    type: "basic",
    title: "R/a/dio",
    iconUrl: djImage,
    message: djName + " is currently DJing"
  });
}

function setBadge(djName) {
  chrome.browserAction.setBadgeText({
    text: djName.charAt(0)
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: "#222222"
  })
}

// Polls r-a-d.io for the name and image
function pollRadio() {
  $.getJSON(
    API_MAIN,
    function(res) {
      var djName = res.main.djname;

      // only poll img and update if dj changed
      if (prevDjName == djName) {
        return;
      }
      prevDjName = djName;

      setBadge(djName);
      chrome.storage.local.set({"djName":djName});

      var djImageId = res.main.dj.djimage;
      var imgUrl = API_MAIN + API_DJ_IMG + djImageId;
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
