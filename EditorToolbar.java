
import java.io.*;
import java.net.*;
import org.python.util.*;
import java.awt.*;
import javax.swing.*;
import netscape.javascript.*;

// Toolbar applet for the Editor module
@SuppressWarnings("serial")
public class EditorToolbar extends JApplet {
	private JButton newButton;
	private JButton loadButton;
	private JButton saveButton;		
	private JButton highlightButton;
	private JButton runButton;

	private InteractiveInterpreter it;
	private String filename = null;


	// Call an external javascript function by its name
	private Object callJavascriptFunction(String function, Object[] args) {
		return JSObject.getWindow(this).call(function, args);
	}


	// Add action handlers to the buttons
	private void initButtons() {
		newButton.addActionListener(new java.awt.event.ActionListener() {
			public void actionPerformed(java.awt.event.ActionEvent e) {
				// Clear the editarea
				callJavascriptFunction(getParameter("clearCodeFunction"), null);
			}
		});
		loadButton.addActionListener(new java.awt.event.ActionListener() {
			public void actionPerformed(java.awt.event.ActionEvent e) {
				// Load the contents of a file into the editarea 
				callJavascriptFunction(getParameter("setCodeFunction"), new Object[] { loadFile() });
			}
		});
		saveButton.addActionListener(new java.awt.event.ActionListener() {
			public void actionPerformed(java.awt.event.ActionEvent e) {
				// Save the contents of the editarea into a file
				saveFile((String)callJavascriptFunction(getParameter("getCodeFunction"), null), true);
			}
		});
		highlightButton.addActionListener(new java.awt.event.ActionListener() {
			public void actionPerformed(java.awt.event.ActionEvent e) {
				// Highlight the current code in the editarea
				callJavascriptFunction(getParameter("highlightCodeFunction"), null);
			}
		});
		runButton.addActionListener(new java.awt.event.ActionListener() {
			public void actionPerformed(java.awt.event.ActionEvent e) {
				// Execute currently loaded file
				executeFile();
			}
		});
	}


	// Create a new button using a specified name and image
	private JButton makeButton(String name, String imageFilename) {
		JButton b = null;
		try {
			b = new JButton(name, new ImageIcon(new URL(this.getCodeBase(), "images/" + imageFilename)));
		}
		catch (MalformedURLException e) {
			System.err.print(e.toString());
		}
		return b;
	}


	// Initialize applet
	public void init() {
		// Create the Jython interpreter
		it = new InteractiveInterpreter();

		// Setup the toolbar and its buttons
		Container content = getContentPane();
		content.setBackground(Color.decode("#71A2CA"));
		content.setLayout(new FlowLayout());
		content.add(newButton = makeButton("New", "document-new.png"));
		content.add(loadButton = makeButton("Open", "document-open.png"));
		content.add(saveButton = makeButton("Save", "document-save-as.png"));
		content.add(highlightButton = makeButton("Highlight", "document-properties.png"));
		content.add(runButton = makeButton("Run", "media-playback-start.png"));

		// Show toolbar and try to obtain current filename from javascript
		setVisible(true);
		initButtons();
		filename = (String)callJavascriptFunction(getParameter("getFilenameFunction"), null);
		System.out.println("EditorToolbar applet loaded.");
	}


	// Load the contents from a chosen file
	public String loadFile() {
		String cont = "";

		JFileChooser filedia = new JFileChooser();
		int returnVal = filedia.showOpenDialog(this);
		if (returnVal == JFileChooser.APPROVE_OPTION) {
			filename = filedia.getSelectedFile().getPath();
			try {
				if (filename != null) {
					BufferedReader in = new BufferedReader(new FileReader(filename));
					String line;
					while ((line = in.readLine()) != null) {
						cont += line + "\n";
					}
					callJavascriptFunction(getParameter("setFilenameFunction"), new Object[] { filename });
				}
			} catch (IOException iox) {
				System.err.println("I/O Error.");
				iox.printStackTrace();
			}
			catch (SecurityException e) {
				System.err.println("Security Error.");
				e.printStackTrace();
			}
		}
		return cont;
	}


	// Save some text into a chosen file
	public boolean saveFile(String fileContents, boolean showFileChooser) {
		boolean success = true;

		if (showFileChooser) {
			JFileChooser filedia = new JFileChooser();
			int returnVal = filedia.showSaveDialog(this);
			if (returnVal == JFileChooser.APPROVE_OPTION) {
				filename = filedia.getSelectedFile().getPath();
			}
		}

		if (filename == null) {
			success = false;
		}
		else {
			try {
				PrintStream stream = new PrintStream(new FileOutputStream(filename));
				stream.print(fileContents);
				stream.close();
				callJavascriptFunction(getParameter("setFilenameFunction"), new Object[] { filename });
			}
			catch (IOException iox) {
				System.err.println("I/O Error.");
				iox.printStackTrace();
				success = false;
			}
			catch (SecurityException e) {
				System.err.println("Security Error.");
				e.printStackTrace();
				success = false;
			}
		}
		return success;
	}


	// Save current file and execute its code
	public void executeFile() {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		boolean saved = saveFile((String)callJavascriptFunction(getParameter("getCodeFunction"), null), (filename == null));

		if (filename != null) {
			it.setOut(os);
			it.setErr(os);
			it.execfile(filename);
			try {
				os.flush();
			}
			catch (IOException ioe) {
				System.err.println(ioe.toString());
			}
		}
		String output = os.toString();
		callJavascriptFunction(getParameter("showOutputFunction"), new Object[] { output });
	}
}

