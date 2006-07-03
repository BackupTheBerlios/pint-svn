import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class Principal 
extends Applet implements ActionListener {

	private Button botao = new Button("Mudar");
	String zenice = "Kules Programador";
	public void init(){
		add(botao);
		botao.addActionListener(this);
	}
	
	public void paint(Graphics g) {
		//g.setColor(black);
		//g.drawLine(0,0,50,40);
		g.drawString(zenice, 50, 50);
	}
	
	public void actionPerformed(ActionEvent e){
		if (e.getSource() == botao){
			zenice = "Tripeiro malandro";
			
		}
		repaint();
	}
	
	public void changeString(String s){
		zenice = s;
		repaint();
				
	}
}
