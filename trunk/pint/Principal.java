
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
	static String filename=null;
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
	
public String Load() {

	j = new Frame();
	PrintStream p;
	
	String cont = null;	
	
	
	FileDialog filedia = new FileDialog(j, "Open..", FileDialog.LOAD);
	filedia.setFile("*.*");
	filedia.show();
	filename = filedia.getDirectory()+ "" + filedia.getFile();
	filedia.dispose();


	

		try {
			if (filename != null ){
			
			File f = new File(filename);
			FileInputStream fin = new FileInputStream (filename);
			DataInputStream in = 
                new DataInputStream(fin);
			
			while (in.available() !=0)
			{
             cont += in.readLine();                      
				
			}
						
			}

			
		}
		catch(IOException iox) {
			System.out.println("E: I/O error...");
			iox.printStackTrace();

		}
	
	return cont;
	
}
	

public void Save(String codepy) {
	
	j = new Frame();

	FileOutputStream out; // declare a file output object
    PrintStream p; // declare a print stream object
    
			FileDialog filedia = new FileDialog(j, "Save..", FileDialog.SAVE);
			filedia.setFile("*.*");
			filedia.show();
			
			filedia.dispose();
			
			try {
			
			
				out = new FileOutputStream(filedia.getDirectory()+ ""+ filedia.getFile());

                // Connect print stream to the output stream
                p = new PrintStream( out );
                p.println(codepy);
                p.close();
				
				
				
			  
			}
			
			
			catch(IOException iox) {
				System.out.println("E: I/O error...");
				iox.printStackTrace();
			}
			
			
		}
			
	
	}




