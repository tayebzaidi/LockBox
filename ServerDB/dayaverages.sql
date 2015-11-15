-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2015 at 06:08 AM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sleepbox`
--

-- --------------------------------------------------------

--
-- Table structure for table `dayaverages`
--

CREATE TABLE IF NOT EXISTS `dayaverages` (
  `college` varchar(64) NOT NULL,
  `date_before_bed` date NOT NULL,
  `average_sleep` time NOT NULL,
  `average_bedtime` time NOT NULL,
  `average_waketime` time NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dayaverages`
--

INSERT INTO `dayaverages` (`college`, `date_before_bed`, `average_sleep`, `average_bedtime`, `average_waketime`, `count`) VALUES
('Macalester College', '2015-09-17', '07:05:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-16', '07:16:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-15', '06:50:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-14', '07:13:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-13', '07:49:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-12', '07:15:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-11', '08:16:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-10', '07:08:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-09', '07:55:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-08', '07:26:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-07', '07:43:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-06', '06:51:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-05', '07:19:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-04', '08:05:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-03', '07:26:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-02', '06:35:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-09-01', '07:26:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-31', '07:12:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-30', '08:07:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-29', '07:50:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-28', '06:49:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-27', '06:42:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-26', '08:15:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-25', '07:31:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-24', '07:54:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-23', '07:08:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-22', '07:29:00', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-21', '06:16:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-20', '07:49:01', '08:30:00', '07:30:00', 1),
('Macalester College', '2015-08-19', '07:00:00', '08:30:00', '07:30:00', 1),
('Washington University in St. Louis', '2015-08-19', '05:03:01', '02:56:00', '08:00:00', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
