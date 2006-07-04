import java.awt.*;
import java.applet.*;
import java.awt.event.*;
import java.io.*;
import org.python.util.PythonInterpreter;
import org.python.core.*; 

public class Principal 
extends Applet implements ActionListener {

	private Button botao = new Button("Executar");
	TextField inputText = new TextField("", 30);
	TextArea outputText = new TextArea(5, 50);
	PythonInterpreter interp = new PythonInterpreter();
	
	
	
	
	public void init(){
		PrintStream out = new PrintStream( new Redirect( outputText ) );
		
		add(botao);
		add(inputText);
		add(outputText);

		interp.setOut(out);
		botao.addActionListener(this);
		//System.setOut(out);
		//System.setErr(out);
		
	}
	
	public void paint(Graphics g) {
		// g.setColor(black);
		// g.drawLine(0,0,50,40);
		g.drawString("Jython Interactive Console", 5, 5);
	}
	
	public void actionPerformed(ActionEvent e){
		if (e.getSource() == botao){
			
			interpreta(inputText.getText().trim());
			
		}
		repaint();
	}
	
	public String captura() {
		return outputText.getText();
	}
	
	public void interpreta(String s){
		
		
		//interp.setOut()
		
		s= "a=5\nb=6\nif b>a:\t print b";
		interp.exec(s);
		
		// repaint
		repaint();

	}

	
	
}
