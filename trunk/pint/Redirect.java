import java.io.IOException;
import java.io.OutputStream;

public class Redirect extends OutputStream {

	public String text;
	public String aString;
	
	public Redirect () {
		
        super();
    }
	

	public void write(int b ) throws IOException {
		text = String.valueOf((char)b);
		//aString = new String(b);
		
		
	}
	public void write(byte b[], int off, int len) throws IOException {
         aString = new String(b , off , len);
        
        
	}
	
	public String getText() {
		
		return aString;
		
	}

}