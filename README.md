Timeclock
=========
A simple time clock application for hourly employees

NOTE: I am currently rebuilding this app, and so it really isn't ready for production.

License
=======
[![Creative Commons by-sa](http://i.creativecommons.org/l/by-sa/3.0/us/88x31.png)](http://creativecommons.org/licenses/by-sa/3.0/us/deed.en_US)

Timeclock by [Sean Ryan](http://designingsean.com) is licensed under a [Creative Commons Attribution-ShareAlike 3.0 United States License](http://creativecommons.org/licenses/by-sa/3.0/us/deed.en_US).

Required Libraries
==================
jQuery 1.8.3

AngularJS 1.0.7

MomentJS 2.0.0

Meekro 2.1

Database Structure
==================
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

Misc.
=====
db.config.php file omitted for obvious reasons. Format is below:

	DB::$user = 'DBUSER';
	DB::$password = 'DBPASS';
	DB::$dbName = 'DBNAME';