

function Editor()
{
  editor_init();

  // Initialize Editor module
  function editor_init()
  {
    // Javascript functions needed by the EditorToolbar applet
    var params = {
      getFilenameFunction: "Editor_getFilename",
      setFilenameFunction: "Editor_setFilename",
      clearCodeFunction: "Editor_clearText",
      getCodeFunction: "Editor_getText",
      setCodeFunction: "Editor_setText",
      highlightCodeFunction: "Editor_highlight",
      showOutputFunction: "Editor_showOutput"
    }
    var toolbar = createAppletElement("EditorToolbar", params, 496, 36);
    toolbar.style.display = "block";

    var editarea = document.createElement("iframe");
    editarea.id = "editarea";

    var statusbar = document.createElement("p");
    statusbar.id = "statusbar";

    // Add HTML elements to the document
    var editor = document.getElementById("editor");
    editor.parentNode.insertBefore(toolbar, editor);
    editor.appendChild(editarea);
    editor.appendChild(statusbar);

    // Workarounds to JVM and browser bugs
    removeToolbarWhenHidden();
    editor.onmouseover = function() { document.getElementsByTagName("textarea")[0].style.display = "none"; }

    // Create IFrame editable document
    var doc = Editor.getDocument();
    var head = "<head><link rel=\"stylesheet\" type=\"text/css\" href=\"styles/editor.css\">";
    var body = "<body id=\"editor\"><br>";
    doc.write("<html>" + head + body);
    doc.close();
    doc.designMode = "on";
  }

  // Unload the ToolbarEditor applet when it should be hidden
  function removeToolbarWhenHidden()
  {
    var editor = document.getElementById("editor");
    var toolbar = document.EditorToolbar;

    Editor.getDocument().designMode = "on";
    toolbar.style.display = ((editor.className.indexOf("active") < 0) ? "none" : "block");
    setTimeout(function() { removeToolbarWhenHidden(); }, 50);
  }
}


// Get the filename of the currently loaded file
Editor_getFilename = Editor.getFilename = function()
{
  return Editor.filename;
}


// Set a new filename and update the statusbar
Editor_setFilename = Editor.setFilename = function(text)
{
  document.getElementById("statusbar").innerHTML = " Filename: <i>" + text + "</i>";
  Editor.filename = text;
}


// Obtain the document object of the editarea
Editor.getDocument = function()
{
  return (!document.all ? document.getElementById("editarea").contentDocument : frames["editarea"].document);
}


// Get current code inside the editor
Editor_getText = Editor.getText = function()
{
  var doc = Editor.getDocument();
  doc.body.innerHTML = doc.body.innerHTML.replace(/\n/g, "").replace(/<br>/g, "<br>\n");
  var text = (!doc.all ? doc.body.textContent : doc.body.innerText).replace(/\xA0/g, " ");
  if (!text.endsWith("\n")) text += "\n";
  return text;
}


// Set code inside the editor
Editor_setText = Editor.setText = function(text)
{
  var doc = Editor.getDocument();
  text = (new String(text)).encodeEntities().replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;");
  doc.body.innerHTML = text;
}


// Clear the editor
Editor_clearText = Editor.clearText = function()
{
  Editor.setText("");
}


// Apply syntax highlighting to the editor code
Editor_highlight = Editor.highlight = function(isource)
{
  function compareByLength(a, b) { return (b.length - a.length); }
  function span(text, sclass) { return ("<span class=\"" + sclass + "\">" + text + "</span>"); }

  var source = (isource || Editor.getText()).encodeEntities().replace(/ /g, "&nbsp;");
  var keywords = special_words["python_keywords"].sort(compareByLength);
  var text = "";

  while (source != "") {
    // Highlight quoted strings
    if (source.charAt(0) == '\"') {
      var j;
      for (j = 1; (source.charAt(j) != '\"') || (source.charAt(j-1) == "\\"); j++);
      var quotedString = source.substr(0, j+1);
      text += span(quotedString, "quoted");
      source = source.substr(j+1, source.length-j);
      continue;
    }

    // Highlight comments
    if (source.charAt(0) == '#') {
      var j;
      for (j = 1; (source.charAt(j) != '\n'); j++);
      var commentString = source.substr(0, j+1);
      text += span(commentString, "comment");
      source = source.substr(j+1, source.length-j);
      continue;
    }

    // Highlight numbers
    if (source.charAt(0).match(/\d/)) {
      var j;
      for (j = 1; source.charAt(j).match(/\d/); j++);
      var numberString = source.substr(0, j);
      text += span(numberString, "number");
      source = source.substr(j, source.length-j);
      continue;
    }

    // Highlight keywords
    var keywordFound = false;
    for (var i in keywords) {
      var word = source.substr(0, keywords[i].length);
      if (word == keywords[i]) {
        text += span(word, "keyword");
        source = source.substr(word.length, source.length-word.length);
        keywordFound = true;
      }
    }

    if (!keywordFound) {
      text += source.charAt(0);
      source = source.substr(1, source.length-1);
    }
  }
  
  text = text.replace(/\n/g, "<br>");
  if (isource != undefined) {
    Editor.getDocument().body.innerHTML = text;
  }
  return text;
}


// Show execution output in a popup window
Editor_showOutput = Editor.showOutput = function(text)
{
  text = (new String(text)).encodeEntities();
  var win = window.open("", "output", "width=360,height=480,toolbar=0,resizable=0");
  win.document.write("<html><head><title>Execution Output</title><body><pre>" + text);
  win.document.close();
  win.focus();
  if ((current_problem != undefined) && confirm("Is the output of the code execution correct?")) {
	win.close();
    markProblemAsLearned();
    updateProblemsBox();
    updateTopicsBox();
    updateHistoryTab();
    openTab("solution");
  }
}

