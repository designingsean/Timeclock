<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
date_default_timezone_set('America/New_York');
require_once 'meekrodb.2.1.class.php';
require_once 'db.config.php';
DB::$param_char = '%%';

switch ($_GET['action']) {

    //users
    case 'usersAdd' :
        //-add = add new employee
        //---pass in name (required)
        //---return success/fail
        if (isset($_GET['name'])) {
            $results = DB::insert('users', array('name' => $_GET['name']));
        }
    break;

    case 'usersGet' :
        //-get = employee drop down, list of active/inactive users
        //---pass in active (required)
        //---return id, name, active
        if (isset($_GET['active'])) {
            $results = DB::query('SELECT id, name, active FROM users WHERE active=%%s ORDER BY name ASC', $_GET['active']);
        }
    break;

    case 'usersUpdate' :
        // update = change status
        // pass in id (required)
        // return success/fail
        if (isset($_GET['id'])) {
            $results = DB::update('users', array('active' => DB::sqleval("NOT active")), 'id=%%s', $_GET['id']);
        }
    break;

    //clock
    case 'clockAdd' :
        //-add = clock in, add new
        //---pass in user id (required), time in (optional with default), time out (optional)
        //---return success/fail
        if (isset($_GET['user'])) {
            $columns = array();
            $columns['uid'] = $_GET['user'];
            $columns['clockIn'] = isset($_GET['start']) ? $_GET['start'] : date('Y-m-d H:i:s');
            $columns['clockOut'] = isset($_GET['end']) ? $_GET['end'] : NULL;
            $results = DB::insert('clock', $columns);
        }
    break;

    case 'clockGet' :
        //-get = current, past, report
        //---pass in start date (required), end date (required), user id (required)
        //---return id, user id, date, clock in, clock out
        if (isset($_GET['user']) && isset($_GET['start']) && isset($_GET['end'])) {
            $results = DB::query('SELECT id, DATE_FORMAT(clockIn, "%a, %b %e") as clockInDate, DATE_FORMAT(clockIn, "%l:%i %p") as clockInTime, DATE_FORMAT(clockOut, "%l:%i %p") as clockOutTime, ROUND(TIMESTAMPDIFF(MINUTE, clockIn, clockOut)/60, 2) as totalTime FROM clock WHERE uid=%%s AND (clockIn >= %%s AND clockIn < %%s) ORDER BY clockIn DESC', $_GET['user'], $_GET['start'], $_GET['end']);
        }
    break;

    case 'clockUpdate' :
        //-update = clock out, edit
        //---pass in id (required), time in (optional), time out (optional)
        //---return success/fail
        if (isset($_GET['id'])) {
            $columns = array();
            if (isset($_GET['start'])) {
                $columns['clockIn'] = $_GET['start'];
            }
            if (isset($_GET['end'])) {
                $columns['clockOut'] = $_GET['end'];
            }
            $results = DB::update('clock', $columns, "id=%%s", $_GET['id']);
        }
    break;

    case 'clockDelete' :
        //-delete = remove error
        //---pass in id (required)
        //---return success/fail
        if (isset($_GET['id'])) {
            $results = DB::delete('clock', "id=%%s", $_GET['id']);
        }
    break;

}

//return query results as JSON
echo json_encode($results);