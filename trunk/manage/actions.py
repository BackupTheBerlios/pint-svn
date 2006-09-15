
import pintdb
from mod_python import Session
from mod_python import apache, util
import md5

x=pintdb.Users()
p=pintdb.Problems()
t=pintdb.Topic()
s=pintdb.solvedProblems()
lt=pintdb.learnedTopic()
exa=pintdb.Examples()

## USERS CLASS ###

def reqHTML(req):
	s = Session.Session(req)
	if s.has_key("username") and s["username"] == "root":
		req.content_type = "text/html"
  		req.send_http_header()	
		req.write("<link rel=\"stylesheet\" href=\"../styles.css\">")
	else:
		util.redirect(req, "../../index.html")


def addUserForm(req, username, nick, password):

	reqHTML(req)
	if x.insertUser(username, nick, password) == 0:
		
		req.write("<h2> Info: User added </h2> ")
		req.write("<br> <a href=\"../users.html\"> Back </a>")
		
	elif x.insertUser(username, nick, password) == 2:
		req.write("<h2> Info: User Information Error! Complete your information.. </h2> ")
		req.write("<br> <a href=\"../users.html\"> Back </a>")
	else:
		req.write("<h2> Error <h2> ")
		req.write("<br> <a href=\"../users.html\"> Back </a>")


def removeUserForm(req, nick):

	#let's check if user exists..
	u = x.showAllUser()
	reqHTML(req)

	if x.removeUser(nick) == 0:
		
		req.write("<h2> Info: User Removed <h2> ")
		req.write("<br> <a href=\"../users.html\"> Back </a>")

	elif x.removeUser(nick) == 2:
		req.write("<h2> Error: User does not exist! Can't be Removed! <h2> ")
		req.write("<br> <a href=\"../users.html\"> Back </a>")
	
	else:

		req.write("<h2> Error! <h2> ")
		req.write("<br> <a href=\"../users.html\"> Back </a>")


def showUsersForm(req):

	reqHTML(req)

	users = x.showAllUser()

	req.write ("<h2> System Users: </h2>\n")
	req.write("<ul>")
	for i in users:
		req.write( '<li> Name: %s   =>  Nickname: %s </li>' % (i[0], i[1]) )

	req.write("</ul>")

	req.write("<br> <a href=\"../users.html\"> Back </a>")
	#req.write("Name: ", all_users[0] ,"Username: ", all_users[1])
	


def setRootPassword(req, password):
	reqHTML(req)
	if x.changeRootPassword(password) == 0:
		req.write("<h2> Done. Password changed for root user <h2> ")
		req.write("<br> <a href=\"../admin.html\"> Back </a>")
	else:
		req.write("<h2> Error changing root password <h2> ")
		req.write("<br> <a href=\"../admin.html\"> Back </a>")
		
	


#### PROBLEM CLASS ####


def addProblem(req, prog_title, topic, question, solucion, topicdepends, problemdepends):
	reqHTML(req)

	if p.insertProblem(prog_title, topic, question, solucion, topicdepends, problemdepends) == 0:
		req.write("<h2> Info: Problem Added </h2> ")
		req.write("<br> <a href=\"../prob.html\"> Back </a>")

	elif p.insertProblem(prog_title, topic, question, solucion, topicdepends, problemdepends) == 2:
		req.write("<h2> Error: Topic may not exist! Add it first </h2> ")
		req.write("<br> <a href=\"../prob.html\"> Back </a>")

	else:
		req.write("<h2> Error </h2> ")
		req.write("<br> <a href=\"../prob.html\"> Back </a>")


def removeProblem(req, prog_title):

	reqHTML(req)
	
	if p.removeProblem(prog_title) == 0:
		req.write("<h2> Info: Problem Removed! </h2> ")
		req.write("<br> <a href=\"../prob.html\"> Back </a>")
		
	elif p.removeProblem(prog_title) == 2:
		req.write("<h2> Error: Problem does not exists?! </h2> ")
		req.write("<br> <a href=\"../prob.html\"> Back </a>")

	else:
		req.write("<h2> Error </h2> ")
		req.write("<br> <a href=\"../prob.html\"> Back </a>")


def showallProblemsForm(req):
	pr = p.showAllProblems()
	tr = t.showAllTopics()
	
	reqHTML(req)
	
	req.write ("<h2> Problems </h2>\n")
	req.write("<ul>")

	for i in pr:
		req.write( '<li> Problem Name: %s </li>' % i[0])
		
		req.write( '<br>* Topic Related: %s' % i[1])

		if i[4] != None:
			req.write( '<br>* Topic Dependencies : %s' % i[4])
		if i[5] != None:
			req.write( '<br>* Problem Dependencies : %s' % i[5])

	req.write("</ul>")

	req.write("<h2> Topics: </h2> \n")
	req.write("<ul>")
	for y in tr:
		req.write( '<li> %s </li>' % y[0])
		req.write('* Dependency: %s' % y[1])
	
	req.write("</ul>")
	req.write("<br> <a href=\"../prob.html\"> Back </a>")
	

	

### TOPIC CLASS ####

def addTopicForm(req, name, depTopic):

	reqHTML(req)
	if t.addTopic(name, depTopic) == 0:
		req.write("<h2> Info: Topic Added! </h2> ")
		req.write("<br> <a href=\"../topic.html\"> Back </a>")

	elif t.addTopic(name, depTopic) == 2:
		req.write("<h2> Error: Topic Exists! </h2> ")
		req.write("<br> <a href=\"../topic.html\"> Back </a>")
		
	else:
		req.write("<h2> Error </h2> ")
		req.write("<br> <a href=\"../topic.html\"> Back </a>")


### EXAMPLES ###

def addExample(req, topic, example):
	reqHTML(req)
	if exa.addExample(topic, example) == 0:
		req.write("<h2> Info: Examples Added! </h2> ")
		req.write("<br> <a href=\"../examples.html\"> Back </a>") 
	
	elif exa.addExample(topic, example) == 2:
		
		req.write("<h2> Error: Topic Exists?! </h2> ")
		req.write("<br> <a href=\"../examples.html\"> Back </a>")
	else:
		req.write("<h2> Error </h2> ")
		req.write("<br> <a href=\"../examples.html\"> Back </a>")

		
def ShowExamplesByTopic(req, topic):
	reqHTML(req)
	all_examples=exa.showExamplesByTopic(topic)
	req.write("<h2> Topic: " + topic + "</h2>")
	if all_examples != 1:
		req.write( '<li> Examples : %s </li>' % all_examples)


def showUserInfo(req, nick):
	reqHTML(req)
	
	ssp=s.showSolvedProb(nick)
	slp=lt.showLearnedTopic(nick)

	if x.nickExists(nick) == 0:
		req.write("<h2> User Learning System Information </h2> ")
		req.write("<br> Nickname: %s </br>" % nick)
		req.write("<br> <h2> Solved Problems </h2> ")
		req.write("<ul>")
		#solved problems
		for i in ssp:
			req.write( '<li> %s </li>' % i[1])
		req.write("</ul>")
	
		#learned topics
		req.write("<br> <h2> Learned Topics </h2> ")
		req.write("<ul>")

		for i in slp:
			req.write( '<li> %s </li>' % i[1])

		req.write("</ul>")
	else:
		req.write("<h2> Error: User does not exist! </h2> ")

	req.write("<br> <a href=\"../learning.html\"> Back </a>")


