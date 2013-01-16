var timeclock = (function() {
	var my = {};
	my.currentUser = 0;
	my.$select = null;
	my.$clockInBtn = null;
	my.$clockOutBtn = null;
	my.$history = null;

	my.init = function() {
		$.getJSON('api/?action=getUsers', function(users) {
			$.each(users, function(key, user) {
				my.$select.append('<option value="' + user.id + '">' + user.name + '</option>');
			});
		});
	};

	my.getStatus = function() {
		if (timeclock.currentUser > 0) {
			$.getJSON('api/?action=getStatus&user=' + my.currentUser, function(clock) {
				if (clock === null || (clock.clockIn !== null && clock.clockOut !== null) ) {
					my.$clockInBtn.removeAttr('disabled');
					my.$clockOutBtn.attr('disabled', 'disabled');
					updateStatus("Clocked out", clock.clockOut);
				} else {
					my.$clockOutBtn.removeAttr('disabled');
					my.$clockInBtn.attr('disabled', 'disabled');
					updateStatus("Clocked in", clock.clockIn);
				}
				my.getHistory();
			});
		} else {
			my.$clockInBtn.attr('disabled', 'disabled');
			my.$clockOutBtn.attr('disabled', 'disabled');
		}
	};

	my.clockIn = function(status) {
		$.get('api/', { action: "clockIn", user: my.currentUser })
		.error(function() { alert("error"); })
		.complete(function() { my.getStatus(); });
	};

	my.clockOut = function(status) {
		$.get('api/', { action: "clockOut", user: my.currentUser })
		.error(function() { alert("error"); })
		.complete(function() { my.getStatus(); });
	};

	my.getHistory = function() {
		$.getJSON('api/?action=getHistory&user=' + my.currentUser, function(clock) {
			timeclock.$history.find('tbody').empty();
			$.each(clock, function(key, row) {
				var clockOut = '';
				var timeSpan = '';
				if (row.clockOut !== null) {
					clockOut = Date.create(row.clockOut).format('{12hr}:{mm} {tt}');
					timeSpan = Date.range(row.clockIn, row.clockOut).duration();
					timeSpan = (timeSpan/3600000).round(2);
				}

				timeclock.$history.find('tbody').append('<tr><td>' + Date.create(row.clockIn).format('{Dow}, {Mon} {d}') + '</td><td>' + Date.create(row.clockIn).format('{12hr}:{mm} {tt}') + '</td><td>' + clockOut + '</td><td>' + timeSpan + '</td></tr>');
			});
		});
	}

	function updateStatus(status, time) {
		$('#current-status').empty().append('<p>' + status + ' ' + Date.create(time).relative(function(value, unit, ms, loc) {
			if (ms.abs() > (14).hour() && ms.abs() < (7).day()) {
				return 'on {Weekday} at {12hr}:{mm}{tt}';
			} else if (ms.abs() >= (7).day()) {
				return 'on {Weekday}, {Month} {d} at {12hr}:{mm}{tt}';
			}
		}));
	}

	return my;
}());

$(document).ready(function() {
	timeclock.$select = $('select');
	timeclock.$clockInBtn = $('#clockIn');
	timeclock.$clockOutBtn = $('#clockOut');
	timeclock.$history = $('#history');
	
	timeclock.init();

	timeclock.$select.change(function() {
		timeclock.currentUser = $(this).val();
		timeclock.getStatus();
	});

	timeclock.$clockInBtn.click(function(e) {
		e.preventDefault();
		timeclock.clockIn();
	});

	timeclock.$clockOutBtn.click(function(e) {
		e.preventDefault();
		timeclock.clockOut();
	});
});