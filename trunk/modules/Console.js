

function Console()
{
  var histList = [""], histPos = 0, _scope = {};
  var _in, _out, tooManyMatches = null, lastError = null;
  console_init();


  // Initialize Console module
  function console_init()
  {
    var console = document.getElementById("console");
    var code = "<p id=\"output\"></p><p id=\"commandline\"><span id=\"prompt\">$</span><textarea id=\"input\" wrap=\"off\" rows=\"1\"></textarea></p>";

    console.innerHTML = code;
    console.onmouseover = keepFocusInTextbox;
    console.appendChild(createAppletElement("ConsoleService"));

    _in = document.getElementById("input");
    _out = document.getElementById("output");
    _in.onkeydown = inputKeydown;
    recalculateInputHeight();
  }


  // Activate and give focus to the command line
  function refocus()
  {
    _in.style.display = "block";
    _in.blur();
    _in.focus();
  }


  // Keep focus on the command line textbox when needed
  function keepFocusInTextbox(e)
  {
    var g = (document.all ? window.event.srcElement : e.target);

    while (!g.tagName) g = g.parentNode;
    var t = g.tagName.toUpperCase();
    if (t == "A" || t == "INPUT") return;

    if (window.getSelection) {
      if (String(window.getSelection())) return;
    }
    else if (document.getSelection) {
      if (document.getSelection()) return;
    }
    else {
      if (document.selection.createRange().text) return;
    }

    refocus();
  }


  // Handle special keys
  function inputKeydown(e)
  {
    function caretInFirstLine(textbox) {
      if (textbox.selectionStart == undefined) return true;
      var firstLineBreak = textbox.value.indexOf("\n");
      return ((firstLineBreak == -1) || (textbox.selectionStart <= firstLineBreak));
    };

    function caretInLastLine(textbox) {
      if (textbox.selectionEnd == undefined) return true;
      var lastLineBreak = textbox.value.lastIndexOf("\n");
      return (textbox.selectionEnd > lastLineBreak);
    };

    var K_ENTER = 13, K_UP = 38, K_DOWN = 40, K_TAB = 9;

    if (e.shiftKey && e.keyCode == K_ENTER) {
      // don't do anything
    }
    else if (e.keyCode == K_ENTER) {
      try { execute(); } catch(er) { alert(er); };
      setTimeout(function() { _in.value = ""; }, 0);
    }
    else if (e.keyCode == K_UP) {
      if (e.ctrlKey || caretInFirstLine(_in)) hist(true);
    }
    else if (e.keyCode == K_DOWN) {
      if (e.ctrlKey || caretInLastLine(_in)) hist(false);
    }
    else if (e.keyCode == K_TAB) {
      tabcomplete();
      setTimeout(function() { refocus(); }, 0);
    }
    else { }

    setTimeout(recalculateInputHeight, 0);
  }


  // Resize command line textbox to fit its content
  function recalculateInputHeight()
  {
    var rows = _in.value.split(/\n/).length + 1 + (window.opera ? 1 : 0);
    if (_in.rows != rows) _in.rows = rows;
  }


  // Print a simple message in the console
  function println(s, type)
  {
    var newdiv = document.createElement("p");

    if(s = String(s))
    {
      newdiv.appendChild(document.createTextNode(s));
      newdiv.className = type;
      _out.appendChild(newdiv);
    }
    return newdiv;
  }


  // Print message without line break ending
  function printWithRunin(h, s, type)
  {
    var div = println(s, type);
    var head = document.createElement("strong");
    head.appendChild(document.createTextNode(h + ": "));
    div.insertBefore(head, div.firstChild);
  }


  // Handle requests of command history entries
  function hist(up)
  {
    var L = histList.length;
    if (L == 1) return;

    if (up) {
      if (histPos == L-1) {
        histList[histPos] = _in.value;
      }
      if (histPos > 0) {
        histPos--;
        setTimeout(
          function() {
            _in.value = ""; 
            _in.value = histList[histPos];
            var caretPos = _in.value.length;
            if (_in.setSelectionRange) _in.setSelectionRange(caretPos, caretPos);
          }, 0
        );
      }
    }
    else {
      if (histPos < L-1) {
        histPos++;
        _in.value = histList[histPos];
      }
      else if (histPos == L-1) {
        if (_in.value) {
          histList[histPos] = _in.value;
          ++histPos;
          _in.value = "";
        }
      }
    }
  }


  // Try to complete current command line text
  function tabcomplete()
  {
    var words = {
      ".": special_words["python_keywords"],
      "<type 'str'>\n": special_words["string_methods"]
    };

    function findbeginning(s, from, stopAtDot)
    {
      function equalButNotEscaped(s,i,q)
      {
        if(s.charAt(i) != q) return false;
        if(i == 0) return true;
        if(s.charAt(i-1) == '\\') return false;
        return true;
      }

      var nparens = 0;
      var i;
      for(i=from; i>=0; i--) {
        if(s.charAt(i) == ' ') break;

        if(stopAtDot && s.charAt(i) == '.') break;

        if(s.charAt(i) == ')') nparens++;
        else if(s.charAt(i) == '(') nparens--;

        if(nparens < 0) break;

        if(s.charAt(i) == '\'' || s.charAt(i) == '\"') {
          var quot = s.charAt(i);
          i--;
          while(i >= 0 && !equalButNotEscaped(s,i,quot)) {
            i--;
          }
        }
      }
      return i;
    }

    function getcaretpos(inp)
    {
      if(inp.selectionEnd != null) return inp.selectionEnd;
 
      if(inp.createTextRange)
      {
        var docrange = window.Shell.document.selection.createRange();
        var inprange = inp.createTextRange();
        if (inprange.setEndPoint) {
          inprange.setEndPoint("EndToStart", docrange);
          return inprange.text.length;
        }
      }

      return inp.value.length;
    }

    function setselectionto(inp,pos)
    {
      if(inp.selectionStart) {
        inp.selectionStart = inp.selectionEnd = pos;
      }
      else if(inp.createTextRange) {
        var docrange = window.Shell.document.selection.createRange();
        var inprange = inp.createTextRange();
        inprange.move("character",pos);
        inprange.select();
      }
    }

    var caret = getcaretpos(_in);
    if(caret) {
      var dotpos, spacepos, complete, obj;
      dotpos = findbeginning(_in.value, caret-1, true);
      if(dotpos == -1 || _in.value.charAt(dotpos) != ".") {
        dotpos = caret;
      }

      spacepos = findbeginning(_in.value, dotpos-1, false);
      if(spacepos == dotpos || spacepos+1 == dotpos || dotpos == caret) {
        obj = ".";
      }
      else {
        var objname = _in.value.substr(spacepos+1,dotpos-(spacepos+1));
        obj = objname;
      }
      if (obj != ".") {
        obj = document.ConsoleService.executeCode("type(" + obj + ")");
      }

      if(dotpos == caret) {
        if(spacepos+1 == dotpos || spacepos == dotpos) return;
        complete = _in.value.substr(spacepos+1,dotpos-(spacepos+1));
      }
      else {
        complete = _in.value.substr(dotpos+1,caret-(dotpos+1));
      }
      var matches = [];
      var bestmatch = null;
      for(var i in words[obj]) {
        var a = words[obj][i];
        if(a.substr(0,complete.length) == complete) {
          matches.push(a);
          if(bestmatch == null) {
            bestmatch = a;
          }
          else {
            function min(a,b){ return ((a<b)?a:b); }
            var i;
            for(i=0; i< min(bestmatch.length, a.length); i++) {
              if(bestmatch.charAt(i) != a.charAt(i)) break;
            }
            bestmatch = bestmatch.substr(0,i);
          }
        }
      }
      bestmatch = (bestmatch || "");
      var objAndComplete = (objname || obj) + "." + bestmatch;
      if(matches.length > 1 && (tooManyMatches == objAndComplete || matches.length <= 10)) {
        printWithRunin("Matches: ", matches.join(', '), "tabcomplete");
        tooManyMatches = null;
      }
      else if(matches.length > 10) {
        println(matches.length + " matches. Press tab again to see them all", "tabcomplete");
        tooManyMatches = objAndComplete;
      }
      else {
        tooManyMatches = null;
      }
      if(bestmatch != "") {
        var sstart;
        if(dotpos == caret) {
          sstart = spacepos+1;
        }
        else {
          sstart = dotpos+1;
        }
        _in.value = _in.value.substr(0, sstart) + bestmatch + _in.value.substr(caret);
        setselectionto(_in,caret + (bestmatch.length - complete.length));
      }
    }
  }


  // Print a question message
  function printQuestion(q)
  {
    var t = document.getElementById("prompt").innerHTML + " " + q;
    println(t, "input");
  }


  // Print a answer message
  function printAnswer(a)
  {
    if (a !== undefined) {
      println(a, "normalOutput");
    }
  }


  // Print a error message
  function printError(er)
  { 
    var lineNumberString;

    lastError = er;
    if (er.name) {
      lineNumberString = (er.lineNumber != undefined) ? (" on line " + er.lineNumber + ": ") : ": ";
      println(er.name + lineNumberString + er.message, "error");
    }
    else {
      println(er, "error");
    }
  }


  // Execute current command line
  function execute(s)
  {
    var question = _in.value = (s ? s : _in.value);
    if (question == "") return;

    histList[histList.length-1] = question;
    histList[histList.length] = "";
    histPos = histList.length - 1;

    _in.value = "";
    recalculateInputHeight();
    printQuestion(question);

    var output = new String(document.ConsoleService.executeCode(question));
    if (output.contains("Traceback (innermost last):")) {
      println(output, "error");
    }
    else {
      printAnswer(output);
    }
  }
}

