-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: lms_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MzQ3MzI4NCwiZXhwIjoxNzc0MDc4MDg0fQ.iOvAWfQUWGi4_uzUQvDRgfs7x2NRFgxtUx179UwaFro','2026-03-21 07:28:04'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MzQ3MzQ2NiwiZXhwIjoxNzc0MDc4MjY2fQ.BHhvgK6_11WMeR3YFGo7xTANuYRTYHlJism7Up3ov2I','2026-03-21 07:31:06'),(3,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MzQ3MzQ2OSwiZXhwIjoxNzc0MDc4MjY5fQ.Xcuk8DQLdbSZpCqmnGqKBPFL1EFSH3ihxTiXC1Qmrg8','2026-03-21 07:31:10'),(4,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MzQ3NDg3MywiZXhwIjoxNzc0MDc5NjczfQ.X9UXTtqgNH7bwgV0wVItbK6cXOv1rGTR5w1INyqcheQ','2026-03-21 07:54:33'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MzQ3Nzc4MywiZXhwIjoxNzc0MDgyNTgzfQ.zJ4lww6JjmM9koeDVcw94dpdH5PjoSxvu0V7my31u3w','2026-03-21 08:43:04'),(6,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MzY3MzU4MSwiZXhwIjoxNzc0Mjc4MzgxfQ.yL6g-V1mnoJ1z21r7Bab7Tup0zYzHE1c319nt5LWeW0','2026-03-23 15:06:21'),(7,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MzY3MzU5MSwiZXhwIjoxNzc0Mjc4MzkxfQ.5SXBBb36kM-ShPxlf8bBlhTsQv646_n2YJ9Ef-n-YlI','2026-03-23 15:06:31'),(8,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MzY3NzgyMCwiZXhwIjoxNzc0MjgyNjIwfQ.huzkOBzHfcv5hhPsDyjmrWMUgF17Bw3dp8gOxNyPwvk','2026-03-23 16:17:00'),(9,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MzY3ODAzNywiZXhwIjoxNzc0MjgyODM3fQ.IX0q3X7eJylPRkwcfLrvChvwKRmFBJzHHdpUeAN1XSU','2026-03-23 16:20:37'),(10,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MzcyNjUyNCwiZXhwIjoxNzc0MzMxMzI0fQ.fdRZqCNEKiVuDM26NPw2zvtBqmoMKwrt6VpEKgDJlyc','2026-03-24 05:48:44'),(11,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3MzcyNjYyOCwiZXhwIjoxNzc0MzMxNDI4fQ.D1054gVRbzM3NIA6Ti1S8Zy0AE8_hcgOK5fmm6JCdnY','2026-03-24 05:50:28'),(12,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3MzcyNjY0NCwiZXhwIjoxNzc0MzMxNDQ0fQ.Pe_VyQSW9w8PRheqtmldB5uLf1OvfQdefhUsd2Ks9FM','2026-03-24 05:50:45'),(13,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3MzcyNjczNCwiZXhwIjoxNzc0MzMxNTM0fQ.6YKDcMok59dRSc9KJZH2vnNrIUCciWY0ppXYM-dWt54','2026-03-24 05:52:15'),(14,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3MzcyNjc3OSwiZXhwIjoxNzc0MzMxNTc5fQ._0CrMPvCVvPHbVUKUMqr1m7t7UGq_rAqeznVdyV6Kqs','2026-03-24 05:52:59'),(15,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc3Mzc0NTA1OSwiZXhwIjoxNzc0MzQ5ODU5fQ.JzEtTPcfaGNMy54dDyEpZEC1B3QvYfHV2f0c3fBia0s','2026-03-24 10:57:40'),(16,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc3Mzc0NTA3NywiZXhwIjoxNzc0MzQ5ODc3fQ.y13ZtC0mEs6X0zf1dPYMExN5Snmtq3LUoFXs7Ro30iE','2026-03-24 10:57:58'),(17,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3Mzc1MjU3NCwiZXhwIjoxNzc0MzU3Mzc0fQ.C0pS3TlENjyNDtqrQpjKzPqDm3wtTwVUyfUvinj9VMk','2026-03-24 13:02:54'),(18,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc3Mzc1Mzg4MSwiZXhwIjoxNzc0MzU4NjgxfQ.95GZJDJXwEYYox27YhuplVX5dcEaGbdwH201hOjYeuQ','2026-03-24 13:24:41'),(19,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc3Mzc1MzkyOSwiZXhwIjoxNzc0MzU4NzI5fQ.MZf976MWRo6uciQjwYNTdZSB-SRCHCv6DbKCkiz2VWY','2026-03-24 13:25:30'),(20,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc3Mzc1Mzk0NSwiZXhwIjoxNzc0MzU4NzQ1fQ.rOQcuowVGOn4rcU8dtOoHXHojmvu1e2UywMQekME-ns','2026-03-24 13:25:45'),(21,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc3Mzc1NTQ2NiwiZXhwIjoxNzc0MzYwMjY2fQ.4KpB2RQt8ene6u21tMMPtHPGD5_3YTyyti2BIlJC_K4','2026-03-24 13:51:06'),(22,7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc3Mzc1NjA0NywiZXhwIjoxNzc0MzYwODQ3fQ.AZm1JuMAHtfEkdqGvutmrMEcR_9X66anPIOmBco9esY','2026-03-24 14:00:47'),(23,7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc3Mzc1NjA2MiwiZXhwIjoxNzc0MzYwODYyfQ.DTJogKQS2fmofNcwgC6CWBODeV3ytXR7K_mbPtYyMcU','2026-03-24 14:01:02');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (1,1,'JavaScript Complete Course: Introduction',1),(2,1,'JavaScript Complete Course: Core Concepts',2),(3,1,'JavaScript Complete Course: Practice & Project',3),(4,2,'React Complete Course: Introduction',1),(5,2,'React Complete Course: Core Concepts',2),(6,2,'React Complete Course: Practice & Project',3),(7,3,'Node.js Backend Development: Introduction',1),(8,3,'Node.js Backend Development: Core Concepts',2),(9,3,'Node.js Backend Development: Practice & Project',3),(10,4,'MongoDB for Developers: Introduction',1),(11,4,'MongoDB for Developers: Core Concepts',2),(12,4,'MongoDB for Developers: Practice & Project',3),(13,5,'HTML & CSS Bootcamp: Introduction',1),(14,5,'HTML & CSS Bootcamp: Core Concepts',2),(15,5,'HTML & CSS Bootcamp: Practice & Project',3),(16,6,'Python Full Course: Introduction',1),(17,6,'Python Full Course: Core Concepts',2),(18,6,'Python Full Course: Practice & Project',3),(19,7,'Java Programming Masterclass: Introduction',1),(20,7,'Java Programming Masterclass: Core Concepts',2),(21,7,'Java Programming Masterclass: Practice & Project',3),(22,8,'C++ Complete Course: Introduction',1),(23,8,'C++ Complete Course: Core Concepts',2),(24,8,'C++ Complete Course: Practice & Project',3),(25,9,'Data Structures & Algorithms: Introduction',1),(26,9,'Data Structures & Algorithms: Core Concepts',2),(27,9,'Data Structures & Algorithms: Practice & Project',3),(28,10,'SQL Full Course: Introduction',1),(29,10,'SQL Full Course: Core Concepts',2),(30,10,'SQL Full Course: Practice & Project',3),(31,11,'Spring Boot Course: Introduction',1),(32,11,'Spring Boot Course: Core Concepts',2),(33,11,'Spring Boot Course: Practice & Project',3),(34,12,'MERN Stack Full Course: Introduction',1),(35,12,'MERN Stack Full Course: Core Concepts',2),(36,12,'MERN Stack Full Course: Practice & Project',3),(37,13,'HTML & CSS Complete Course: Introduction',1),(38,13,'HTML & CSS Complete Course: Core Concepts',2),(39,13,'HTML & CSS Complete Course: Practice & Project',3),(40,14,'Git & GitHub Crash Course: Introduction',1),(41,14,'Git & GitHub Crash Course: Core Concepts',2),(42,14,'Git & GitHub Crash Course: Practice & Project',3),(43,15,'Machine Learning Basics: Introduction',1),(44,15,'Machine Learning Basics: Core Concepts',2),(45,15,'Machine Learning Basics: Practice & Project',3),(46,16,'React Advanced Concepts: Introduction',1),(47,16,'React Advanced Concepts: Core Concepts',2),(48,16,'React Advanced Concepts: Practice & Project',3),(49,17,'Node.js Backend Course: Introduction',1),(50,17,'Node.js Backend Course: Core Concepts',2),(51,17,'Node.js Backend Course: Practice & Project',3),(52,18,'MongoDB Full Course: Introduction',1),(53,18,'MongoDB Full Course: Core Concepts',2),(54,18,'MongoDB Full Course: Practice & Project',3),(55,19,'Docker Basics: Introduction',1),(56,19,'Docker Basics: Core Concepts',2),(57,19,'Docker Basics: Practice & Project',3),(58,20,'System Design Basics: Introduction',1),(59,20,'System Design Basics: Core Concepts',2),(60,20,'System Design Basics: Practice & Project',3),(61,21,'Python for Beginners: Introduction',1),(62,21,'Python for Beginners: Core Concepts',2),(63,21,'Python for Beginners: Practice & Project',3),(64,22,'Java Full Course: Introduction',1),(65,22,'Java Full Course: Core Concepts',2),(66,22,'Java Full Course: Practice & Project',3),(67,23,'C++ Programming: Introduction',1),(68,23,'C++ Programming: Core Concepts',2),(69,23,'C++ Programming: Practice & Project',3),(70,24,'Data Structures & Algorithms: Introduction',1),(71,24,'Data Structures & Algorithms: Core Concepts',2),(72,24,'Data Structures & Algorithms: Practice & Project',3),(73,25,'SQL for Beginners: Introduction',1),(74,25,'SQL for Beginners: Core Concepts',2),(75,25,'SQL for Beginners: Practice & Project',3),(76,26,'Spring Boot Crash Course: Introduction',1),(77,26,'Spring Boot Crash Course: Core Concepts',2),(78,26,'Spring Boot Crash Course: Practice & Project',3),(79,27,'MERN Stack Full Course: Introduction',1),(80,27,'MERN Stack Full Course: Core Concepts',2),(81,27,'MERN Stack Full Course: Practice & Project',3),(82,28,'HTML & CSS Complete Course: Introduction',1),(83,28,'HTML & CSS Complete Course: Core Concepts',2),(84,28,'HTML & CSS Complete Course: Practice & Project',3),(85,29,'Git & GitHub Mastery: Introduction',1),(86,29,'Git & GitHub Mastery: Core Concepts',2),(87,29,'Git & GitHub Mastery: Practice & Project',3),(88,30,'React Advanced Concepts: Introduction',1),(89,30,'React Advanced Concepts: Core Concepts',2),(90,30,'React Advanced Concepts: Practice & Project',3);
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_contents`
--

DROP TABLE IF EXISTS `subject_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_contents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `time` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_contents`
--

LOCK TABLES `subject_contents` WRITE;
/*!40000 ALTER TABLE `subject_contents` DISABLE KEYS */;
INSERT INTO `subject_contents` VALUES (1,12,'Introduction',0),(2,12,'What is Node.js',30),(3,12,'Modules',90),(4,12,'File System',180),(5,12,'Express Server',300),(6,11,'React Introduction',0),(7,11,'JSX',60),(8,11,'Components',120),(9,11,'Props',240),(10,11,'Hooks',420),(11,10,'JavaScript Basics',0),(12,10,'Variables',60),(13,10,'Functions',120),(14,10,'DOM Manipulation',240),(15,10,'Events',360);
/*!40000 ALTER TABLE `subject_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `youtube_url` varchar(500) DEFAULT NULL,
  `order_index` int NOT NULL,
  `instructor` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `contents` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'JavaScript Complete Course','Learn JavaScript from basics to advanced','https://www.youtube.com/watch?v=W6NZfCO5SIk',1,'John Smilga',NULL,4.7,499,NULL),(2,'React Complete Course','Build powerful frontend apps with React','https://www.youtube.com/watch?v=bMknfKXIFA8',2,'Maximilian Schwarzmuller',NULL,4.8,549,NULL),(3,'Node.js Backend Development','Build scalable backend APIs using Node.js','https://www.youtube.com/watch?v=Oe421EPjeBE',3,'Traversy Media',NULL,4.6,499,NULL),(4,'MongoDB for Developers','Learn MongoDB database from scratch','https://www.youtube.com/watch?v=ExcRbA7fy_A',4,'Academind',NULL,4.5,399,NULL),(5,'HTML & CSS Bootcamp','Complete frontend fundamentals with HTML & CSS','https://www.youtube.com/watch?v=G3e-cpL7ofc',5,'Kevin Powell',NULL,4.7,349,NULL),(6,'Python Full Course','Master Python fundamentals and build practical programs.','https://www.youtube.com/watch?v=rfscVS0vtbw',6,'freeCodeCamp',NULL,4.8,499,NULL),(7,'Java Programming Masterclass','Learn Java from core concepts to real-world development.','https://www.youtube.com/watch?v=eIrMbAQSU34',7,'Telusko',NULL,4.7,399,NULL),(8,'C++ Complete Course','C++ from basics to OOP and problem solving.','https://www.youtube.com/watch?v=vLnPwxZdW4Y',8,'CodeWithHarry',NULL,4.6,349,NULL),(9,'Data Structures & Algorithms','Strengthen DSA fundamentals for interviews and coding.','https://www.youtube.com/watch?v=8hly31xKli0',9,'Abdul Bari',NULL,4.9,599,NULL),(10,'SQL Full Course','Learn SQL queries, joins, and database fundamentals.','https://www.youtube.com/watch?v=HXV3zeQKqGY',10,'freeCodeCamp',NULL,4.7,299,NULL),(11,'Spring Boot Course','Build modern Java APIs and services with Spring Boot.','https://www.youtube.com/watch?v=9SGDpanrc8U',11,'Amigoscode',NULL,4.8,499,NULL),(12,'MERN Stack Full Course','Full-stack web apps with MongoDB, Express, React, and Node.','https://www.youtube.com/watch?v=7CqJlxBYj-M',12,'freeCodeCamp',NULL,4.8,599,NULL),(13,'HTML & CSS Complete Course','Modern HTML & CSS layouts, responsiveness, and styling.','https://www.youtube.com/watch?v=G3e-cpL7ofc',13,'SuperSimpleDev',NULL,4.6,199,NULL),(14,'Git & GitHub Crash Course','Version control essentials: Git workflows and GitHub basics.','https://www.youtube.com/watch?v=RGOj5yH7evk',14,'Traversy Media',NULL,4.7,199,NULL),(15,'Machine Learning Basics','ML fundamentals: data, models, training, and evaluation.','https://www.youtube.com/watch?v=Gv9_4yMHFhI',15,'freeCodeCamp',NULL,4.8,599,NULL),(16,'React Advanced Concepts','Take React deeper with advanced patterns and best practices.','https://www.youtube.com/watch?v=SqcY0GlETPk',16,'Net Ninja',NULL,4.7,499,NULL),(17,'Node.js Backend Course','Build backend services and REST APIs with Node.js.','https://www.youtube.com/watch?v=Oe421EPjeBE',17,'Traversy Media',NULL,4.6,399,NULL),(18,'MongoDB Full Course','MongoDB essentials: collections, queries, indexes, and CRUD.','https://www.youtube.com/watch?v=ofme2o29ngU',18,'freeCodeCamp',NULL,4.6,399,NULL),(19,'Docker Basics','Docker fundamentals: images, containers, volumes, and compose.','https://www.youtube.com/watch?v=3c-iBn73dDE',19,'TechWorld with Nana',NULL,4.7,299,NULL),(20,'System Design Basics','Learn core system design principles and common patterns.','https://www.youtube.com/watch?v=xpDnVSmNFX0',20,'Gaurav Sen',NULL,4.8,699,NULL),(21,'Python for Beginners','Start Python from scratch with fundamentals and practice.','https://www.youtube.com/watch?v=rfscVS0vtbw',21,'CodeWithHarry',NULL,4.6,399,NULL),(22,'Java Full Course','Comprehensive Java course covering core to advanced topics.','https://www.youtube.com/watch?v=grEKMHGYyns',22,'Telusko',NULL,4.7,499,NULL),(23,'C++ Programming','Learn C++ programming with OOP and problem-solving practice.','https://www.youtube.com/watch?v=vLnPwxZdW4Y',23,'freeCodeCamp',NULL,4.5,349,NULL),(24,'Data Structures & Algorithms','DSA fundamentals with patterns to improve coding interviews.','https://www.youtube.com/watch?v=8hly31xKli0',24,'Apna College',NULL,4.8,599,NULL),(25,'SQL for Beginners','SQL basics: queries, filtering, joins, and real examples.','https://www.youtube.com/watch?v=7S_tz1z_5bA',25,'Programming with Mosh',NULL,4.6,299,NULL),(26,'Spring Boot Crash Course','Build Spring Boot APIs quickly with best practices.','https://www.youtube.com/watch?v=9SGDpanrc8U',26,'Amigoscode',NULL,4.7,449,NULL),(27,'MERN Stack Full Course','Build a full MERN app with auth, CRUD, and deployment tips.','https://www.youtube.com/watch?v=7CqJlxBYj-M',27,'freeCodeCamp',NULL,4.8,699,NULL),(28,'HTML & CSS Complete Course','Responsive HTML & CSS layouts with modern styling.','https://www.youtube.com/watch?v=G3e-cpL7ofc',28,'SuperSimpleDev',NULL,4.5,199,NULL),(29,'Git & GitHub Mastery','Master Git commands, branching, and GitHub collaboration.','https://www.youtube.com/watch?v=RGOj5yH7evk',29,'Programming with Mosh',NULL,4.6,249,NULL),(30,'React Advanced Concepts','Advanced React concepts to write scalable UI applications.','https://www.youtube.com/watch?v=bMknfKXIFA8',30,'Codevolution',NULL,4.7,549,NULL);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','test@example.com','$2a$10$Mjr2VLMyd8TOCvf19.RuUe/HoFk8aCuGLysEJGHmyxsY6MKgLuo86','2026-03-14 07:28:04'),(2,'Sushmitha','ganigasushmitha28@gmail.com','$2a$10$Z6.H51x/AZdz0sG9Oc8yO.YpJip3W.DC7dnX4FmAW60sgZ5Ru/d3i','2026-03-16 15:06:21'),(3,'Jyothi','jyothi@gmail.com','$2a$10$QJlDRczXHjA3aaeP.MvVWuU65HPnyigj4PQN7I5uoKEhocGm25x36','2026-03-17 05:50:28'),(4,'purandara','purandara@gmail.com','$2a$10$N4/0AhiyIW7J3Za/MVWc.OP6q.cfaWyZwtVrwKndgTkYZv2spyYGK','2026-03-17 10:57:39'),(5,'sushmitha ganiga','sush@2005gmail.com','$2a$10$lmGFlNYnwKBYaljb7tn8IeaNAMDXKHo9G4yPaefwKTEvgdsM8H78K','2026-03-17 13:24:41'),(6,'Sushmitha ','sush2005@gmail.com','$2a$10$y70cAE8sXjvkiOiojUgBiOUrx8GVjTPTEmI3cQJpIIZ3FK0C0KVwS','2026-03-17 13:25:29'),(7,'sush','sush@gmail.com','$2a$10$9C8e3lBEqVI3Sg.IQ2zBIeT.Y./khK8Lxqjcs/oLxsVdc7NCykkjW','2026-03-17 14:00:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_progress`
--

DROP TABLE IF EXISTS `video_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  `last_position_seconds` int DEFAULT '0',
  `is_completed` tinyint(1) DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_video` (`user_id`,`video_id`),
  KEY `video_id` (`video_id`),
  CONSTRAINT `video_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_progress_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_progress`
--

LOCK TABLES `video_progress` WRITE;
/*!40000 ALTER TABLE `video_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `video_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `youtube_url` varchar(500) NOT NULL,
  `duration_seconds` int NOT NULL,
  `order_index` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,1,'JavaScript Complete Course - Course Overview','https://www.youtube.com/watch?v=W6NZfCO5SIk',1800,1),(2,2,'JavaScript Complete Course - Core Lesson','https://www.youtube.com/watch?v=W6NZfCO5SIk',2400,1),(3,3,'JavaScript Complete Course - Practice Session','https://www.youtube.com/watch?v=W6NZfCO5SIk',2100,1),(4,4,'React Complete Course - Course Overview','https://www.youtube.com/watch?v=bMknfKXIFA8',1800,1),(5,5,'React Complete Course - Core Lesson','https://www.youtube.com/watch?v=bMknfKXIFA8',2400,1),(6,6,'React Complete Course - Practice Session','https://www.youtube.com/watch?v=bMknfKXIFA8',2100,1),(7,7,'Node.js Backend Development - Course Overview','https://www.youtube.com/watch?v=Oe421EPjeBE',1800,1),(8,8,'Node.js Backend Development - Core Lesson','https://www.youtube.com/watch?v=Oe421EPjeBE',2400,1),(9,9,'Node.js Backend Development - Practice Session','https://www.youtube.com/watch?v=Oe421EPjeBE',2100,1),(10,10,'MongoDB for Developers - Course Overview','https://www.youtube.com/watch?v=ExcRbA7fy_A',1800,1),(11,11,'MongoDB for Developers - Core Lesson','https://www.youtube.com/watch?v=ExcRbA7fy_A',2400,1),(12,12,'MongoDB for Developers - Practice Session','https://www.youtube.com/watch?v=ExcRbA7fy_A',2100,1),(13,13,'HTML & CSS Bootcamp - Course Overview','https://www.youtube.com/watch?v=G3e-cpL7ofc',1800,1),(14,14,'HTML & CSS Bootcamp - Core Lesson','https://www.youtube.com/watch?v=G3e-cpL7ofc',2400,1),(15,15,'HTML & CSS Bootcamp - Practice Session','https://www.youtube.com/watch?v=G3e-cpL7ofc',2100,1),(16,16,'Python Full Course - Course Overview','https://www.youtube.com/watch?v=rfscVS0vtbw',1800,1),(17,17,'Python Full Course - Core Lesson','https://www.youtube.com/watch?v=rfscVS0vtbw',2400,1),(18,18,'Python Full Course - Practice Session','https://www.youtube.com/watch?v=rfscVS0vtbw',2100,1),(19,19,'Java Programming Masterclass - Course Overview','https://www.youtube.com/watch?v=eIrMbAQSU34',1800,1),(20,20,'Java Programming Masterclass - Core Lesson','https://www.youtube.com/watch?v=eIrMbAQSU34',2400,1),(21,21,'Java Programming Masterclass - Practice Session','https://www.youtube.com/watch?v=eIrMbAQSU34',2100,1),(22,22,'C++ Complete Course - Course Overview','https://www.youtube.com/watch?v=vLnPwxZdW4Y',1800,1),(23,23,'C++ Complete Course - Core Lesson','https://www.youtube.com/watch?v=vLnPwxZdW4Y',2400,1),(24,24,'C++ Complete Course - Practice Session','https://www.youtube.com/watch?v=vLnPwxZdW4Y',2100,1),(25,25,'Data Structures & Algorithms - Course Overview','https://www.youtube.com/watch?v=8hly31xKli0',1800,1),(26,26,'Data Structures & Algorithms - Core Lesson','https://www.youtube.com/watch?v=8hly31xKli0',2400,1),(27,27,'Data Structures & Algorithms - Practice Session','https://www.youtube.com/watch?v=8hly31xKli0',2100,1),(28,28,'SQL Full Course - Course Overview','https://www.youtube.com/watch?v=HXV3zeQKqGY',1800,1),(29,29,'SQL Full Course - Core Lesson','https://www.youtube.com/watch?v=HXV3zeQKqGY',2400,1),(30,30,'SQL Full Course - Practice Session','https://www.youtube.com/watch?v=HXV3zeQKqGY',2100,1),(31,31,'Spring Boot Course - Course Overview','https://www.youtube.com/watch?v=9SGDpanrc8U',1800,1),(32,32,'Spring Boot Course - Core Lesson','https://www.youtube.com/watch?v=9SGDpanrc8U',2400,1),(33,33,'Spring Boot Course - Practice Session','https://www.youtube.com/watch?v=9SGDpanrc8U',2100,1),(34,34,'MERN Stack Full Course - Course Overview','https://www.youtube.com/watch?v=7CqJlxBYj-M',1800,1),(35,35,'MERN Stack Full Course - Core Lesson','https://www.youtube.com/watch?v=7CqJlxBYj-M',2400,1),(36,36,'MERN Stack Full Course - Practice Session','https://www.youtube.com/watch?v=7CqJlxBYj-M',2100,1),(37,37,'HTML & CSS Complete Course - Course Overview','https://www.youtube.com/watch?v=G3e-cpL7ofc',1800,1),(38,38,'HTML & CSS Complete Course - Core Lesson','https://www.youtube.com/watch?v=G3e-cpL7ofc',2400,1),(39,39,'HTML & CSS Complete Course - Practice Session','https://www.youtube.com/watch?v=G3e-cpL7ofc',2100,1),(40,40,'Git & GitHub Crash Course - Course Overview','https://www.youtube.com/watch?v=RGOj5yH7evk',1800,1),(41,41,'Git & GitHub Crash Course - Core Lesson','https://www.youtube.com/watch?v=RGOj5yH7evk',2400,1),(42,42,'Git & GitHub Crash Course - Practice Session','https://www.youtube.com/watch?v=RGOj5yH7evk',2100,1),(43,43,'Machine Learning Basics - Course Overview','https://www.youtube.com/watch?v=Gv9_4yMHFhI',1800,1),(44,44,'Machine Learning Basics - Core Lesson','https://www.youtube.com/watch?v=Gv9_4yMHFhI',2400,1),(45,45,'Machine Learning Basics - Practice Session','https://www.youtube.com/watch?v=Gv9_4yMHFhI',2100,1),(46,46,'React Advanced Concepts - Course Overview','https://www.youtube.com/watch?v=SqcY0GlETPk',1800,1),(47,47,'React Advanced Concepts - Core Lesson','https://www.youtube.com/watch?v=SqcY0GlETPk',2400,1),(48,48,'React Advanced Concepts - Practice Session','https://www.youtube.com/watch?v=SqcY0GlETPk',2100,1),(49,49,'Node.js Backend Course - Course Overview','https://www.youtube.com/watch?v=Oe421EPjeBE',1800,1),(50,50,'Node.js Backend Course - Core Lesson','https://www.youtube.com/watch?v=Oe421EPjeBE',2400,1),(51,51,'Node.js Backend Course - Practice Session','https://www.youtube.com/watch?v=Oe421EPjeBE',2100,1),(52,52,'MongoDB Full Course - Course Overview','https://www.youtube.com/watch?v=ofme2o29ngU',1800,1),(53,53,'MongoDB Full Course - Core Lesson','https://www.youtube.com/watch?v=ofme2o29ngU',2400,1),(54,54,'MongoDB Full Course - Practice Session','https://www.youtube.com/watch?v=ofme2o29ngU',2100,1),(55,55,'Docker Basics - Course Overview','https://www.youtube.com/watch?v=3c-iBn73dDE',1800,1),(56,56,'Docker Basics - Core Lesson','https://www.youtube.com/watch?v=3c-iBn73dDE',2400,1),(57,57,'Docker Basics - Practice Session','https://www.youtube.com/watch?v=3c-iBn73dDE',2100,1),(58,58,'System Design Basics - Course Overview','https://www.youtube.com/watch?v=xpDnVSmNFX0',1800,1),(59,59,'System Design Basics - Core Lesson','https://www.youtube.com/watch?v=xpDnVSmNFX0',2400,1),(60,60,'System Design Basics - Practice Session','https://www.youtube.com/watch?v=xpDnVSmNFX0',2100,1),(61,61,'Python for Beginners - Course Overview','https://www.youtube.com/watch?v=rfscVS0vtbw',1800,1),(62,62,'Python for Beginners - Core Lesson','https://www.youtube.com/watch?v=rfscVS0vtbw',2400,1),(63,63,'Python for Beginners - Practice Session','https://www.youtube.com/watch?v=rfscVS0vtbw',2100,1),(64,64,'Java Full Course - Course Overview','https://www.youtube.com/watch?v=grEKMHGYyns',1800,1),(65,65,'Java Full Course - Core Lesson','https://www.youtube.com/watch?v=grEKMHGYyns',2400,1),(66,66,'Java Full Course - Practice Session','https://www.youtube.com/watch?v=grEKMHGYyns',2100,1),(67,67,'C++ Programming - Course Overview','https://www.youtube.com/watch?v=vLnPwxZdW4Y',1800,1),(68,68,'C++ Programming - Core Lesson','https://www.youtube.com/watch?v=vLnPwxZdW4Y',2400,1),(69,69,'C++ Programming - Practice Session','https://www.youtube.com/watch?v=vLnPwxZdW4Y',2100,1),(70,70,'Data Structures & Algorithms - Course Overview','https://www.youtube.com/watch?v=8hly31xKli0',1800,1),(71,71,'Data Structures & Algorithms - Core Lesson','https://www.youtube.com/watch?v=8hly31xKli0',2400,1),(72,72,'Data Structures & Algorithms - Practice Session','https://www.youtube.com/watch?v=8hly31xKli0',2100,1),(73,73,'SQL for Beginners - Course Overview','https://www.youtube.com/watch?v=7S_tz1z_5bA',1800,1),(74,74,'SQL for Beginners - Core Lesson','https://www.youtube.com/watch?v=7S_tz1z_5bA',2400,1),(75,75,'SQL for Beginners - Practice Session','https://www.youtube.com/watch?v=7S_tz1z_5bA',2100,1),(76,76,'Spring Boot Crash Course - Course Overview','https://www.youtube.com/watch?v=9SGDpanrc8U',1800,1),(77,77,'Spring Boot Crash Course - Core Lesson','https://www.youtube.com/watch?v=9SGDpanrc8U',2400,1),(78,78,'Spring Boot Crash Course - Practice Session','https://www.youtube.com/watch?v=9SGDpanrc8U',2100,1),(79,79,'MERN Stack Full Course - Course Overview','https://www.youtube.com/watch?v=7CqJlxBYj-M',1800,1),(80,80,'MERN Stack Full Course - Core Lesson','https://www.youtube.com/watch?v=7CqJlxBYj-M',2400,1),(81,81,'MERN Stack Full Course - Practice Session','https://www.youtube.com/watch?v=7CqJlxBYj-M',2100,1),(82,82,'HTML & CSS Complete Course - Course Overview','https://www.youtube.com/watch?v=G3e-cpL7ofc',1800,1),(83,83,'HTML & CSS Complete Course - Core Lesson','https://www.youtube.com/watch?v=G3e-cpL7ofc',2400,1),(84,84,'HTML & CSS Complete Course - Practice Session','https://www.youtube.com/watch?v=G3e-cpL7ofc',2100,1),(85,85,'Git & GitHub Mastery - Course Overview','https://www.youtube.com/watch?v=RGOj5yH7evk',1800,1),(86,86,'Git & GitHub Mastery - Core Lesson','https://www.youtube.com/watch?v=RGOj5yH7evk',2400,1),(87,87,'Git & GitHub Mastery - Practice Session','https://www.youtube.com/watch?v=RGOj5yH7evk',2100,1),(88,88,'React Advanced Concepts - Course Overview','https://www.youtube.com/watch?v=bMknfKXIFA8',1800,1),(89,89,'React Advanced Concepts - Core Lesson','https://www.youtube.com/watch?v=bMknfKXIFA8',2400,1),(90,90,'React Advanced Concepts - Practice Session','https://www.youtube.com/watch?v=bMknfKXIFA8',2100,1);
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-18 14:05:10
