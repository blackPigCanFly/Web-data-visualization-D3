// set the bar height (change here to change how wide each is)
const COL_HEIGHT = 18;

function gdsuccess(data, stateHashCode) {
    // clean up graph area
    cleanUpGraph();

    // update button text. display detail container if event types view
    if (currentDisplaying === MONTH) {
        // update the text
        $("#goBack span").text("Go Back to Year View");

        // display button
        $(".aboveGraph").slideDown();

        // remove all listener on the button
        $("#goBack").unbind();

        // add listener to button
        $("#goBack").click(function() {
            // hide button
            $(".aboveGraph").slideUp();
            // remove row highlighted state
            $("style[data-rowpressed]").remove();
            // hide graph container
            $("#graphContainer").fadeOut(400, function() {
                // after the fade out is completed, load the graph
                annualAjax();
            });
        });
    } else if (currentDisplaying === EVENT_TYPES) {
        // update the detail text
        $("#eventViewTE").text(data.totalEvents.toLocaleString("en"));
        $("#eventViewCE").text(data.customers.toLocaleString("en"));
        $("#eventViewAC").text(data.avgCustomers.toLocaleString("en"));
        $("#eventViewAD").text(data.avgDuration.toLocaleString("en"));
        $("#eventViewMaD").text(data.maxDuration.toLocaleString("en"));
        $("#eventViewMiD").text(data.minDuration.toLocaleString("en"));
        // display detail container 
        $("#eventViewDetailsContainer").css("display", "flex");;

        // update the button text
        $("#goBack span").text("Go Back to Month View");

        // display button
        $(".aboveGraph").slideDown();

        // remove all listener on the button
        $("#goBack").unbind();

        // add listener to button
        $("#goBack").click(function() {
            // hide legend
            $(".legend").fadeOut();

            // hide graph container
            $("#graphContainer").fadeOut(400, function() {
                // after the fade out is completed, load the graph
                monthlyAjax(currentYearDisplaying);
            });
        });
    }

    // hide load and display graph
    $("#gdload").hide();
    $("#graphContainer").fadeIn();

    // update the height of the graph area for fitting in bars
    if (currentDisplaying !== EVENT_TYPES) {
        updateIdBarDivHeight(data.length);
    } else {
        // is Event Types view
        updateIdBarDivHeight(9);
    }

    // update axis tags
    if (currentDisplaying === YEAR) {
        $(".x-axis-tag").text("Customer Effected");
        $(".y-axis-tag").text("Year");
    } else if (currentDisplaying === MONTH) {
        $(".x-axis-tag").text("Customer Effected");
        $(".y-axis-tag").text(`Month of ${currentYearDisplaying}`);
    } else if (currentDisplaying === EVENT_TYPES) {
        $(".x-axis-tag").text("Events");
        $(".y-axis-tag").text(`Event Type of ${toShortMonthName(data.month)} ${currentYearDisplaying}`);
    }

    // in month view, we change the cursor to pointer
    if (currentDisplaying === MONTH) {
        $("<style data-pointercursoronmonthlyview>")
            .text("div[data-barid]{cursor:pointer;}")
            .appendTo("head");
    } else {
        // remove the pointer cursor
        $("style[data-pointercursoronmonthlyview]").remove();
    }

    // find the biggest Customer Effected/Event type
    var largestCustomerEffected = 0;
    if (currentDisplaying !== EVENT_TYPES) {
        $.each(data,
            function(i, obj) {
                // year view or month view
                if (obj.customers > largestCustomerEffected) {
                    largestCustomerEffected = obj.customers;
                }
            });
    } else {
        // event type
        $.each(data.eventDetail,
            function(i, eventCount) {
                // year view or month view
                if (eventCount > largestCustomerEffected) {
                    largestCustomerEffected = eventCount;
                }
            });
    }

    // store the correct data for generating the graph
    var loopData;
    if (currentDisplaying !== EVENT_TYPES) {
        // year view/month view
        loopData = data;
    } else {
        loopData = data.eventDetail;
    }

    // used for delay animation, so that each bar animation goes sequentially
    var animationDelay = 0;
    // used for counting the index when it's event types view.
    var loopCount = 0;
    $.each(loopData,
        function(i, obj) {
            if (stateHashCode === lastRequestTime) { // make sure the process is still valid to process (did not switched to other views by user)
                // update the count (only applies to event types view)
                if (currentDisplaying === EVENT_TYPES) {
                    loopCount++;
                }
                // count the item number (of the loop) we up to
                var number;
                if (currentDisplaying !== EVENT_TYPES) {
                    number = i;
                } else {
                    number = loopCount - 1;
                }

                // the current customers count
                var customerCount;
                if (currentDisplaying !== EVENT_TYPES) {
                    customerCount = obj.customers;
                } else {
                    customerCount = obj;
                }

                // the current title for this bar
                var title;
                if (currentDisplaying === YEAR) {
                    title = obj.year;
                } else if (currentDisplaying === MONTH) {
                    title = toShortMonthName(obj.month);
                } else if (currentDisplaying === EVENT_TYPES) {
                    switch (i) {
                        case "customerEvent":
                            title = "Customer Event";
                            break;
                        case "digEvent":
                            title = "Dig Event";
                            break;
                        case "directedEvent":
                            title = "Directed";
                            break;
                        case "enviroEvent":
                            title = "Environment";
                            break;
                        case "equipEvent":
                            title = "Equipment";
                            break;
                        case "lightEvent":
                            title = "Lightning";
                            break;
                        case "opEvent":
                            title = "Operational";
                            break;
                        case "thirdParyEvent":
                            title = "Third Party";
                            break;
                        case "vandalEvent":
                            title = "Vandalism";
                            break;
                    }
                }

                var barPercentage = (customerCount / largestCustomerEffected) * 100;

                // container of bar
                var barMain = $("<div>").css({
                    "height": COL_HEIGHT,
                    "top": COL_HEIGHT * 0.5 + (COL_HEIGHT * 2) * number
                }).attr("title", title + ": " + customerCount.toLocaleString("en"));

                // real bar
                var bar = $("<div>").attr("data-barid", number).appendTo(barMain);
                // bar color
                if (currentDisplaying === YEAR) {
                    // for year view we will use opacity
                    // log(x * 10 + 1.4) / 2.7   <-- DRAW A GRAPH TO SEE WHAT THIS LOOKS LIKE
                    var opacity = Math.log((customerCount / largestCustomerEffected) * 10 + 1.4) / 2.7;
                    bar.css("opacity", opacity)
                        .hover(function() {
                            // hover on bar change opacity
                            bar.fadeTo(300, 1);
                        },
                        function() {
                            // go back
                            bar.fadeTo(300, opacity);
                        });
                } else {
                    // for month and event views
                    // draw a graph by yourself to check what the f(x) graph looks like
                    var colorR = Math.round(+3.0426392779333334e-7 * Math.pow(barPercentage, 5) -
                        0.00008089386865857301 * Math.pow(barPercentage, 4) +
                        0.007513986928104441 * Math.pow(barPercentage, 3) -
                        0.2865502023031387 * Math.pow(barPercentage, 2) +
                        5.052626828509123 * barPercentage +
                        117);
                    var colorG = colorR - 56;

                    bar.css("background-color", `rgb(${colorR},${colorG},0)`)
                        .hover(function() {
                            // hover on bar change color
                            bar.animate({ "background-color": "rgb(255,180,0)" }, 200);
                        },
                        function() {
                            // go back
                            bar.animate({ "background-color": `rgb(${colorR},${colorG},0)` }, 200);
                        });
                }



                // click event lister on each bar when it's month view
                if (currentDisplaying === MONTH) {
                    bar.click(function() {
                        $("#graphContainer").fadeOut(400,
                            function() {
                                // after the fade out is completed, load the graph
                                eventTypesAjax(obj.month);
                            });
                    });
                }

                // add breakdown types into bar (year view only)
                if (currentDisplaying === YEAR) {
                    $("<div>").addClass("thirdPartyBar").attr("title",
                        `Third Party: ${obj.eventDetail.thirdPartyEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.thirdPartyEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("digEventBar").attr("title",
                        `Dig Event: ${obj.eventDetail.digEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.digEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("environmentBar").attr("title",
                        `Environment: ${obj.eventDetail.enviroEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.enviroEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("lightningBar")
                        .attr("title", `Lighting: ${obj.eventDetail.lightEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.lightEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("operationalBar")
                        .attr("title", `Operational: ${obj.eventDetail.opEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.opEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("customerEventBar").attr("title",
                        `Customer Event: ${obj.eventDetail.customerEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.customerEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("vandalismBar")
                        .attr("title", `Vandalism: ${obj.eventDetail.vandalEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.vandalEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("equipmentBar")
                        .attr("title", `Equipment: ${obj.eventDetail.equipEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.equipEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                    $("<div>").addClass("directedBar").attr("title",
                        `Directed: ${obj.eventDetail.directedEvent.toLocaleString("en")}`)
                        .width((obj.eventDetail.directedEvent / obj.totalEvents) * 100 + "%").appendTo(bar);
                }

                // out bar text
                var textOuterV = $("<span>").text(customerCount.toLocaleString("en"))
                    .hide()
                    .appendTo(bar);

                // out bar text
                var outBar = $("<div>").css({
                    "width": (100 - barPercentage) + "%" // how long the bar is
                })
                    .addClass("outerBar")
                    .append(textOuterV.addClass("outerSpan"))
                    .appendTo(barMain);

                // text tags on y-axis
                var yAxisTag;
                var appendContentOnY;
                if (currentDisplaying !== EVENT_TYPES) {
                    yAxisTag = title;
                } else {
                    var circle = $("<div>").addClass("circle").attr("title", title);
                    switch (i) {
                        case "customerEvent":
                            appendContentOnY = circle.addClass("customerEventBar");
                            break;
                        case "digEvent":
                            appendContentOnY = circle.addClass("digEventBar");
                            break;
                        case "directedEvent":
                            appendContentOnY = circle.addClass("directedBar");
                            break;
                        case "enviroEvent":
                            appendContentOnY = circle.addClass("environmentBar");
                            break;
                        case "equipEvent":
                            appendContentOnY = circle.addClass("equipmentBar");
                            break;
                        case "lightEvent":
                            appendContentOnY = circle.addClass("lightningBar");
                            break;
                        case "opEvent":
                            appendContentOnY = circle.addClass("operationalBar");
                            break;
                        case "thirdParyEvent":
                            appendContentOnY = circle.addClass("thirdPartyBar");
                            break;
                        case "vandalEvent":
                            appendContentOnY = circle.addClass("vandalismBar");
                            break;
                    }
                }

                // update appendContentOnY for year and month view
                if (currentDisplaying !== EVENT_TYPES) {
                    appendContentOnY = $("<span>").text(yAxisTag);
                }

                $("<div>").addClass("axis y-axis-element")
                    .css({
                        "width": COL_HEIGHT,
                        "left": COL_HEIGHT * 0.5 + (COL_HEIGHT * 2) * number // add up the border to align
                    })
                    .append(appendContentOnY)
                    .appendTo($("#y"));

                // add to graph area
                barMain.appendTo($("#bar"));

                // animation starts
                bar.delay(animationDelay).animate({
                    "width": barPercentage + "%"
                },
                    barPercentage * 10,  // duration based on how long the bar is 
                    function() {
                        // animation complete:
                        // decide whether display inbar text or outbar text 
                        // and eventListener for updating this. 
                        // The lib of resize will fire at the beginning, so no need extra fire at the beginning
                        barMain.resize(function() {
                            updateTextStatus();
                        });
                    });
                // update animation delay
                animationDelay += (barPercentage * 10) * 0.6;

                // update the text next the bar (display or not display)
                function updateTextStatus() {
                    // for annual bar (displaying breakdown types)
                    if (textOuterV.width() < outBar.width() - 5) { // 5px padding on outBar
                        textOuterV.fadeIn();
                    } else {
                        // not enought space
                        textOuterV.fadeOut();
                    }
                }
            }
        });
}

function gdfail(data) {
    // display failed details into console
    console.log(data);

    if (currentDisplaying !== YEAR) {
        // show go back button
        $(".aboveGraph").slideDown();
    }

    $("#gdload").show();
    $("#gdload .loadFailed").show();
    $("#load").hide();

    // no need event lister, already defined in ppoAjax.js
}

function updateIdBarDivHeight(dataLength) {
    $("#bar").height(COL_HEIGHT * 0.3 + (COL_HEIGHT * 2) * dataLength);
}

function cleanUpGraph() {
    $("#y").empty();
    $("#bar").empty();

    // clean up event view details
    $("#eventViewDetailsContainer").removeAttr("style");
    $("#eventViewTE").empty();
    $("#eventViewCE").empty();
    $("#eventViewAC").empty();
    $("#eventViewAD").empty();
    $("#eventViewMaD").empty();
    $("#eventViewMiD").empty();
}

function toShortMonthName(monthNumber) {
    const months = [
        "", // what's the name of the zeroth month? ...
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    return months[monthNumber];
}