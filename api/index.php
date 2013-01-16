<?php
require_once 'meekrodb.2.1.class.php';
require_once 'db.config.php';

$action = $_GET['action'];
if (isset($_GET['user'])) {
	$user = $_GET['user'];
}

switch ($action) {
	case 'getUsers' :
		$results = DB::query('SELECT id, name FROM users WHERE active=1');
		echo json_encode($results);
		break;
	case 'getStatus' :
		$results = DB::queryFirstRow('SELECT clockIn, clockOut FROM clock WHERE uid=%s ORDER BY id DESC', $user);
		echo json_encode($results);
		break;
	case 'getHistory' :
		$results = DB::query('SELECT clockIn, clockOut FROM clock WHERE uid=%s ORDER BY id DESC', $user);
		echo json_encode($results);
		break;
	case 'clockIn' :
		DB::insert('clock', array(
			'uid' => $user,
			'clockIn' => date('Y-m-d H:i:s')
		));
		break;
	case 'clockOut' :
		$results = DB::queryFirstRow('SELECT id FROM clock WHERE uid=%s ORDER BY id DESC', $user);
		DB::update('clock', array(
			'clockOut' => date('Y-m-d H:i:s'),
		), 'id=%s', $results['id']);
		break;
}
?>