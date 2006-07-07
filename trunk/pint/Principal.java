
import java.applet.*;
import java.io.*;
import org.python.util.PythonInterpreter;
import java.awt.*;
import java.awt.event.*;
//import org.python.core.*; 

public class Principal extends Applet
{
	private Button botao = new Button("Executar");
	//TextField inputText = new TextField("", 30);
	TextArea outputText = new TextArea(20, 20);

	private PythonInterpreter interp;
	private Redirect r;
	private PrintStream out;

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
		outputText.append("\n++ " + output);
		executed = false;
		return output;
	}

	public void init()
	{
		interp = new PythonInterpreter();
		r = new Redirect();
		out = new PrintStream(r);
		interp.setOut(out);
		
		add(outputText);
		add(botao);
		botao.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent event) {
				code ="print \"fodasse!\"";
				getOutput();				
			}
		});
		

		Thread thread = new Thread() {
			public void run()
			{
				while (true) {
					if (code != null) {
						outputText.append("\n>> " + code);
						interp.exec(code);
						executed = true;
						code = null;
					}
				}
			}
		};
		thread.start();

		code ="for i in xrange(1,10):\n\tprint i";
		this.getOutput();
	}
	

	public String interpreta(String s)
	{
		interp.exec(s);
		return r.getText();
	}
}
