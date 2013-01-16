Timeclock
=========

A simple time clock application for hourly employees

Required Libraries
==================

jQuery 1.8.3

Sugar JS 1.3.8

Meekro 2.1

Database Structure
==================

Database name: timeclock

User table:
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

Timeclock table:
CREATE TABLE `clock` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `clockIn` datetime NOT NULL,
  `clockOut` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
