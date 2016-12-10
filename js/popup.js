$(function () {
  chrome.storage.local.get("djName",
    function(res){
      $('#dj-name').text(res.djName);
    });

  chrome.storage.local.get("djImage",
    function(res){
      console.log(res.djImage);
      $('#dj-image').attr("src", res.djImage);
    });
});
