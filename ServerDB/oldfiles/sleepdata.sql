-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2015 at 07:02 AM
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
-- Table structure for table `sleepdata`
--

CREATE TABLE IF NOT EXISTS `sleepdata` (
  `college` varchar(64) NOT NULL,
  `date_before_bed` date NOT NULL,
  `bedtime` time NOT NULL,
  `waketime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sleepdata`
--

INSERT INTO `sleepdata` (`college`, `date_before_bed`, `bedtime`, `waketime`) VALUES
('Macalester College', '2014-01-01', '23:21:00', '06:27:00'),
('Macalester College', '2014-01-02', '23:40:00', '07:33:00'),
('Macalester College', '2014-01-03', '00:02:00', '06:40:00'),
('Macalester College', '2014-01-04', '00:13:00', '06:37:00'),
('Macalester College', '2014-01-05', '00:33:00', '06:16:00'),
('Macalester College', '2014-01-01', '23:19:00', '06:36:00'),
('Macalester College', '2014-01-02', '23:38:00', '06:57:00'),
('Macalester College', '2014-01-03', '00:00:00', '05:56:00'),
('Macalester College', '2014-01-04', '00:20:00', '07:34:00'),
('Macalester College', '2014-01-01', '23:21:00', '06:12:00'),
('Macalester College', '2014-01-02', '23:36:00', '07:13:00'),
('Macalester College', '2014-01-03', '23:55:00', '06:49:00'),
('Macalester College', '2014-01-04', '00:18:00', '07:39:00'),
('Macalester College', '2014-01-01', '23:18:00', '06:31:00'),
('Macalester College', '2014-01-02', '23:43:00', '06:27:00'),
('Macalester College', '2014-01-03', '00:00:00', '07:09:00'),
('Macalester College', '2014-01-04', '00:19:00', '06:37:00'),
('Macalester College', '2014-01-05', '00:43:00', '06:46:00'),
('Macalester College', '2014-01-06', '00:59:00', '07:48:00'),
('Macalester College', '2014-01-01', '23:28:00', '07:18:00'),
('Macalester College', '2014-01-02', '23:43:00', '06:29:00'),
('Macalester College', '2014-01-01', '23:22:00', '06:38:00'),
('Macalester College', '2014-01-02', '23:41:00', '06:17:00'),
('Macalester College', '2014-01-03', '23:59:00', '06:31:00'),
('Macalester College', '2014-01-01', '23:22:00', '07:38:00'),
('Macalester College', '2014-01-02', '23:45:00', '07:26:00'),
('Macalester College', '2014-01-03', '23:59:00', '07:20:00'),
('Macalester College', '2014-01-04', '00:16:00', '07:14:00'),
('Macalester College', '2014-01-01', '23:16:00', '06:24:00'),
('Macalester College', '2014-01-02', '23:40:00', '06:08:00'),
('Macalester College', '2014-01-03', '00:04:00', '06:09:00'),
('Macalester College', '2014-01-04', '00:19:00', '06:24:00'),
('Macalester College', '2014-01-01', '23:26:00', '07:21:00'),
('Macalester College', '2014-01-02', '23:40:00', '07:25:00'),
('Macalester College', '2014-01-03', '00:03:00', '07:16:00'),
('Macalester College', '2014-01-04', '00:21:00', '07:24:00'),
('Macalester College', '2014-01-05', '00:48:00', '06:19:00'),
('Macalester College', '2014-01-01', '23:20:00', '06:46:00'),
('Macalester College', '2014-01-02', '23:40:00', '07:03:00'),
('Macalester College', '2014-01-03', '00:04:00', '07:21:00'),
('Macalester College', '2014-01-04', '00:16:00', '06:04:00'),
('Macalester College', '2014-01-01', '23:23:00', '07:06:00'),
('Macalester College', '2014-01-02', '23:45:00', '06:34:00'),
('Macalester College', '2014-01-03', '00:02:00', '06:24:00'),
('Macalester College', '2014-01-04', '00:23:00', '06:38:00'),
('Macalester College', '2014-01-05', '00:42:00', '07:24:00'),
('Macalester College', '2014-01-06', '00:55:00', '07:36:00'),
('Macalester College', '2014-01-01', '23:24:00', '06:16:00'),
('Macalester College', '2014-01-02', '23:44:00', '06:44:00'),
('Macalester College', '2014-01-03', '23:59:00', '07:33:00'),
('Macalester College', '2014-01-04', '00:21:00', '07:37:00'),
('Macalester College', '2014-01-05', '00:43:00', '07:44:00'),
('Macalester College', '2014-01-01', '23:24:00', '06:44:00'),
('Macalester College', '2014-01-02', '23:41:00', '06:59:00'),
('Macalester College', '2014-01-01', '23:17:00', '07:22:00'),
('Macalester College', '2014-01-02', '23:37:00', '07:09:00'),
('Macalester College', '2014-01-03', '23:57:00', '06:48:00'),
('Macalester College', '2014-01-04', '00:16:00', '07:51:00'),
('Macalester College', '2014-01-05', '00:43:00', '05:51:00'),
('Macalester College', '2014-01-01', '23:18:00', '06:44:00'),
('Macalester College', '2014-01-02', '23:37:00', '07:18:00'),
('Macalester College', '2014-01-03', '00:03:00', '07:24:00'),
('Macalester College', '2014-01-04', '00:24:00', '06:02:00'),
('Macalester College', '2014-01-01', '23:16:00', '05:52:00'),
('Macalester College', '2014-01-02', '23:45:00', '07:14:00'),
('Macalester College', '2014-01-03', '00:04:00', '07:19:00'),
('Macalester College', '2014-01-04', '00:21:00', '07:47:00'),
('Macalester College', '2014-01-01', '23:21:00', '06:47:00'),
('Macalester College', '2014-01-02', '23:40:00', '07:41:00'),
('Macalester College', '2014-01-01', '23:18:00', '06:30:00'),
('Macalester College', '2014-01-02', '23:33:00', '07:22:00'),
('Macalester College', '2014-01-03', '00:04:00', '06:19:00'),
('Macalester College', '2014-01-01', '23:15:00', '07:23:00'),
('Macalester College', '2014-01-02', '23:39:00', '07:19:00'),
('Macalester College', '2014-01-03', '23:58:00', '06:45:00'),
('Macalester College', '2014-01-04', '00:18:00', '07:34:00'),
('Macalester College', '2014-01-01', '23:16:00', '07:07:00'),
('Macalester College', '2014-01-02', '23:36:00', '06:21:00'),
('Macalester College', '2014-01-03', '23:59:00', '07:06:00'),
('Macalester College', '2014-01-04', '00:24:00', '06:41:00'),
('Macalester College', '2014-01-05', '00:45:00', '07:08:00'),
('Macalester College', '2014-01-06', '00:59:00', '07:34:00'),
('Macalester College', '2014-01-07', '01:22:00', '07:15:00'),
('Macalester College', '2014-01-01', '23:23:00', '06:13:00'),
('Macalester College', '2014-01-02', '23:40:00', '07:22:00'),
('Macalester College', '2014-01-03', '00:07:00', '06:50:00'),
('Macalester College', '2014-01-04', '00:21:00', '07:25:00'),
('Macalester College', '2014-01-05', '00:41:00', '07:04:00'),
('Macalester College', '2014-01-06', '01:04:00', '06:37:00'),
('Macalester College', '2014-01-07', '01:16:00', '06:09:00'),
('Macalester College', '2014-01-01', '23:19:00', '06:01:00'),
('Macalester College', '2014-01-02', '23:36:00', '06:22:00'),
('Macalester College', '2014-01-03', '23:57:00', '07:43:00'),
('Macalester College', '2014-01-04', '00:22:00', '07:49:00'),
('Macalester College', '2014-01-05', '00:43:00', '06:23:00'),
('Macalester College', '2014-01-01', '23:22:00', '07:37:00'),
('Macalester College', '2014-01-02', '23:36:00', '06:54:00'),
('Macalester College', '2014-01-03', '23:56:00', '07:05:00'),
('Macalester College', '2014-01-04', '00:25:00', '06:45:00'),
('Macalester College', '2014-01-05', '00:34:00', '07:13:00'),
('Macalester College', '2014-01-06', '00:56:00', '07:25:00'),
('Macalester College', '2014-01-07', '01:19:00', '06:45:00'),
('Macalester College', '2014-01-01', '23:17:00', '06:49:00'),
('Macalester College', '2014-01-02', '23:40:00', '07:16:00'),
('Macalester College', '2014-01-03', '23:59:00', '06:59:00'),
('Macalester College', '2014-01-04', '00:23:00', '07:04:00'),
('Macalester College', '2014-01-01', '23:26:00', '07:20:00'),
('Macalester College', '2014-01-02', '23:45:00', '06:51:00'),
('Macalester College', '2014-01-03', '23:56:00', '06:52:00'),
('Macalester College', '2014-01-04', '00:21:00', '07:14:00'),
('Macalester College', '2014-01-01', '23:23:00', '06:31:00'),
('Macalester College', '2014-01-02', '23:33:00', '06:21:00'),
('Macalester College', '2014-01-03', '23:56:00', '07:57:00'),
('Macalester College', '2014-01-04', '00:23:00', '07:31:00'),
('Macalester College', '2014-01-05', '00:42:00', '07:18:00'),
('Macalester College', '2014-01-06', '01:00:00', '07:04:00'),
('Macalester College', '2014-01-01', '23:19:00', '06:48:00'),
('Macalester College', '2014-01-02', '23:44:00', '07:38:00'),
('Macalester College', '2014-01-03', '00:04:00', '06:09:00'),
('Macalester College', '2014-01-04', '00:17:00', '06:37:00'),
('Macalester College', '2014-01-05', '00:44:00', '06:36:00'),
('Macalester College', '2014-01-06', '00:57:00', '06:22:00'),
('Macalester College', '2014-01-07', '01:17:00', '07:15:00'),
('Macalester College', '2014-01-01', '23:22:00', '05:39:00'),
('Macalester College', '2014-01-02', '23:41:00', '07:35:00'),
('Macalester College', '2014-01-03', '00:03:00', '07:05:00'),
('Macalester College', '2014-01-01', '23:12:00', '07:02:00'),
('Macalester College', '2014-01-02', '23:39:00', '06:51:00'),
('Macalester College', '2014-01-03', '23:59:00', '06:44:00'),
('Macalester College', '2014-01-04', '00:21:00', '08:26:00'),
('Macalester College', '2014-01-05', '00:45:00', '06:35:00'),
('Macalester College', '2014-01-06', '00:59:00', '07:24:00'),
('Macalester College', '2014-01-07', '01:28:00', '07:12:00'),
('Macalester College', '2014-01-01', '23:21:00', '06:21:00'),
('Macalester College', '2014-01-02', '23:44:00', '07:02:00'),
('Macalester College', '2014-01-03', '23:56:00', '07:03:00'),
('Macalester College', '2014-01-04', '00:20:00', '07:10:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
