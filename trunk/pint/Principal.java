import java.applet.*;
import java.io.*;
import org.python.util.PythonInterpreter;

//import org.python.core.*; 

public class Principal 
extends Applet {

	//private Button botao = new Button("Executar");
	//TextField inputText = new TextField("", 30);
	// TextArea outputText = new TextArea(40, 50);
	
	PythonInterpreter interp;
	Redirect r;
	PrintStream out;
	
	
	
	public void init(){
		interp = new PythonInterpreter();
		r = new Redirect();
		out = new PrintStream(r);
		//add(outputText);
	
		interp.setOut(out);
		//System.out.println("OI"+interpreta("print 123"));
		//outputText.append(interpreta("print 123"));
		
	}


		
	public String interpreta(String s){
		
		
		interp.exec(s);
		return r.getText();
		// repaint
		//repaint();

	}

	
	
}
