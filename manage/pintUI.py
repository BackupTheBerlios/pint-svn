import pintdb, os
from mod_python import Session
from mod_python import apache, util

# lets go..all classes ;)

print "BLAH",os.getcwd()
x=pintdb.Users()
p=pintdb.Problems()
t=pintdb.Topic()
s=pintdb.solvedProblems()
lt=pintdb.learnedTopic()
exa=pintdb.Examples()


def getTopics(req):
	session = Session.Session(req)

	try:
		all_t = t.showAllTopics()
		for i in all_t:
			if session.has_key("username") and lt.isLearnedTopic(session["username"], i[0]):
				req.write("<span class=\"cutted\">" + i[0] + "</span><br>")
			else:
				req.write("<a id=\"topic_" + i[0] + "\" href=\"javascript:setTopic('" + i[0] + "')\">" + i[0] + "</a><br>")
	except:
		req.write("Error showing Topics")


def getProblemsByTopic(req, topic):
	session = Session.Session(req)

	try:
		all_p = p.showProblemsbyTopic(topic)
		for i in all_p:
			if session.has_key("username") and s.isLearnedProblem(session["username"], i[0]):
				req.write("<span class=\"cutted\">" + i[0] + "</span><br>")
			else:
				req.write("<a id=\"problem_" + i[0] + "\" href=\"javascript:setProblem('" + i[0] + "')\">" + i[0] + "</a><br>")
	except:
		req.write("Error showing problems!")


def getExamplesByTopic(req, topic):
	try:
		all_ex = exa.showExamplesByTopic(topic)
		for i in all_ex:
			req.write(i)
	except:
		req.write("Error showing examples!")


def getProblemText(req, name):
	try:
		req.write(p.getProblem(name))
	except:
		req.write("Error showing problem!")


def getProblemSolution(req, name):
	try:
		req.write(p.getSolution(name))
	except:
		req.write("Error showing problem solution!")


def getNickname(req):
	session = Session.Session(req)
	nickname = "<none>"
	if session.has_key("username"):
		nickname = session["username"]
	req.write(nickname)


def getRealName(req):
	session = Session.Session(req)
	realname = "<none>"
	if session.has_key("username"):
		realname = x.showRealNameByNick(session["username"])
	req.write(realname)


def markProblemAsLearned(req, problem):
	topic = p.getTopic(problem)
	session = Session.Session(req)

	if session.has_key("username"):
		nickname = session["username"]
		if s.addSolvedProb(nickname, problem) != 0:
			req.write("Error while marking problem as learned!");
		else:
			req.write("OK")
			if lt.allProblemsLearned(nickname, topic):
				lt.insertLearnedTopic(nickname, topic)


def getUserHistory(req):
	session = Session.Session(req)
	if session.has_key("username") and x.nickExists(session["username"]) == 0:
		nick = session["username"]
		ssp = s.showSolvedProb(nick)
		slp = lt.showLearnedTopic(nick)

		req.write("<h4> Solved Problems </h4> ")
		req.write("<ul>")
		for i in ssp:
			req.write("<li><a id=\"problem_" + i[1] + "\" href=\"javascript:setProblem('" + i[1] + "')\">" + i[1] + "</a></li>")
		req.write("</ul>")

		req.write("<h4> Learned Topics </h4> ")
		req.write("<ul>")
		for i in slp:
			req.write("<li><a id=\"topic_" + i[1] + "\" href=\"javascript:setTopic('" + i[1] + "')\">" + i[1] + "</a></li>")
		req.write("</ul>")
	else:
		req.write("Error: User does not exist!")


