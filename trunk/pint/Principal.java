
import java.applet.*;
import java.io.*;
//import org.python.core.*;
import org.python.util.*;
import java.awt.*;
import javax.swing.*;
import netscape.javascript.*;
import javax.swing.JComponent;

//import org.python.core.*; 

@SuppressWarnings("serial")
public class Principal extends JApplet 
{
	//private Button botao = new Button("Executar");
	//TextField inputText = new TextField("", 30);
	//TextArea outputText = new TextArea(20, 20);
	
	private JButton newFile;
	private JButton loadFile;
	private JButton saveFile;
	private JButton highLight;
	private JButton runFile;

	InteractiveInterpreter it;
	Redirect r;
	PrintStream out; 
	
	
	Frame j;
	FileDialog d; 
	Thread thread;
	
	
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

	private void evalJavascript(String expression)
	{
		JSObject.getWindow(this).eval(expression);
	}

	private Object callJavascriptFunction(String function, Object[] args)
	{
		return JSObject.getWindow(this).call(function, args);
	}
	
	private void init_buttons() {
		loadFile.addActionListener(new java.awt.event.ActionListener() {
        	public void actionPerformed(java.awt.event.ActionEvent e) {
        		// load file
        		String texto = Load();
        		//evalJavascript("setEditorContent(\""+ texto + "\");");
        		callJavascriptFunction("setEditorContent", new Object[] {texto} );
        	}
		});
		saveFile.addActionListener(new java.awt.event.ActionListener() {
	        public void actionPerformed(java.awt.event.ActionEvent e) {
	        	System.out.println("...");
	        	String texto = (String)callJavascriptFunction("getEditorContent", null);
	        	System.out.println("texto: " + texto);
	        	Save(texto);
	        }
		});
		runFile.addActionListener(new java.awt.event.ActionListener() {
	        public void actionPerformed(java.awt.event.ActionEvent e) {
	        	// ---
	        }
		});
	}
	
	public void init() 
	{
		// Instanciar classes;
//		// Imagens para os botoes..
		ImageIcon newF = new ImageIcon("images/document-new.png");
		ImageIcon openF = new ImageIcon("images/document-open.png");
		ImageIcon SaveF = new ImageIcon("images/document-save-as.png");
		ImageIcon high = new ImageIcon("images/document-properties.png");
		ImageIcon runF = new ImageIcon("images/media-playback-start.png");
		
		//SWING
		newFile = new JButton("New", newF);
		loadFile = new JButton("Open", openF );
		saveFile = new JButton("Save", SaveF);
		highLight = new JButton("Highlight", high);
		runFile = new JButton("Run", runF);
		
		//ADICIONAR BUTOES
		Container content = getContentPane();
		content.setBackground(Color.decode("#A1C1DC"));
	    content.setLayout(new FlowLayout());
		
	    content.add(newFile);
	    content.add(loadFile);
	    content.add(saveFile);
	    content.add(highLight);
	    content.add(runFile);

	    setVisible(true);
	    
		
		// JYTHON
		it = new InteractiveInterpreter();
		r = new Redirect();
		out = new PrintStream(r);
		// redirect output's
		it.setOut(out);
		it.setErr(out);
		
		init_buttons();
		
		 thread = new Thread() {
			public void run()  
			{
				while (true) {
					if (code != null) {
						it.runsource(code+"\n");
						
						executed = true;				
						code = null;
					}
					
				}
			}
		};
		thread.start();
		
	
	}

public void execFile(String filename){
	
	it.execfile(filename);
	
}
	

public String Load() {

	j = new Frame();
	PrintStream p;
	
	String cont = "";	
	
	
	JFileChooser filedia = new JFileChooser();
	int returnVal = filedia.showOpenDialog(this);
	if(returnVal == JFileChooser.APPROVE_OPTION) {
	       
	  String filename = filedia.getSelectedFile().getPath();


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
	}
	return cont;
	
  
}


public void Save(String fileContents) {
	FileOutputStream out; // declare a file output object
    PrintStream p; // declare a print stream object
    
			JFileChooser filedia = new JFileChooser();
			
			int returnVal = filedia.showSaveDialog(this);
			if(returnVal == JFileChooser.APPROVE_OPTION) {
			
			try {
			
				String filename = filedia.getSelectedFile().getPath();
				out = new FileOutputStream(filename);

                // Connect print stream to the output stream
                p = new PrintStream( out );
                p.println(fileContents);
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
}




