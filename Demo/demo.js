/*jshint multistr: true */
(function () { // {{{

    function CountdownViewModel(params) {
        var self = this,
            update;
        this.now = ko.observable(params.now || new Date());
        this.day = ko.observable(0);
        this.hour = ko.observable(0);
        this.min = ko.observable(0);
        this.sec = ko.observable(0);
        this.millis = ko.observable(0);
        this.end = params.end;
        this.showDates = ko.observable(0);

        update = function () {
            var i,
            SEC = 1000,
                now = new Date(),
                end = new Date(self.end()),
                MIN = SEC * 60,
                HOUR = MIN * 60,
                DAY = HOUR * 24,
                day, hour, min, sec,
                that = self;

            i = +end - +now;
            i = i > 0 ? i : 0;
            day = Math.floor(i / DAY);
            i -= day * DAY;
            hour = Math.floor(i / HOUR);
            i -= hour * HOUR;
            min = Math.floor(i / MIN);
            i -= min * MIN;
            sec = Math.floor(i / SEC);
            i -= sec * SEC;

            self.now(now.toLocaleDateString() + ' ' + now.toLocaleTimeString());
            self.day(day);
            self.hour(hour);
            self.min(min);
            self.sec(sec);
            self.millis(i);
            self.end(end.toLocaleDateString() + ' ' + end.toLocaleTimeString());

            if (+end > +now) {
                setTimeout(function () {
                    update.apply(that);
                }, 500);
            }
        };

        this.update = update;
    }

    ko.components.register('countdown-widget', {
        viewModel: CountdownViewModel,
        template: '<table cellspacing="0"> \
    <tr data-bind="visible: showDates"> \
	<td colspan="4" data-bind="text: now"></td> \
    </tr> \
    <tr> \
	<th>day[s]</th> \
	<th>hour[s]</th> \
	<th>min[s]</th> \
	<th>sec[s]</th> \
    </tr> \
    <tr> \
<td data-bind="text: day"></td> \
	<td data-bind="text: hour"></td> \
	<td data-bind="text: min"></td> \
	<td data-bind="text: sec"></td> \
    </tr> \
    <tr data-bind="visible: showDates"> \
	<td colspan="4" data-bind="text: end"></td> \
    </tr> \
</table>'
    });

}()); // }}}

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
			ko.contextFor($('p:first table')[0]).$data.update();
			ko.contextFor($('p:last table')[0]).$data.update();
			$('.loading').removeClass('loading');
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
	$('head').append('<meta name="apple-mobile-web-app-status-bar-style" content="black">');

	ko.applyBindings(app);
	loadData();
    
	if(!window.navigator.standalone) {
		new QRCode(document.getElementById("qr"), window.location.toString());
	}
});
