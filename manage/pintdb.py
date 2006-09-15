from pysqlite2 import dbapi2 as sqlite
import mod_python
import md5

bd = "/var/www/pint/pint8.db"
#bd = "/var/www/pint/manage/pint6.db"


class Users:
	
	def __init__(self):
		self.connect = sqlite.connect(bd, check_same_thread=False, isolation_level=None)		
		#self.connect = sqlite.connect(bd)
		self.cursor = self.connect.cursor()
		
		#self.cursor.execute("pragma temp_store_directory='/home/httpd/html/pint_mod'")
		#self.cursor.execute("pragma temp_store=file")


	def insertUser(self, username, nick, password):

		#try:
		
			# md5 stuff for password
			new_pass = md5.new(password).hexdigest()

			if username!="" and nick!="" and password!="":
				self.cursor.execute("insert into User (name, nickname, password) values (?, ?, ?)", (username, nick, new_pass))

				self.connect.commit()
			#self.connect.close()
			
				return 0


			else:
				return 2
		#except:
			#return 1


	def showAllUser(self):
		
		
		self.cursor.execute("select * from User")
		users = self.cursor.fetchall()
		return users;
		


	def nickExists(self, nick):
	
		self.cursor.execute("select * from User where nickname=:nick", locals())
		if self.cursor.fetchall() != []:
			return 0 #exists

		else:
			return 1
	

	def showPassbyNick(self, nick):
		if self.nickExists(nick) == 0:
			self.cursor.execute("select password from User where nickname=:nick", locals())
			return self.cursor.fetchone()[0]
		else:
			return 1
	

	def removeUser(self, nick):
		
		try:
			# verify if user exists
			self.cursor.execute("select * from User where nickname=:nick", locals())
			if self.cursor.fetchall() != []:
				
				self.cursor.execute("delete from User where nickname=:nick", locals() )
				self.cursor.execute("delete from learnedTopic where nickname=:nick", locals() )
				self.cursor.execute("delete from solvedProb where nickname=:nick", locals() )
				self.connect.commit()
					
				return 0

			else:
				#no user?
				return 2
		except:
			return 1
			
			
	def showRealNameByNick(self, nick):
		try:
			self.cursor.execute("select name from User where nickname=:nick", locals())
			return self.cursor.fetchone()[0]
			
		except:
			return "<none>"
	

	def changeRootPassword(self, new_pass):
		try:
			new_one=md5.new(new_pass).hexdigest()
			self.cursor.execute("update User set password=:new_one where nickname='root'", locals())
			return 0



		except:
			return 1
class Problems:
	
	def __init__(self):
		self.connect = sqlite.connect(bd, check_same_thread=False, isolation_level=None)
		self.cursor = self.connect.cursor()


	def insertProblem(self, prog_title, topic, question, solucion, topicdepends, problemdepends):
		try:

			self.cursor.execute("select * from Topic where topicName=:topic", locals())
			if self.cursor.fetchall() != []:
			
				self.cursor.execute("insert into Problem (problemTitle, topic, question, solucion, dependTopic, dependProblem) values (?, ?, ?, ?, ?, ?)", (prog_title, topic, question, solucion, topicdepends, problemdepends))
				self.connect.commit()
			
				return 0
			
			else:
				# topic not found
				return 2


		except:
			print "E: insertProblem()"
			return 1
			


	def showProblemsbyTopic(self, topicName):
		try:
			self.cursor.execute("select * from Problem where topic=:topicName", locals())
			return self.cursor.fetchall()
		
		except:
			return 1
	

	def removeProblem(self, prog_title):
		try:

			#lets check if problem exists..
			self.cursor.execute("select * from Problem where problemTitle=:prog_title", locals())
			if self.cursor.fetchall() != []:
			
				# remove from Problem and learnTopic tables..
				self.cursor.execute("delete from Problem where problemTitle=:prog_title", locals())
				self.cursor.execute("delete from learnedTopic where topicName=:prog_title", locals())
				self.connect.commit()

				return 0

			else:
				#problem not found?!
				return 2

		except:
			print "E: removeProblem()"
			return 1


	def getProblem(self, prob_title):
		try:
			self.cursor.execute("select question from Problem where problemTitle=:prob_title", locals())
			return self.cursor.fetchone()[0] 
		except:
			print "E: getProblem()"
			return 1


	def getSolution(self, prob_title):
		#try:
			self.cursor.execute("select solucion from Problem where problemTitle=:prob_title", locals())
			return self.cursor.fetchone()[0] 
		#except:
		#	pass


	def showAllProblems(self):
		self.cursor.execute("select * from Problem")
		return self.cursor.fetchall()


	def getTopic(self, problem):
		self.cursor.execute("select topic from Problem where problemTitle=:problem", locals())
		return self.cursor.fetchone()[0] 


