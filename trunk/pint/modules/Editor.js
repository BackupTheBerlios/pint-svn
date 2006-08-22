
function Editor()
{
  editor_init();

  function editor_init()
  {
    var params = {
      clearCodeFunction: "Editor_clearText",
      getCodeFunction: "Editor_getText",
      setCodeFunction: "Editor_setText",
      highlightCodeFunction: "Editor_highlight"
    }
    var toolbar = createAppletElement("EditorToolbar", params, 496, 36);
    toolbar.style.display = "block";

    var editarea = document.createElement("iframe");
    editarea.id = "editarea";

    var editor = document.getElementById("editor");
    editor.parentNode.insertBefore(toolbar, editor);
    editor.appendChild(editarea);
    editor.onmouseover = function() { document.getElementsByTagName("textarea")[0].style.display = "none"; }
    removeToolbarWhenHidden();

    doc = Editor.getDocument();
    doc.write("<html><header><link rel=\"stylesheet\" type=\"text/css\" href=\"styles/editor.css\"></header><body id=\"editor\"><br>");
    doc.designMode = "on";
    doc.close();
  }

  function removeToolbarWhenHidden()
  {
    var editor = document.getElementById("editor");
    var toolbar = document.EditorToolbar;

    toolbar.style.display = ((editor.className.indexOf("active") < 0) ? "none" : "block");
    setTimeout(function() { removeToolbarWhenHidden(); }, 50);
  }

  function autoupdate_highlight()
  {
    var sel = (window.getSelection ? window.getSelection() : (this.getSelection ? this.getSelection() : this.selection));

    if (document.all) {
      var range = sel.createRange();
      var position = { left: range.offsetLeft, top: range.offsetTop };
    }
    else {
      var range = sel.getRangeAt(0).cloneRange();
    }

    editor_highlight();

    if (document.all) {
      range.moveToPoint(position.left, position.top);
      range.select();
    }
    else {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function getEditorSelectedText()
  {
    var doc = Editor.getDocument();
    var text = "";

    if (doc.getSelection) {
      text = doc.getSelection();
    }
    else if (doc.selection) {
      text = doc.selection.createRange().text;
    }
    else if (window.getSelection) {
      text = window.getSelection();
    }
    return text;
  }
}

Editor.getDocument = function()
{
  return (!document.all ? document.getElementById("editarea").contentDocument : frames["editarea"].document);
}

Editor_getText = Editor.getText = function()
{
  var doc = Editor.getDocument();
  doc.body.innerHTML = doc.body.innerHTML.replace(/<br>/g, "<br>\n");
  var text = (!document.all ? doc.body.textContent : doc.body.innerText) + "\n";
  return text;
}

Editor_setText = Editor.setText = function(text)
{
  var doc = Editor.getDocument();
  doc.body.innerHTML = text;
  doc.body.innerHTML = doc.body.innerHTML.replace(/\n/g, "<br>\n");
}

Editor_clearText = Editor.clearText = function()
{
  Editor.setText("");
}

Editor_highlight = Editor.highlight = function()
{
    alert("Editor.highlight");
    function compareByLength(a, b) { return (b.length - a.length); }
    function span(text, sclass) { return ("<span class=\"" + sclass + "\">" + text + "</span>"); }

    var source = Editor.getText();
    var keywords = special_words["python_keywords"].sort(compareByLength);
    var text = "";

    while (source != "") {
      if (source.charAt(0) == '\"') {
        var j;
        for (j = 1; (source.charAt(j) != '\"') || (source.charAt(j-1) == "\\"); j++);
        var quotedString = source.substr(0, j+1);
        text += span(quotedString, "quoted");
        source = source.substr(j+1, source.length-j);
        continue;
      }

      if (source.charAt(0) == '#') {
        var j;
        for (j = 1; (source.charAt(j) != '\n'); j++);
        var commentString = source.substr(0, j+1);
        text += span(commentString, "comment");
        source = source.substr(j+1, source.length-j);
        continue;
      }

      if (source.charAt(0).match(/\d/)) {
        var j;
        for (j = 1; source.charAt(j).match(/\d/); j++);
        var numberString = source.substr(0, j);
        text += span(numberString, "number");
        source = source.substr(j, source.length-j);
        continue;
      }

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
    Editor.setText(text);
}

