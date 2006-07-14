
import java.applet.*;
import java.io.*;
import java.security.PrivilegedActionException;
//import org.python.core.*;
import org.python.util.*;
import java.awt.*;


//import org.python.core.*; 

@SuppressWarnings("serial")
public class Principal extends Applet
{
	//private Button botao = new Button("Executar");
	//TextField inputText = new TextField("", 30);
	//TextArea outputText = new TextArea(20, 20);
	static String filename=null;
	
	InteractiveInterpreter iinterp = new InteractiveInterpreter();
	PythonInterpreter pint = new PythonInterpreter();
	Redirect r = new Redirect();
	PrintStream out = new PrintStream(r);
	
	
	Frame j;
	FileDialog d; 
	Thread thread;
	
	
	private volatile String code = null;
	private volatile boolean executed;
	private volatile boolean fileNeedsExecute;

	
	public String getFilename(){
		
		return filename;
		
	}
	
	public void executeFile()
	{
		fileNeedsExecute = true;
	}
	
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
					else if(fileNeedsExecute) {
						pint.execfile(filename);
						fileNeedsExecute = false;
						executed = true;
						
						
					}
				}
			}
		};
		thread.start();
		
	
	}

public void execFile(String filename){
	pint.execfile(filename);
	
}
	
/*public void execCode(String code) {
	
	
	iinterp.setErr(out);
	iinterp.setOut(out);
	
	try {
	
	if (code != null) {
		Thread.sleep(10000);
		iinterp.runsource(code+"\n");
	}
	else 
		System.out.println("E: Cannot execute NULL code!");

	}
	
	
	catch ( SecurityException e) {
		  System.out.println("E: Security Error");
		  e.printStackTrace();
	        } 
	catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
}*/
	
	
public String Load() {

	j = new Frame();
	PrintStream p;
	
	String cont = "";	
	
	
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

		catch (SecurityException e) {
			  System.out.println("E: Security Error");
			  e.printStackTrace();
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
			filename = filedia.getDirectory()+ "" + filedia.getFile();
			filedia.dispose();
			
			try {
			
			
				out = new FileOutputStream(filename);

                // Connect print stream to the output stream
                p = new PrintStream( out );
                p.println(codepy);
                p.close();
				
				
				
			  
			}
			
			
			catch(IOException iox) {
				System.out.println("E: I/O error...");
				iox.printStackTrace();
			}
			
		
			catch (SecurityException e) {
				  System.out.println("E: Security Error");
				  e.printStackTrace();
				  
			        }
			
		}
			
	
	}




