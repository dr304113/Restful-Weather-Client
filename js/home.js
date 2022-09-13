$(document).ready(function () {
    loadCurrentCondition();
});

function loadCurrentCondition() {

    $('#getWeatherButton').click(function (event) {
        if ($('#zipField').val().length != 5) {
            displayError('Zipcode: Please enter a 5-digit zip code');
        } else {
            var haveValidationErrors = checkAndDisplayValidationErrors($('#zipField').find('input'));

            if (haveValidationErrors) {
                return false;
            }
            $('#errorMessages').empty();
            $('resultsContainer').show();
            clearDataColumns();
            var zipCode = $('#zipField').val();
            var units = $('#unitSelector').val();
            var degree = "";
            var mUnit = "";
            $.ajax({
                type: 'GET',
                url: 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + '&appid=80d6b78bfe4523c35d26ffeefbb96fc2&units=' + units,
                success: function (data, status) {
                    if ($('#unitSelector').val() == 'Imperial') {
                        degree = " F";
                        mUnit = " miles/hour"
                    } else {
                        degree = " C";
                        mUnit = " kilometers/hour";
                    }
                    var city = data.name;
                    var humidity = data.main.humidity;
                    var wind = data.wind.speed;
                    var temp = data.main.temp;
                    var icon = data.weather[0].icon;
                    var des = data.weather[0].main + " : " + data.weather[0].description;

                    var header = 'Current Condition in ' + city;
                    var image = 'http://openweathermap.org/img/w/' + icon + '.png';
                    $('#iconAndDescriptionColumn').append('<p><img src="' + image + '">' + des + '</p>');
                    $('#currentConditionsHeader').append(header);
                    $('#tempHumidityWindDataColumn').append('<p>Temperature: ' + temp + degree + '<br> Humidity: ' + humidity + ' %<br>Wind: ' + wind + mUnit + '</p>');
                    $('#resultsContainer').show();
                    loadForecast(zipCode, units, degree);
                },
                error: function () {
                    displayError('Error calling web service. Please try again later.');
                }
            })
        }
    });
}

function loadForecast(zipCode, units, degree) {
    var counter = 1;
    var dayCounter = 0;
    $.ajax({
        type: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast?zip=' + zipCode + '&appid=80d6b78bfe4523c35d26ffeefbb96fc2&units=' + units,
        success: function (data) {
            $.each(data.list, (index, day) => {
                dayCounter++;
                if (dayCounter % 8 == 0) {

                    var d = new Date(day.dt_txt);
                    var time = new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(d);
                    var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
                    var dayNumber = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(d);

                    var icon = day.weather[0].icon;
                    var des = day.weather[0].main;
                    var image = 'http://openweathermap.org/img/w/' + icon + '.png';


                    var dataHigh = day.main.temp_max + " " + degree;
                    var dataLow = day.main.temp_min + " " + degree;

                    if (dayNumber.startsWith(0)) {
                        dayNumber = dayNumber.slice(1);
                    }

                    var id = '#day' + counter;

                    var row = '<p>' + monthName + " " + dayNumber + '</p>';
                    row += '<p><img src="' + image + '">' + des + '</p>';
                    row += '<p>H ' + dataHigh + ' L ' + dataLow;

                    $(id).append(row);

                    counter++;
                }
            })
        },
        error: function () {
            displayError('Error calling web service. Please try again later.');
        }
    });
}

function clearDataColumns() {
    $('#currentConditionsHeader').empty();
    $('#tempHumidityWindDataColumn').empty();
    $('#iconAndDescriptionColumn').empty();
    $('#day1').empty();
    $('#day2').empty();
    $('#day3').empty();
    $('#day4').empty();
    $('#day5').empty();
}

function displayError(message) {
    $('#errorMessages')
        .append($('<li>')
            .attr({ class: 'list-group-item list-group-item-danger' })
            .text(message));
}

function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        return true;
    } else {
        return false;
    }
}

