import pintdb, md5
from mod_python import Session
from mod_python import apache, util

x=pintdb.Users()


def auth(req, nick, password):
	
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
		
def logout(req):
		
	s = Session.Session(req)
	s.invalidate()
	s.save()
	util.redirect(req, "../../index.html")
	
