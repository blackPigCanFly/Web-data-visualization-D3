var currentDisplaying = 0;
var currentYearDisplaying = 0;
var currentMonthDisplaying = 0;
var lastRequestTime = 0; // to avoid function collision, we use the time to check

const YEAR = 1;
const MONTH = 2;
const EVENT_TYPES = 3;

var yearData;
var monthData = {};

$(document).ready(function () {
    // start loading data on page ready
    $(document).ready(annualAjax());

    // reload event on click
    $(".loadFailed").click(function () { reload() });
});

// load
function annualAjax() {
    currentDisplaying = YEAR;
    currentYearDisplaying = 0;
    currentMonthDisplaying = 0;

    if (yearData == undefined) {
        $.ajax({
            url: "/api/AnnualPowerInterruptions",
            method: "GET",
            dataType: "json",
            timeout: 3000, // 3000 for reducing fail rate
            success: annualSuccess,
            error: annualFailed
        });
    } else {
        annualSuccess(yearData, true);
        currentYearDisplaying = 0;
    }
}

function annualSuccess(data, doNotUpdateTable) {
    // save to cache
    yearData = data;
    if (doNotUpdateTable !== true) {
        tbdsuccess(data);
    }
    lastRequestTime = (new Date()).getTime();
    gdsuccess(data, lastRequestTime);
    // show legend
    $(".legend").fadeIn();
}

function annualFailed(data) {
    tbdfail(data);
    gdfail(data);
}

function reload() {
    // table initialise
    $("#tableData .loadFailed").hide();
    $("#tbdload > .col-sm-12").show();
    // graph initialise
    $("#gdload .loadFailed").hide();
    $("#load").show();

    if (currentDisplaying === YEAR) {
        // table initialise
        $("#tbdload").show();
        $("#tbdbody").empty();

        // retry
        annualAjax();
    } else if (currentDisplaying === MONTH) {
        monthlyAjax(currentYearDisplaying);
    } // Event type view won't fail because the data is from month view's cache
}

// load
function monthlyAjax(year) {
    currentDisplaying = MONTH;
    currentYearDisplaying = year;
    currentMonthDisplaying = 0;

    // have a hide of the back button for better appearance
    $(".aboveGraph").slideUp(400, function () {
        // start loading after the slide up animation is completed
        if (monthData[year] == undefined) {
            // no cache, get data from server
            $.ajax({
                url: `api/MonthlyPowerInterruptions/${year}`,
                method: "GET",
                dataType: "json",
                timeout: 3000,
                success: monthlySuccess,
                error: monthlyFailed
            });
            // show loading
            $("#gdload").fadeIn();
        } else {
            // has cache
            monthlySuccess(monthData[year]);
        }
    });
}

function monthlySuccess(data) {
    // save the data for cache
    monthData[currentYearDisplaying] = data;
    lastRequestTime = (new Date()).getTime();
    gdsuccess(data, lastRequestTime);
}

function monthlyFailed(data) {
    // just makes the code clear
    gdfail(data);
}

// not an ajax, just for easy understanding (means updating data)
function eventTypesAjax(month) {
    currentMonthDisplaying = month;
    currentDisplaying = EVENT_TYPES;

    // have a hide of the back button for better appearance
    $(".aboveGraph").slideUp(400,
        function() {
            // start loading after the slide up animation is completed
            lastRequestTime = (new Date()).getTime();
            gdsuccess(monthData[currentYearDisplaying][month - 1], lastRequestTime);
            // show legend
            $(".legend").fadeIn();
        });
}