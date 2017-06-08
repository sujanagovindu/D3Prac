"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var app_service_1 = require("./app.service");
var d3 = require("d3");
var chart_1 = require("./chart");
var AppComponent = (function () {
    function AppComponent(element, appService) {
        this.element = element;
        this.appService = appService;
        this.chartData = chart_1.ChartDataArray;
        this.margin = { top: 20, right: 20, bottom: 110, left: 40 };
        this.margin2 = { top: 430, right: 20, bottom: 50, left: 40 };
        this.htmlElement = this.element.nativeElement;
        this.host = d3.select(this.element.nativeElement);
        //this.element = chartContainer.nativeElement;
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        this.buildSVG();
    };
    AppComponent.prototype.ngOnChanges = function () {
    };
    /**
* We can now build our SVG element using the configurations we created
**/
    AppComponent.prototype.buildSVG = function () {
        var _this = this;
        this.svgWidth = 960;
        this.svgHeight = 500;
        this.width = this.svgWidth - this.margin.left - this.margin.right;
        this.height = this.svgHeight - this.margin.top - this.margin.bottom,
            this.height2 = this.svgHeight - this.margin2.top - this.margin2.bottom;
        this.host.html('');
        this.container = this.host.append('div')
            .attr('id', 'GraphContainer');
        this.svg = this.container.append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        var parseDate = d3.timeParse("%b %Y");
        var x = d3.scaleTime().range([0, this.width]), x2 = d3.scaleTime().range([0, this.width]), y = d3.scaleLinear().range([this.height, 0]), y2 = d3.scaleLinear().range([this.height2, 0]);
        var xAxis = d3.axisBottom(x), xAxis2 = d3.axisBottom(x2), yAxis = d3.axisLeft(y);
        var brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on("brush end", function (datum) {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
                return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            _this.svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(_this.width / (s[1] - s[0]))
                .translate(-s[0], 0));
        });
        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", function (datum) {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
                return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        });
        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x(parseDate(d.date)); })
            .y0(this.height)
            .y1(function (d) { return y(+(d.price)); });
        var area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2(parseDate(d.date)); })
            .y0(this.height2)
            .y1(function (d) { return y2(+(d.price)); });
        this.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);
        var focus = this.svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        var context = this.svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");
        x.domain(d3.extent(this.chartData, function (d) { return parseDate(d.date); }));
        y.domain([0, d3.max(this.chartData, function (d) { return (+(d.price)); })]);
        x2.domain(x.domain());
        y2.domain(y.domain());
        focus.append("path")
            .datum(this.chartData)
            .attr("class", "area")
            .attr("d", area);
        context.append("path")
            .datum(this.chartData)
            .attr("class", "area")
            .attr("d", area2);
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height2 + ")")
            .call(xAxis2);
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());
        this.svg.append("rect")
            .attr("class", "zoom")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
            .call(zoom);
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('chart'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "chartContainer", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "",
        providers: [app_service_1.AppService]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, app_service_1.AppService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map