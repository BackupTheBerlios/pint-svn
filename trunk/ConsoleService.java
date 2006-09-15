
import java.applet.*;
import java.io.*;
import org.python.util.*;

// Applet providing a code execution service to the Console module
@SuppressWarnings("serial")
public class ConsoleService extends Applet {
	private InteractiveInterpreter it;
	private volatile String code = null;
	private volatile Boolean executed = false;
	private volatile Thread thread;
	private volatile String output = "";


	// Execute a code string returning the output of that execution
	public String executeCode(String code) {
		// Chose the code and ask its execution
		this.code = code;
		synchronized (thread) {
			thread.notifyAll();
		}

		// Wait for thread execution and get its result
		while (!executed); 
		executed = false;
		return output;
	}


	// Initialize applet
	public void init() {
		it = new InteractiveInterpreter();

		// Create execution thread
		thread = new Thread() {
			public void run() {
				synchronized (thread) {
					while (true) {
						try {
							// Wait for a execution request
							thread.wait();

							// Redirect output streams to byte arrays
							ByteArrayOutputStream os = new ByteArrayOutputStream();
							it.setOut(os);
							it.setErr(os);

							// run current code string
							it.runsource(code + "\n");
							try {
								os.flush();
							}
							catch (IOException ioe) {
								System.err.println(ioe.toString());
							}

							// save execution output
							output = os.toString();
							executed = true;
						}
						catch (InterruptedException e) {
							System.err.println(e.toString());
						}
					}
				}
			}
		};
		thread.start();
		System.out.println("ConsoleService applet loaded.");
	}
}

