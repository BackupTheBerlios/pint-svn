
import java.applet.*;
import java.io.*;
//import org.python.core.*;
import org.python.util.*;
import java.awt.*;
import java.awt.FileDialog;



//import org.python.core.*; 

public class Principal extends Applet
{
	//private Button botao = new Button("Executar");
	//TextField inputText = new TextField("", 30);
	//TextArea outputText = new TextArea(20, 20);

	private PythonInterpreter interp;
	private InteractiveInterpreter iinterp;
	private Redirect r;
	private PrintStream out;
	
	Frame j;
	FileDialog d; 
	Thread thread;
	Thread Opent;
	Thread Savet;
	//PyStringMap locals ;
//	Create a file chooser

	
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
			
		 thread = new Thread() {
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
	
public void Load() {

	Opent = new Thread() {
		public void run() {
	
	j = new Frame();
	FileDialog filedia = new FileDialog(j, "Open..", FileDialog.SAVE);
	filedia.setFile("*.*");
	filedia.show();
	String filename = filedia.getFile();
	if (filename != null) {
	  
	}
	filedia.dispose();
}
	}; Opent.start();
}

public void Save(String codepy) {
	final String code_all;
	code_all = codepy;
	Savet = new Thread() {
		
		public void run () {
			
			FileDialog filedia = new FileDialog(new Frame(), "Save..", FileDialog.SAVE);
			filedia.setFile("*.*");
			filedia.show();
			String filename = filedia.getFile();
			
			try {
			
			
			
			if (filename != null) {
				File outputFile = new File(filename);
				FileWriter out = new FileWriter(outputFile);
				out.write(code_all);
				
			  
			}
			}
			
			catch(IOException iox) {
				System.out.println("E: I/O error...");
				iox.printStackTrace();
			}
			
			filedia.dispose();
		}
			
			}; Savet.start();
			
		}
	
	}




