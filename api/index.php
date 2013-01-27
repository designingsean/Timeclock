<?php
date_default_timezone_set('America/New_York');
require_once 'meekrodb.2.1.class.php';
require_once 'db.config.php';
DB::$param_char = '%%';

$action = $_GET['action'];
if (isset($_GET['user'])) {
	$user = $_GET['user'];
}

function getTimes($user, $start, $end) {
	return DB::query('SELECT DATE_FORMAT(clockIn, "%a, %b %e") as clockInDate, DATE_FORMAT(clockIn, "%l:%i %p") as clockInTime, DATE_FORMAT(clockOut, "%l:%i %p") as clockOutTime, ROUND(TIMESTAMPDIFF(MINUTE, clockIn, clockOut)/60, 2) as totalTime FROM clock WHERE uid=%%s AND (clockIn >= %%s AND clockIn < %%s) ORDER BY clockIn DESC', $user, $start, $end);
}

switch ($action) {
	case 'getUsers' :
		$results = DB::query('SELECT id, name FROM users WHERE active=1 ORDER BY name ASC');
		echo json_encode($results);
		break;
	case 'getStatus' :
		$results = DB::queryFirstRow('SELECT clockIn, clockOut FROM clock WHERE uid=%%s ORDER BY clockIn DESC', $user);
		echo json_encode($results);
		break;
	case 'getCurrent' :
		if ((date('W') % 2) == 0) {
			if (date('w') == 1) {
				$startDateW1 = date('y-m-d', strtotime('today'));
			} else {
				$startDateW1 = date('y-m-d', strtotime('last Monday'));
			}
			$endDateW1 = date('y-m-d', strtotime('next Monday'));
			$startDateW2 = date('y-m-d', strtotime('next Monday'));
			$endDateW2 = date('y-m-d', strtotime('next Monday +1 week'));
		} else {
			$startDateW1 = date('y-m-d', strtotime('last Monday -1 week'));
			if (date('w') == 1) {
				$endDateW1 = date('y-m-d', strtotime('today'));
				$startDateW2 = date('y-m-d', strtotime('today'));
			} else {
				$endDateW1 = date('y-m-d', strtotime('last Monday'));
				$startDateW2 = date('y-m-d', strtotime('last Monday'));
			}
			$endDateW2 = date('y-m-d', strtotime('next Monday'));
		}
		$results = array(getTimes($user, $startDateW2, $endDateW2), getTimes($user, $startDateW1, $endDateW1));
		echo json_encode($results);
		break;
	case 'getPrevious' :
		if ((date('W') % 2) == 0) {
			$startDateW1 = date('y-m-d', strtotime('last Monday -2 week'));
			$endDateW1 = date('y-m-d', strtotime('last Monday -1 week'));
			$startDateW2 = date('y-m-d', strtotime('last Monday -1 week'));
			if (date('w') == 1) {
				$endDateW2 = date('y-m-d', strtotime('today'));
			} else {
				$endDateW2 = date('y-m-d', strtotime('last Monday'));
			}
		} else {
			$startDateW1 = date('y-m-d', strtotime('last Monday -3 week'));
			$endDateW1 = date('y-m-d', strtotime('last Monday -2 week'));
			$startDateW2 = date('y-m-d', strtotime('last Monday -2 week'));
			$endDateW2 = date('y-m-d', strtotime('last Monday -1 week'));
		}
		$results = array(getTimes($user, $startDateW2, $endDateW2), getTimes($user, $startDateW1, $endDateW1));
		echo json_encode($results);
		break;
	case 'clockIn' :
		DB::insert('clock', array(
			'uid' => $user,
			'clockIn' => date('Y-m-d H:i:s')
		));
		break;
	case 'clockOut' :
		$results = DB::queryFirstRow('SELECT id FROM clock WHERE uid=%%s ORDER BY id DESC', $user);
		DB::update('clock', array(
			'clockOut' => date('Y-m-d H:i:s'),
		), 'id=%%s', $results['id']);
		break;
}
?>