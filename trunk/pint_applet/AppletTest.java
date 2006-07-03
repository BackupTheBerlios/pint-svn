import java.applet.*;
import java.awt.*;

public class AppletTest extends Applet
{
	   int width, height;
	   int N = 25;          // the number of colors created
	   Color[] spectrum;    // an array of elements, each of type Color
	   Color[] spectrum2;   // another array

	   public void init() {
	      width = getSize().width;
	      height = getSize().height;
	      setBackground( Color.black );

	      spectrum = new Color[ N ];
	      spectrum2 = new Color[ N ];

	      for ( int i = 1; i <= N; ++i ) {
	         spectrum[ i-1 ] = new Color( i/(float)N, i/(float)N, i/(float)N );
	         spectrum2[ i-1 ] = new Color( i/(float)N, (N-i)/(float)N, 0 );
	      }
	   }

	   public void paint( Graphics g ) {
	      int step = 90 / N;
	      for ( int i = 0; i < N; ++i ) {
	         g.setColor( spectrum[ i ] );
	         g.fillArc( 0, 0, 2*width, 2*height, 90+i*step, step+1 );

	         g.setColor( spectrum2[ i ] );
	         g.fillArc( width/3, height/3, 4*width/3, 4*height/3, 90+i*step, step+1 );
	      }
	   }	
}
