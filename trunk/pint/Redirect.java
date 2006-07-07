
import java.io.*;

public class Redirect extends OutputStream
{
	public String aString;
	
	public Redirect () {
        super();
        this.clearText();
    }

	public void write(int b) throws IOException
	{
		aString += String.valueOf((char)b);
	}

	public void write(byte b[], int off, int len) throws IOException
	{
         aString += new String(b , off , len);
	}

	public void clearText()
	{
		aString = "";
	}
	

	public String getText()
	{
		return aString;
	}
}
