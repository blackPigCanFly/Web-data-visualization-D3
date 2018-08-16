function tbdsuccess(data) {
    // success, hide load
    $("#tbdload").hide();

    // height adjust on .detail 
    var detailStyle = $("<style data-detailused>");

    // for each data
    $.each(data,
        function (i, obj) {
            // year (each basic row) starts
            var oneYear = $("<div>").addClass("row text-center basic")
                .attr("data-row", i)
                .click(function () { // click to show monthly data in graph
                    if (currentYearDisplaying !== obj.year) {
                        // clean up
                        $("style[data-rowpressed]").remove();

                        // let the row highlighted
                        $("<style data-rowpressed>")
                            .text(`.basic[data-row="${i}"]{background: rgba(255, 255, 255, 0.5);}`).appendTo("head");

                        // hide legend
                        $(".legend").fadeOut();

                        $("#graphContainer").fadeOut(400,
                            function() {
                                // after the fade out is completed, load the graph
                                monthlyAjax(obj.year);
                            });
                    } else {
                        // if click the same row, trigger goBack button
                        $("#goBack").trigger("click");
                    }
                });
            // Year
            $("<div>").addClass("col-sm-3")
                .append($("<span>").text(obj.year))
                .appendTo(oneYear);
            // Events
            $("<div>").addClass("col-sm-3")
                .append($("<span>").text(obj.totalEvents.toLocaleString("en")))
                .appendTo(oneYear);
            // Customers
            $("<div>").addClass("col-sm-3")
                .append($("<span>").text(obj.customers.toLocaleString("en")))
                .appendTo(oneYear);
            // Duration
            $("<div>").addClass("col-sm-3")
                .append($("<span>").text(obj.avgDuration.toLocaleString("en")))
                .appendTo(oneYear);
            oneYear.appendTo($("#tbdbody"));
            // year (each basic row) ends

            // info (dropdown) starts
            var dddetail = $("<div>").addClass("row detail")
                .attr("data-detailid", i);
            // LEFT col
            var left = $("<div>").addClass("col-md-6");
            // 3rd party
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`3rd Pty: ${obj.eventDetail.thirdPartyEvent.toLocaleString("en")}`)
                    .attr("title", "Third Party")
                    .prepend($("<i class=\"fa fa-meh-o\" aria-hidden=\"true\"></i>")))
                .appendTo(left);
            // dig event
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Dig Ev.: ${obj.eventDetail.digEvent.toLocaleString("en")}`)
                    .attr("title", "Dig Event")
                    .prepend($("<i class=\"fa fa-building-o\" aria-hidden=\"true\"></i>")))
                .appendTo(left);
            // enviro
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Env.: ${obj.eventDetail.enviroEvent.toLocaleString("en")}`)
                    .attr("title", "Environment")
                    .prepend($("<i class=\"fa fa-tree\" aria-hidden=\"true\"></i>")))
                .appendTo(left);
            // lightning
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Ltg.: ${obj.eventDetail.lightEvent.toLocaleString("en")}`)
                    .attr("title", "Lighting")
                    .prepend($("<i class=\"fa fa-bolt\" aria-hidden=\"true\"></i>")))
                .appendTo(left);
            // operational
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Oper.: ${obj.eventDetail.opEvent.toLocaleString("en")}`)
                    .attr("title", "Operational")
                    .prepend($("<i class=\"fa fa-wrench\" aria-hidden=\"true\"></i>")))
                .appendTo(left);
            // append
            left.appendTo(dddetail);
            // LEFT col ends
            // RIGHT col
            var right = $("<div>").addClass("col-md-6");
            // customer event
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Cus. Ev.: ${obj.eventDetail.customerEvent.toLocaleString("en")}`)
                    .attr("title", "Customer Event")
                    .prepend($("<i class=\"fa fa-user-circle-o\" aria-hidden=\"true\"></i>")))
                .appendTo(right);
            // vandalism
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Vand.: ${obj.eventDetail.vandalEvent.toLocaleString("en")}`)
                    .attr("title", "Vandalism")
                    .prepend($("<i class=\"fa fa-user-times\" aria-hidden=\"true\"></i>")))
                .appendTo(right);
            // equipment
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Eqpt.: ${obj.eventDetail.equipEvent.toLocaleString("en")}`)
                    .attr("title", "Equipment")
                    .prepend($("<i class=\"fa fa-cogs\" aria-hidden=\"true\"></i>")))
                .appendTo(right);
            // directed
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-12")
                    .text(`Dir.: ${obj.eventDetail.directedEvent.toLocaleString("en")}`)
                    .attr("title", "Directed")
                    .prepend($("<i class=\"fa fa-check-square-o\" aria-hidden=\"true\"></i>")))
                .appendTo(right);
            // append
            right.appendTo(dddetail);
            // RIGHT col ends
            dddetail.appendTo($("#tbdbody"));

            function calcDetailHeight() {
                // get real height 
                var height = dddetail.css({ "height": "initial" }).outerHeight();
                dddetail.removeAttr("style");
                // add styles
                // hover on normal line
                detailStyle.append(`#tbdbody div[data-row="${i}"]:hover + .detail{height:${height}px;margin:8px;}`);
                // hover on detail area as well
                detailStyle.append(`.detail[data-detailid="${i}"]:hover{height:${height}px;margin:8px;}`);
            }

            calcDetailHeight();

            // update on resize
            $(window).resize(function () {
                if (i === 0) {
                    // only if it's the first time to call, then empty the old style
                    detailStyle.empty();
                }
                calcDetailHeight();
            });
            // info (dropdown) ends 

            // hover on row event, highlight corresponding year graph
            oneYear.hover(function () {
                rowMouseIn();
            }, function () {
                rowMouseOut();
            });
            dddetail.hover(function () {
                rowMouseIn();
            }, function () {
                rowMouseOut();
            });

            function rowMouseIn() {
                if (currentDisplaying === YEAR) {
                    $("<style data-tablegraphconnect>")
                        .text(`div[data-barid="${i}"] > div{background-color:white!important;}div[data-barid="${i}"]{opacity:1!important}`)
                        .appendTo("head");
                }
            }
            function rowMouseOut() {
                $("style[data-tablegraphconnect]").remove();
            }


        });
    detailStyle.appendTo("head");
}

function tbdfail(data) {
    // display failed details into console
    console.log(data);

    // clear up tableData
    $("#tbdbody").empty();
    // hide load
    $("#tbdload > .col-sm-12").hide();
    // show failed info
    $("#tableData .loadFailed").show();

    // no need event lister, already defined in ppoAjax.js
}