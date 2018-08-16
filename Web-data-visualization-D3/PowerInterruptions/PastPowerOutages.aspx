<%@ Page Title="PastPowerOutages" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="PastPowerOutages.aspx.cs" Inherits="PowerInterruptions.PastPowerOutages" %>

<asp:Content ID="Content1" ContentPlaceHolderID="CPHead" runat="server">
    <link href="/Content/PastPowerOutage/main.css" rel="stylesheet" />
    <link href="/Content/PastPowerOutage/tableData.css" rel="stylesheet" />
    <link href="/Content/PastPowerOutage/graphData.css" rel="stylesheet" />
    <link href="/Content/font-awesome.css" rel="stylesheet" />
    <link href="Content/PastPowerOutage/barStyles.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="CPBody" runat="server">
    <div id="tableData" class="container float-left">
        <div class="row text-center title">
            <div class="col-sm-3"><span>Year</span></div>
            <div class="col-sm-3"><span>Events</span></div>
            <div class="col-sm-3"><span>Customers</span></div>
            <div class="col-sm-3"><span>Duration</span></div>
        </div>
        <div id="tbdload" class="row text-center">
            <div class="col-sm-12">
                <img src="/Images/loading.svg" alt="Loading" />&nbsp;Loading Data... 
            </div>
        </div>
        <div class="row text-center loadFailed">
            <div class="col-sm-12">
                <i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load Failed to load Power Interruption Data, Click to Retry.
            </div>
        </div>
        <div id="tbdbody">
        </div>
    </div>
    <div class="aboveGraph container float-right">
        <button type="button" id="goBack" class="btn btn-secondary btn-sm">
            <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;<span>Go Back to Year View</span>
        </button>
        <div id="eventViewDetailsContainer" class="row">
            <div class="col-lg-6">
                <div class="col-md-12">Total Events: <span id="eventViewTE"></span></div>
                <div class="col-md-12">Customer Effected: <span id="eventViewCE"></span></div>
                <div class="col-md-12">Average Customers: <span id="eventViewAC"></span></div>
            </div>
            <div class="col-lg-6">
                <div class="col-md-12">Average Duration: <span id="eventViewAD"></span></div>
                <div class="col-md-12">Maximum Duration: <span id="eventViewMaD"></span></div>
                <div class="col-md-12">Minimum Duration: <span id="eventViewMiD"></span></div>
            </div>
        </div>
    </div>
    <div id="graphData" class="container float-right">
        <div id="gdload" class="row text-center">
            <div id="load" class="col-sm-12">
                <img src="/Images/loading.svg" alt="Loading" />&nbsp;Loading Data... 
            </div>
            <div class="row text-center loadFailed">
                <div class="col-sm-12">
                    <i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load Failed to load Power Interruption Data, Click to Retry.
                </div>
            </div>
        </div>
        <div id="graphContainer">
            <div class="float-left axis y-axis-tag">Year</div>
            <div id="y" class="text-center axis y-axis"></div>
            <div id="bar">
            </div>
            <div class="float-right text-right axis x-axis-tag">Customer Effected</div>
        </div>
        <div class="legend">
            <div class="col-md-12"><span>Third Party</span><span class="thirdPartyBar"></span></div>
            <div class="col-md-12"><span>Dig Event</span><span class="digEventBar"></span></div>
            <div class="col-md-12"><span>Environment</span><span class="environmentBar"></span></div>
            <div class="col-md-12"><span>Lightning</span><span class="lightningBar"></span></div>
            <div class="col-md-12"><span>Operational</span><span class="operationalBar"></span></div>
            <div class="col-md-12"><span>Customer Event</span><span class="customerEventBar"></span></div>
            <div class="col-md-12"><span>Vandalism</span><span class="vandalismBar"></span></div>
            <div class="col-md-12"><span>Equipment</span><span class="equipmentBar"></span></div>
            <div class="col-md-12"><span>Directed</span><span class="directedBar"></span></div>
        </div>
    </div>

    <script src="/Scripts/jquery.resize.js"></script>
    <script src="/Scripts/PPO/tableData.js"></script>
    <script src="/Scripts/PPO/graphData.js"></script>
    <script src="/Scripts/PPO/ppoAjax.js"></script>
</asp:Content>
