
loadModule("Words");
loadModule("Editor");
loadModule("Console");
loadModule("Ajax");
init();

var tooltip = null;
var applet_archive = "pint.jar";

function init()
{
  var hasMainBox = document.getElementById("mainBox");
  var modulesLoaded = window.Ajax && window.Editor && window.Console;

  if (document.getElementById("messageLayer")) {
    showCapabilities();
  }
  if (!hasMainBox || !modulesLoaded) {
    setTimeout(function() { init(); }, 100);
  }
  else {
    document.body.appendChild(createAppletElement("Pint"));
    new Editor();
    new Console();

//    var ajax = new Ajax();
//    ajax.makeRequest("test.html", null, function(responseText) { alert(responseText); });
    applyFixes();
    enableTooltips();
    openTab(0);
  }
}

function loadModule(name)
{
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", ("modules/" + name + ".js"));
  document.getElementsByTagName("head")[0].appendChild(script);
}

function showCapabilities()
{
  with (document) var capabilities = {
    "W3C DOM functions": new Boolean(getElementById && createElement),
    "Content properties": new Boolean(body.innerHTML && (body.innerText || body.textContent)),
    "AJAX functions" : new Boolean(window.XMLHttpRequest || window.ActiveXObject),
    "Cookies": navigator.cookieEnabled,
    "Java VM": new Boolean(document.applets && navigator.javaEnabled()),
    "Javascript modules": new Boolean(window.Ajax && window.Editor && window.Console),
    "Pint dummy applet": new Boolean(document.Pint),
    "EditorToolbar": new Boolean(document.EditorToolbar),
    "ConsoleService": new Boolean(document.ConsoleService)
  }

  var ct = "<div><h3>Capabilities Diagnosis</h3><table style=\"width: 100%\">"
  for (var i in capabilities) {
    ct += "<tr><td>" + i + "<td>" + capabilities[i];
  }
  ct += "</table></div>"
  
  var layer = document.getElementById("messageLayer");
  layer.innerHTML = ct;
  layer.onclick = function() {
    this.style.zIndex = -20;
    this.style.visibility = "hidden";
  };
  setTimeout(function() { showCapabilities(); }, 500);
}

function applyFixes()
{
  // Extend the String object with some useful methods
  String.prototype.equals = function(text) { return (this == text); };
  String.prototype.contains = function(text) { return (this.indexOf(text) >= 0); };
  String.prototype.startsWith = function(text) { return (this.indexOf(text) == 0); };
  String.prototype.endsWith = function(text) { return (this.lastIndexOf(text) == this.length-text.length); };


  // set ID attributes with NAME attribute value when available
  var elements = document.all || document.getElementsByTagName("*");
  for(var i = 0; i < elements.length; i++) with (elements.item(i)) {
    if (name && !id) {
      id = name;
    }
  }

  // Disable FORM autocomplete to avoid nasty Firefox hidden caret bug
  var elements = document.getElementsByTagName("form");
  if (navigator.userAgent.contains("Firefox")) {
    for(var i = 0; i < elements.length; i++) with (elements.item(i)) {
      setAttribute("autocomplete", "off");
    }
  }
}

function updateTooltip(e)
{
  if (tooltip) {
    var x = (document.all ? window.event.x + document.body.scrollLeft : e.layerX);
    var y = (document.all ? window.event.y + document.body.scrollTop : e.layerY);

    tooltip.style.left = (x + 12) + "px";
    tooltip.style.top = (y + 12) + "px";
  }
}

function showTooltip(id)
{
  tooltip = document.getElementById(id);
  setTimeout(function() { if (tooltip) tooltip.style.display = "block" }, 1000);
}

function hideTooltip()
{
  if (tooltip) {
    tooltip.style.display = "none";
    tooltip = null;
  }
}

function enableTooltips()
{
  document.onmousemove = updateTooltip;
  var divs = document.getElementsByTagName("span");

  for (var i in divs) {
    if (divs[i] && divs[i].className && divs[i].className.contains("tooltip")) {
      divs[i].id = divs[i].parentNode.id + "_tooltip";
      eval("var f = function() { showTooltip(\"" + divs[i].id + "\") }");
      divs[i].parentNode.onmouseover = f;
      divs[i].parentNode.onmouseout = hideTooltip;
    }
  }
}

function createAppletElement(code, params, width, height)
{
  function createParamElement(name, value) {
    var param = document.createElement("param");
    param.setAttribute("name", name);
    param.setAttribute("value", value);
    return param;
  }

  var applet = document.createElement("applet");
  applet.setAttribute("name", code);
  applet.setAttribute("archive", applet_archive);
  applet.setAttribute("code", code);
  applet.setAttribute("width", (width || 0));
  applet.setAttribute("height", (height || 0));
  applet.setAttribute("mayscript", true);
  for (var name in params) {
    applet.appendChild(createParamElement(name, params[name]));
  }
  return applet;
}

function openTab(n)
{
  var tabs = document.getElementById("tabPane").getElementsByTagName("a");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].className = ((i == n) ? "active": "");
    eval("var f = function() { openTab(" + i + "); };");
    tabs[i].onclick = f;
  }
  var contents = document.getElementById("contentPane").getElementsByTagName("div");
  for (var i = 0; i < contents.length; i++) {
    contents[i].className = ((i == n) ? "active": "");
  }
}

