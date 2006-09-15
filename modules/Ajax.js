
function Ajax()
{
  var request = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));

  this.makeRequest = function(baseURL, params, responseHandler)
  {
    var url = baseURL + "?";

    for (var i in params) {
      url += i + "=" + escape(params[i]) + "&";
    }

    request.open("GET", url, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          responseHandler(request.responseText);
        }
        else {
          alert("Error " + request.status + " - " + request.statusText + " while requesting \"" + url + "\"");
        }
      }
    }
    request.send(null);
  }
}


Ajax.makeRequest = function(baseURL, params, responseHandler)
{
  (new Ajax()).makeRequest(baseURL, params, responseHandler);
}
