SELECT name
FROM sys.databases;

CREATE DATABASE PlacementDB;
GO

USE PlacementDB;
GO


CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    StudentName VARCHAR(100),
    Branch VARCHAR(50),
    CGPA DECIMAL(3,2)
);

CREATE TABLE Companies (
    CompanyID INT PRIMARY KEY IDENTITY(1,1),
    CompanyName VARCHAR(100),
    Package DECIMAL(5,2)
);

CREATE TABLE Skills (
    SkillID INT PRIMARY KEY IDENTITY(1,1),
    SkillName VARCHAR(50)
);

CREATE TABLE StudentSkills (
    StudentID INT,
    SkillID INT,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (SkillID) REFERENCES Skills(SkillID)
);

CREATE TABLE Placements (
    PlacementID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT,
    CompanyID INT,
    Status VARCHAR(20),
    PlacementDate DATE,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID)
);
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;

SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;

SELECT * FROM INFORMATION_SCHEMA.TABLES;

SELECT DB_NAME() AS CurrentDatabase;

CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    StudentName VARCHAR(100),
    Branch VARCHAR(50),
    CGPA DECIMAL(3,2)
);
SELECT * FROM INFORMATION_SCHEMA.TABLES;

CREATE TABLE Companies (
    CompanyID INT PRIMARY KEY IDENTITY(1,1),
    CompanyName VARCHAR(100),
    Package DECIMAL(5,2)
);

SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;

CREATE TABLE Skills (
    SkillID INT PRIMARY KEY IDENTITY(1,1),
    SkillName VARCHAR(50)
);
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;

CREATE TABLE StudentSkills (
    StudentID INT,
    SkillID INT,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (SkillID) REFERENCES Skills(SkillID)
);
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;

CREATE TABLE Placements (
    PlacementID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT,
    CompanyID INT,
    Status VARCHAR(20),
    PlacementDate DATE,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID)
);
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;

INSERT INTO Companies (CompanyName, Package)
VALUES
('TCS',3.5),
('Infosys',4.0),
('Wipro',4.2),
('Accenture',5.0),
('Cognizant',4.5),
('Capgemini',4.8),
('HCL',4.0),
('IBM',6.5),
('Amazon',25.0),
('Google',30.0);
SELECT * FROM Companies;

INSERT INTO Students (StudentName, Branch, CGPA)
VALUES
('Pankaj','CSE',8.5),
('Rahul','IT',7.8),
('Aman','ECE',8.2),
('Neha','CSE',9.1),
('Priya','ME',7.5),
('Rohit','CSE',8.0),
('Karan','IT',7.9),
('Simran','ECE',8.7),
('Anjali','CSE',9.0),
('Vikas','ME',7.2),
('Nisha','CSE',8.3),
('Deepak','IT',7.7),
('Riya','ECE',8.4),
('Suresh','ME',7.1),
('Pooja','CSE',9.2),
('Mohit','IT',8.0),
('Sneha','ECE',8.6),
('Arjun','CSE',7.9),
('Kavita','ME',7.4),
('Yash','IT',8.1),
('Aditya','CSE',8.8),
('Meera','ECE',8.2),
('Harsh','IT',7.6),
('Divya','CSE',9.0),
('Nitin','ME',7.3),
('Aarti','ECE',8.5),
('Manish','IT',7.8),
('Payal','CSE',8.9),
('Gaurav','ME',7.5),
('Shreya','ECE',8.7),
('Rakesh','IT',7.9),
('Komal','CSE',8.6),
('Abhishek','ME',7.4),
('Sakshi','ECE',8.8),
('Vivek','IT',8.0),
('Muskan','CSE',9.1),
('Ankit','ME',7.2),
('Preeti','ECE',8.4),
('Hemant','IT',7.7),
('Jyoti','CSE',8.9),
('Lokesh','ME',7.3),
('Bhavna','ECE',8.5),
('Tarun','IT',8.1),
('Ritu','CSE',9.0),
('Chirag','ME',7.6),
('Pallavi','ECE',8.7),
('Kunal','IT',8.2),
('Monika','CSE',8.8),
('Sachin','ME',7.5),
('Tanya','ECE',8.9);
SELECT * FROM Students;
SELECT COUNT(*) AS TotalStudents
FROM Students;

INSERT INTO Skills (SkillName)
VALUES
('Java'),
('Python'),
('SQL'),
('C++'),
('Data Structures'),
('Machine Learning'),
('Web Development'),
('Cloud Computing'),
('Power BI'),
('Communication');
SELECT * FROM Skills;

SELECT MIN(SkillID) AS MinSkillID,
       MAX(SkillID) AS MaxSkillID,
       COUNT(*) AS TotalSkills
FROM Skills;

INSERT INTO StudentSkills (StudentID, SkillID)
VALUES
(1,1),(1,2),
(2,2),(2,3),
(3,3),(3,4),
(4,4),(4,5),
(5,5),(5,6),
(6,6),(6,7),
(7,7),(7,8),
(8,8),(8,9),
(9,9),(9,10),
(10,10),(10,1),

