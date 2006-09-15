

loadModule("Words");
loadModule("Editor");
loadModule("Console");
loadModule("Ajax");
applyFixes();
init();


var tooltip = null;
var applet_archive = "pint.jar";


// Initialize all services
function init()
{
  var hasMainBox = document.getElementById("mainBox");
  var modulesLoaded = window.Ajax && window.Editor && window.Console;

  if (document.getElementById("messageLayer")) {
    showCapabilities();
  }
  if (!hasMainBox || !modulesLoaded) {
    // Wait for mainBox element to be created and for all modules to be loaded
    setTimeout(function() { init(); }, 100);
  }
  else {
    // Load dummy applet to cache the jar file
    document.body.appendChild(createAppletElement("Pint"));

    // Instantiate modules
    new Editor();
    new Console();

    // Hide some page contents
    hideBox("topicBox");
    hideBox("problemBox");
    hideTab("history");
    hideTab("problem");
    hideTab("examples");
    hideTab("solution");
    openTab("editor");

    // Obtain the real name of the logged-in user (if any)
    Ajax.makeRequest("manage/pintUI.py/getRealName", null, function(text) { fillLoginBox(text); });
    applyFixes(true);
  }
}


// Load external javascript module
function loadModule(name)
{
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", ("modules/" + name + ".js"));
  document.getElementsByTagName("head")[0].appendChild(script);
}


// Write a capabilities table in a special message layer element
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


// Add link to the Control Panel when root is logged-in
function addControlPanelLink(nickname)
{
  var login = document.getElementById("login");

  if (nickname == "root") {
    login.innerHTML += " (<a href=\"manage/users.html\">control panel</a>)";      
  }
}

// Generate the Login box
function fillLoginBox(realname)
{
  var login = document.getElementById("login");

  if (realname != "<none>") {
    login.innerHTML = "Welcome <i>" + realname + "</i> (<a href=\"manage/authi.py/logout\">logout</a>)";
    Ajax.makeRequest("manage/pintUI.py/getNickname", null, function(text) { addControlPanelLink(text); });
    updateTopicsBox();
    updateHistoryTab();
  }
  else {
    var username = "<label>username: </label><input name=\"nick\" type=\"text\"><br>";
    var password = "<label>password: </label><input name=\"password\" type=\"password\"><br>";
    var sbutton = "<input id=\"submit\" type=\"submit\" value=\"login\">"

    login.innerHTML = "<form action=\"manage/authi.py/auth\" method=\"POST\">" + username + password + sbutton + "</form>";
  }
}


// Apply various fixes and enhancements
function applyFixes(elementFixes)
{
  // Extend the String object with some useful methods
  String.prototype.encodeEntities = function() { return this.replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  String.prototype.contains = function(text) { return (this.indexOf(text) >= 0); };
  String.prototype.startsWith = function(text) { return (this.indexOf(text) == 0); };
  String.prototype.endsWith = function(text) { return (this.lastIndexOf(text) == this.length-text.length); };

  if (elementFixes) {
    // set ID attributes with NAME attribute value when available
    var elements = document.all || document.getElementsByTagName("*");
    for(var i = 0; i < elements.length; i++) with (elements.item(i)) {
      if (name && !id) id = name;
    }

    // Disable FORM autocomplete to avoid nasty Firefox hidden caret bug
    var elements = document.getElementsByTagName("form");
    if (navigator.userAgent.contains("Firefox")) {
      for(var i = 0; i < elements.length; i++) with (elements.item(i)) {
        setAttribute("autocomplete", "off");
      }
    }
  }
}


// Set the internal HTML code of an element to a new value
function updateElement(name, text)
{
  var element = document.getElementById(name);
  openTab(name);
  element.innerHTML = text;
}


// Update the Examples tab with data fetched from the server
function updateExamplesTab()
{
  Ajax.makeRequest("manage/pintUI.py/getExamplesByTopic", { topic: current_topic },
    function(text) { updateElement("examples", "<textarea>" + text.encodeEntities() + "</textarea>"); });
}


// Update the Solution tab with data fetched from the server
function updateSolutionTab()
{
  Ajax.makeRequest("manage/pintUI.py/getProblemSolution", { name : current_problem },
    function(text) { updateElement("solution", "<textarea>" + text.encodeEntities() + "</textarea>"); hideTab("solution"); });
}

// Update the History tab with data fetched from the server
function updateHistoryTab()
{
  Ajax.makeRequest("manage/pintUI.py/getUserHistory", { },
    function(text) { updateElement("history", text); });
}


// Update the Problem tab with data fetched from the server
function updateProblemTab()
{
  Ajax.makeRequest("manage/pintUI.py/getProblemText", { name : current_problem },
    function(text) { updateElement("problem", "<textarea>" + text.encodeEntities() + "</textarea>"); });
}


// Update the Problems box with data fetched from the server
function updateProblemsBox()
{
  Ajax.makeRequest("manage/pintUI.py/getProblemsByTopic", { topic: current_topic },
    function(text) { updateElement("problems", text); openBox("problemBox"); });
}


// Update the Topics box with data fetched from the server
function updateTopicsBox()
{
  Ajax.makeRequest("manage/pintUI.py/getTopics", null,
    function(text) { updateElement("topics", text); openBox("topicBox"); });
}


// Set current problem state as learned
function markProblemAsLearned()
{
  Ajax.makeRequest("manage/pintUI.py/markProblemAsLearned", { problem: current_problem },
    function(text) { if (text != "OK") alert(text) } );
}

// Activate a new Topic and update Problems and Examples
function setTopic(new_topic)
{
  current_topic = new_topic;
  var topics = document.getElementById("topics").getElementsByTagName("a");
  for (var t in topics) {
    topics[t].className = ((topics[t].id == ("topic_" + new_topic)) ? "active" : "");
  }

  updateProblemsBox();
  updateExamplesTab();
}


// Activate a new Problem and show it
function setProblem(new_problem)
{
  current_problem = new_problem;
  var problems = document.getElementById("problems").getElementsByTagName("a");
  for (var p in problems) {
    problems[p].className = ((problems[p].id == ("problem_" + new_problem)) ? "active" : "");
  }

  updateSolutionTab();
  updateProblemTab();
}

// Creates an Applet HTML element
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


// Hides a specified tab
function hideTab(name)
{
  var tabs = document.getElementById("tabPane").getElementsByTagName("a");
  var contents = document.getElementById("contentPane").getElementsByTagName("div");

  for (var i = 0; i < tabs.length; i++) {
    if (contents[i].id == name) {
      tabs[i].style.visibility = "hidden";
    }
  }
}


// Opens a specified tab
function openTab(name)
{
  var tabs = document.getElementById("tabPane").getElementsByTagName("a");
  var contents = document.getElementById("contentPane").getElementsByTagName("div");

  for (var i = 0; i < tabs.length; i++) {
    eval("var f = function() { openTab(\"" + tabs[i].innerHTML + "\"); };");
    tabs[i].onclick = f;
    tabs[i].className = contents[i].className = ((contents[i].id == name) ? "active": "");
    if (contents[i].id == name) {
      tabs[i].style.visibility = "visible";
    }
  }
}


// Hides a specified box element
function hideBox(name)
{
  var box = document.getElementById(name);
  var boxChildren = box.getElementsByTagName("div");
  box.style.display = boxChildren[0].style.display = boxChildren[1].style.display = "none";
}


// Opens a specified box element
function openBox(name)
{
  var box = document.getElementById(name);
  var boxChildren = box.getElementsByTagName("div");
  box.style.display = boxChildren[0].style.display = boxChildren[1].style.display = "block";
}

