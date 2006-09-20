import pintdb, md5
from mod_python import Session
from mod_python import apache, util

def auth(req, nick, password):

	try:	
		x=pintdb.Users()
		passD = x.showPassbyNick(nick)
		pmd5 = md5.new(password).hexdigest() # digest of inputed password
 	
		if nick == nick and pmd5 == passD:
		
			s = Session.Session(req)
			s["username"] = nick
			s.save()
		
			if nick == "root": 
				util.redirect(req, "../users.html")
		
			else:
				util.redirect(req, "../../index.html")
	
		else:
		
			util.redirect(req, "../../index.html?login=invalid")	
	except:
		return "Error: Authentication Database Error.."
		
		
def logout(req):
		
	s = Session.Session(req)
	s.invalidate()
	s.save()
	util.redirect(req, "../../index.html")
	