(11,1),(11,3),
(12,2),(12,4),
(13,3),(13,5),
(14,4),(14,6),
(15,5),(15,7),
(16,6),(16,8),
(17,7),(17,9),
(18,8),(18,10),
(19,9),(19,1),
(20,10),(20,2),

(21,1),(21,4),
(22,2),(22,5),
(23,3),(23,6),
(24,4),(24,7),
(25,5),(25,8),
(26,6),(26,9),
(27,7),(27,10),
(28,8),(28,1),
(29,9),(29,2),
(30,10),(30,3),

(31,1),(31,5),
(32,2),(32,6),
(33,3),(33,7),
(34,4),(34,8),
(35,5),(35,9),
(36,6),(36,10),
(37,7),(37,1),
(38,8),(38,2),
(39,9),(39,3),
(40,10),(40,4),

(41,1),(41,6),
(42,2),(42,7),
(43,3),(43,8),
(44,4),(44,9),
(45,5),(45,10),
(46,6),(46,1),
(47,7),(47,2),
(48,8),(48,3),
(49,9),(49,4),
(50,10),(50,5);
SELECT COUNT(*) AS TotalStudentSkills
FROM StudentSkills;
SELECT * FROM StudentSkills;

SELECT *
FROM Students
WHERE StudentID = 1;

SELECT *
FROM Skills
WHERE SkillID IN (1,2);

INSERT INTO Placements
(StudentID, CompanyID, Status, PlacementDate)
VALUES
(1,1,'Placed','2025-01-10'),
(2,2,'Placed','2025-01-11'),
(3,3,'Placed','2025-01-12'),
(4,4,'Placed','2025-01-13'),
(5,5,'Placed','2025-01-14'),
(6,6,'Placed','2025-01-15'),
(7,7,'Placed','2025-01-16'),
(8,8,'Placed','2025-01-17'),
(9,9,'Placed','2025-01-18'),
(10,10,'Placed','2025-01-19'),
(11,1,'Placed','2025-01-20'),
(12,2,'Placed','2025-01-21'),
(13,3,'Placed','2025-01-22'),
(14,4,'Placed','2025-01-23'),
(15,5,'Placed','2025-01-24'),
(16,6,'Placed','2025-01-25'),
(17,7,'Placed','2025-01-26'),
(18,8,'Placed','2025-01-27'),
(19,9,'Placed','2025-01-28'),
(20,10,'Placed','2025-01-29'),
(21,1,'Placed','2025-01-30'),
(22,2,'Placed','2025-02-01'),
(23,3,'Placed','2025-02-02'),
(24,4,'Placed','2025-02-03'),
(25,5,'Placed','2025-02-04'),
(26,6,'Placed','2025-02-05'),
(27,7,'Placed','2025-02-06'),
(28,8,'Placed','2025-02-07'),
(29,9,'Placed','2025-02-08'),
(30,10,'Placed','2025-02-09');
SELECT COUNT(*) AS TotalPlacements
FROM Placements;
SELECT * FROM Placements;




SELECT COUNT(*) AS Students FROM Students;
SELECT COUNT(*) AS Companies FROM Companies;
SELECT COUNT(*) AS Skills FROM Skills;
SELECT COUNT(*) AS StudentSkills FROM StudentSkills;
SELECT COUNT(*) AS Placements FROM Placements;




SELECT COUNT(*) AS TotalStudents
FROM Students;

SELECT COUNT(DISTINCT StudentID) AS TotalPlacedStudents
FROM Placements;

SELECT
    (COUNT(DISTINCT StudentID) * 100.0 /
     (SELECT COUNT(*) FROM Students)) AS PlacementPercentage
FROM Placements;

SELECT MAX(Package) AS HighestPackage
FROM Companies;

SELECT
    c.CompanyName,
    COUNT(*) AS StudentsHired
FROM Placements p
JOIN Companies c
ON p.CompanyID = c.CompanyID
GROUP BY c.CompanyName
ORDER BY StudentsHired DESC;

SELECT
    s.Branch,
    COUNT(*) AS PlacedStudents
FROM Placements p
JOIN Students s
ON p.StudentID = s.StudentID
GROUP BY s.Branch
ORDER BY PlacedStudents DESC;



SELECT
    s.StudentName,
    s.Branch,
    c.CompanyName,
    c.Package,
    p.PlacementDate
FROM Placements p
JOIN Students s
ON p.StudentID = s.StudentID
JOIN Companies c
ON p.CompanyID = c.CompanyID
ORDER BY c.Package DESC;

UPDATE Placements
SET Status = 'Rejected'
WHERE PlacementID IN (26,27,28,29,30);


SELECT Status, COUNT(*) AS Total
FROM Placements
GROUP BY Status;