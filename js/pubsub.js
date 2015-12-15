// Creating Oservable/Pub-Sub - Implement Subscribe, Unsubscribe and publish.

(function($) {

    // Observable Constructor
    function Observable() {
        this.events = {};
    }

    Observable.prototype = {
        Subscribe: function(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
        },
        Unsubscribe: function(eventName, callback) {
            if (events[eventName]) {
				for (var i = 0; i < events[eventName].length; i++) {
					if (events[eventName][i] == callback) {
                        events[eventName].splice(i, 1);
                    }
                }
            }
        },
        publish: function(eventName, obj) {
            this.events[eventName].forEach(function(fn) {
                fn(obj);
            })
        }
    }

    // Car Constructor
    function Car(fuel) {
        var fuel;
        var distance = 0;
        this.setFuel = function(f) {
            fuel = f;
        }
        this.getFuel = function() {
            return fuel;
        }
        this.setDistance = function(dis) {
            distance = dis;
        }
        this.move = function() {
            var self = this;

            function fuelSensor() {
                setTimeout(function() {
                    self.setFuel(self.getFuel() - 1);
                    self.publish('consumeFuel', self);
                    distance = distance + 100;
                    $('#car-conatiner').css('left', distance + '');
                    self.getFuel() <= 0 ? self.publish('nofuel') : fuelSensor();
                }, 1000);
            }
            fuelSensor();
        }
    }

    // Create Observable object
    var observable = new Observable();
    // Car extends observable oject
    Car.prototype = observable;

    function changeFuelLoad() {
        $('#indicator-red').css('width', $('#fuel').val() * 10 + '');
    }

    function consumeFuel(self) {
        $('#indicator-red').css('width', self.getFuel() * 10 + '');
    }

    function reset() {
        $('#car-conatiner').css('left', '0');
        $('#indicator-red').css('width', '10');
        $('#fuel option[value=1]').attr('selected', true);
    }

    function nofuel() {
        console.log('Fuel got ended.');
        $('#reset').removeAttr('disabled');
        setTimeout(function() {
            $('#smoke').attr('src', 'images/smoke_blank.jpg')
        }, 800);
    }

    $(document).ready(function() {
        var c1 = new Car();

        // Subcribing to events
        c1.Subscribe('changeFuelLoad', changeFuelLoad);
        c1.Subscribe('consumeFuel', consumeFuel);
        c1.Subscribe('nofuel', nofuel);
        c1.Subscribe('reset', reset);
        $('#go').on('click', function() {
            $('#smoke').attr('src', 'images/smoke.gif');
            $('#reset').attr('disabled', 'disabled');
            c1.setFuel($('#fuel').val());
            c1.move();
        });

        $('#reset').on('click', function() {
            c1.publish('reset');
            c1.setDistance(0);
        });

        $('#fuel').on('change', function() {
            $(this).val();
            c1.publish('changeFuelLoad');
        });
    });
})(jQuery);

