$(function () {
	var app = {
		debug: ko.observable(false),
		drawingDate: ko.observable('loading...'),
		nextDrawing: ko.observable('loading...'),
		pbDrawingDate: ko.observable('loading...'),
		pbNextDrawing: ko.observable('loading...'),
		onData: function (data) {
			var dd = data.biggame.nextdate.split('/');

			this.drawingDate(new Date(2000 + parseInt(dd[2], 10), dd[0] - 1, dd[1], 23, 0, 0, 0));
			this.nextDrawing("$" + data.biggame.nextestimate + "M");

			dd = data.powerball.nextdate.split('/');
			this.pbDrawingDate(new Date(2000 + parseInt(dd[2], 10), dd[0] - 1, dd[1], 23, 0, 0, 0));
			this.pbNextDrawing("$" + data.powerball.nextestimate + "M");

			if (location.search.indexOf("debug=1") >= 0) {
				this.debug(true);
				$('#message').text(JSON.stringify(data, null, '\t'));
			}
		}
	};

	function loadData() {
		$.ajax({
			url: "https://query.yahooapis.com/v1/public/yql",
			dataType: "jsonp",
			data: {
				q: "select * from xml where url='http://services.w3.org/tidy/tidy?docAddr=" +
					"http%3A%2F%2Fwww.state.nj.us%2Flottery%2Fdata%2Fwinning1.txt&forceXML=on'",
				format: 'json'
			},
			success: function (data) {
				console.log('writing respose to window.data');
				(function ($, data) {
					var r = {
						biggame: {},
						powerball: {}
					};
					data.query.results.html.body.trim().split(/&/).forEach(function (v, i) {
						var o;
						if (v.match(/^biggame|^powerball/)) {
							o = v.indexOf('powerball') === 0 ? r.powerball : r.biggame;
							o[v.split(/=/)[0]
								.replace(/powerball|biggame/, '')] = v.split(/=/)[1].trim();
						}
					});
					app.onData(r);
				}(jQuery, data));
			}
		});
	}

	$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1" />');
	$('head').append('<meta name="apple-mobile-web-app-capable" content="yes">');
	$('head').append('<meta name="apple-mobile-web-app-status-bar-style" content="default">');
	ko.applyBindings(app);
	loadData();
});
