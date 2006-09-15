-- Admin User
-- pass default: root
insert into User (name, nickname, password) values ("Administrator", "root", "63a9f0ea7bb98050796b649e85481845");

-- Topics
insert into Topic (topicName, dependTopic) values ("Variables", "");
insert into Topic (topicName, dependTopic) values ("Boolean", "Variables");
insert into Topic (topicName, dependTopic) values ("Cond_IF", "Variables");
insert into Topic (topicName, dependTopic) values ("Loops_WHILE", "Cond_IF Variables Boolean");
insert into Topic (topicName, dependTopic) values ("Loops_FOR", "Cond_IF Variables Boolean");
insert into Topic (topicName, dependTopic) values ("Lists", "Loops_FOR Loops_WHILE Cond_IF Variables Boolean");
insert into Topic (topicName, dependTopic) values ("Functions", "Loops_FOR Loops_WHILE Cond_IF Variables Boolean");
insert into Topic (topicName, dependTopic) values ("Dictionaries", "Lists Loops_FOR Loops_WHILE Cond_IF Variables Boolean");
insert into Topic (topicName, dependTopic) values ("Modules", "Cond_IF Loops_FOR Loops_WHILE Variables Boolean");
insert into Topic (topicName, dependTopic) values ("Input/Output", "Functions Cond_IF Loops_FOR Loops_WHILE Variables Boolean");

-- Problems

--insert into Problem (problemTitle, topic, question, solucion, dependTopic, dependProblem) values ("print", "Variables", "Write a program that prints your full name and your birthday as separate strings"


