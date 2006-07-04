import java.io.IOException;
import java.io.OutputStream;
import java.awt.*;
import java.applet.*;

public class Redirect extends OutputStream {

	private TextArea textControl;
	
	public Redirect (TextArea control) {
        textControl = control;
    }
	
public Redirect() {super();}


public void write( int b ) throws IOException {
	
    textControl.append(String.valueOf((char)b));
}

}