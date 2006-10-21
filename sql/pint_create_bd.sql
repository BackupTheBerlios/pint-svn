CREATE TABLE Problem (
problemTitle text primary key,
topic text,
question text,
solucion text,
dependTopic text,
dependProblem text
);

CREATE TABLE Topic (
topicName text primary key,
dependTopic text
);

CREATE TABLE User (
name text,
nickname text primary key,
password text
);
CREATE TABLE learnedTopic (
nickname text,
topicName text 
);
CREATE TABLE solvedProb (
nickname text,
problemTitle text 
);
CREATE TABLE Examples(
topic text primary key,
example text
);