class learnedTopic:
	
		def __init__(self):
			self.connect = sqlite.connect(bd, check_same_thread=False)
			self.cursor = self.connect.cursor()

		def insertLearnedTopic(self, nick, topic_title):
			try:
				self.cursor.execute("insert into learnedTopic (nickname, topicName) values (?, ?)", (nick, topic_title))
				self.connect.commit()
				return 0
			except:
				return 1

	
		def showLearnedTopic(self, nick):
			try:
				self.cursor.execute("select * from learnedTopic where nickname=:nick", locals())
				return self.cursor.fetchall()

			except:
				print "E: showLearnedTopic()"
				return 1


		def isLearnedTopic(self, nick, topic):
		
				self.cursor.execute("select * from learnedTopic where topicName=:topic and nickname=:nick", locals())

				if self.cursor.fetchall() != []:
					return True		
				else:
					return False
		
		# Check if all dependencies of topic are learned 
		def LearnedDependencies(self, nick, topic):
			t=Topic()
			all_dependencies=t.getTopicDependencies(topic)
			for i in all_dependencies:
				# i is a topic here
				if isLearnedTopic(nick, i) == True:
					return True # ok, all topics before learned
				elif isLearnedTopic(nick, i) == False:
					return False # Err, dependencies are missing..
		

		def allProblemsLearned(self, topic_name, nick):
			
			self.cursor.execute("select Problem.problemTitle from Problem, solvedProb where Problem.topic=:topic_name and solvedProb.nickname=:nick and not exists (select * from Problem, solvedProb where Problem.problemTitle=solvedProb.problemTitle)", locals())
			return self.cursor.fetchall() == []
			


class solvedProblems:
	
	def __init__(self):
		self.connect = sqlite.connect(bd, check_same_thread=False)
		self.cursor = self.connect.cursor()

	def addSolvedProb(self, nick, prob_title):
		try:
			
			#self.cursor.execute("select * from solvedProb where problemTitle=:prob_title", locals())
			#if self.cursor.fetchall() != []: 
			self.cursor.execute("insert into solvedProb (nickname, problemTitle) values (?, ?)", (nick, prob_title))
			self.connect.commit()
			return 0	
		except:
			pass

	def isLearnedProblem(self, nick, problem):
			
			self.cursor.execute("select * from solvedProb where problemTitle=:problem and nickname=:nick", locals())

			if self.cursor.fetchall() != []:
				return True		
			else:
				return False
		

# Show user solved Problems

	def showSolvedProb(self, nick):
		try:
			self.cursor.execute("select * from solvedProb where nickname=:nick", locals())
			return self.cursor.fetchall()

		except:
			print "E: showSolvedProb()"
			return 1




class Topic:

	def __init__(self):
		self.connect = sqlite.connect(bd, check_same_thread=False)
		self.cursor = self.connect.cursor()
	
	def addTopic(self, name, depTopic):

		try:
			#check if topic already exists..
			self.cursor.execute("select * from Topic where topicName=:name", locals())
			if self.cursor.fetchall() == []:
				self.cursor.execute("insert into Topic (topicName, dependTopic) values (?, ?)", (name, depTopic ))
				self.connect.commit()
				return 0

			else:
				#topic exists?!
				return 2

		except:
			print "E: addTopic()"
			return 1


	def showAllTopics(self):
		self.cursor.execute("select * from Topic")
		topic = self.cursor.fetchall()
		return topic;

	

	
	# check if topic exists..
	def topicExists(self, topic):
	
		self.cursor.execute("select * from Topic where TopicName=:topic", locals())
		if self.cursor.fetchall() != []:
			return 0 

		else:
			return 1

	
	# get all dependencies of a topic in a list
	def getTopicDependencies(self, topic):
		try:
			
			self.cursor.execute("select dependTopic from Topic where TopicName=:topic", locals())
			a=self.cursor.fetchone()[0]
			lista=a.split(" ")
			# return a list 	
				
			return lista
		except:
			return "Error getting Topic Dependencies"	

class Examples:
	
	
	def __init__(self):
		
		self.connect = sqlite.connect(bd, check_same_thread=False)
		self.cursor = self.connect.cursor()
	
	def addExample(self, topic_title, examples):
		#try:	
			top = Topic()
			if  top.topicExists(topic_title) == 0:
				#then if topic exists when can insert example into topic.
				self.cursor.execute("insert into Examples (topic, example) values (?, ?)", (topic_title, examples))
				self.connect.commit()
				return 0
			
			elif top.topicExists(topic_title) == 1:
				return 2
			
	def showExamplesByTopic(self, topic_title):
		top = Topic()
		if  top.topicExists(topic_title) == 0:
			self.cursor.execute("select example from Examples where topic=:topic_title", locals())
			return self.cursor.fetchone()[0]
		else:
			return 1
	






