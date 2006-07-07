
import java.applet.*;
import java.io.*;
//import org.python.core.*;
import org.python.util.*;
//import java.awt.*;

//import org.python.core.*; 

public class Principal extends Applet
{
	//private Button botao = new Button("Executar");
	//TextField inputText = new TextField("", 30);
	//TextArea outputText = new TextArea(20, 20);

	//private PythonInterpreter interp;
	private InteractiveInterpreter iinterp;
	private Redirect r;
	private PrintStream out;
	//PyStringMap locals ;

	private volatile String code = null;
	private volatile boolean executed;

	public void setCode(String code)
	{
		this.code = code;
		executed = false;
	}
	
	public String getOutput()
	{
		while (!executed);
		String output = r.getText();
		r.clearText();
		//outputText.append("\n++ " + output);
		executed = false;
		return output;
	}

	public void init()
	{
		iinterp  = new InteractiveInterpreter();
	
		r = new Redirect();
		out = new PrintStream(r);
		iinterp.setErr(out);
		iinterp.setOut(out);
			
		Thread thread = new Thread() {
			public void run()  
			{
				while (true) {
					if (code != null) {
						
						iinterp.runsource(code+"\n");
						
						executed = true;					
						code = null;
					}
				}
			}
		};
		thread.start();
		
	}
	}



