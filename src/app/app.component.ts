import { Component, OnInit, AfterViewInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { AppService } from './app.service';
import * as d3 from 'd3';
import * as tw from 'angular-in-memory-web-api';
import { ChartDataArray } from './chart';

@Component({
  selector: 'my-app',
  template: ``,
  providers: [AppService]
})
export class AppComponent implements OnInit, AfterViewInit, OnChanges{
    @ViewChild('chart') chartContainer: ElementRef;
    
    private host: any;
    private svg: any;
    private container: any;

    private svgWidth: any;
    private svgHeight: any;
    private width: any;
    private height: any;
    private height2: any;
    private xScale: any;
    private yScale: any;
    private xAxis: any;
    private yAxis: any;
    private htmlElement: HTMLElement;


    private chartData: Array<{ date: string, price: string }> = ChartDataArray;
 
    private margin: any = { top: 20, right: 20, bottom: 110, left: 40 };
    private margin2: any = { top: 430, right: 20, bottom: 50, left: 40 };
    private chart: any;

    private msg: any

    constructor(private element: ElementRef, private appService: AppService) {
        this.htmlElement = this.element.nativeElement;
        this.host = d3.select(this.element.nativeElement);

        
        //this.element = chartContainer.nativeElement;
    }


    ngOnInit(): void {

    }
    ngAfterViewInit() {
        this.buildSVG();
 
    }

    ngOnChanges() {

    }


    /**
* We can now build our SVG element using the configurations we created
**/
    private buildSVG(): void {

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
            
       

        let parseDate = d3.timeParse("%b %Y");



        let x = d3.scaleTime().range([0, this.width]),
            x2 = d3.scaleTime().range([0, this.width]),
            y = d3.scaleLinear().range([this.height, 0]),
            y2 = d3.scaleLinear().range([this.height2, 0]);

        let xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on("brush end", (datum: any) => {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
                let s = d3.event.selection || x2.range();
                x.domain(s.map(x2.invert, x2));
                focus.select(".area").attr("d", area);
                focus.select(".axis--x").call(xAxis);
                this.svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(this.width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            });

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", (datum: any) => {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
                var t = d3.event.transform;
                x.domain(t.rescaleX(x2).domain());
                focus.select(".area").attr("d", area);
                focus.select(".axis--x").call(xAxis);
                context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            });

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x((d: any) => x(parseDate(d.date)))            
            .y0(this.height)
            .y1((d: any) => y(+(d.price)));

        let  area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x((d: any) => x2(parseDate(d.date)))
            .y0(this.height2)
            .y1((d: any) => y2(+(d.price)));

        this.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);

        let focus = this.svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        let context = this.svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");

         
        x.domain(d3.extent(this.chartData, (d: any) => parseDate(d.date)));
        y.domain([0, d3.max(this.chartData, (d: any) => (+(d.price)))]);
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
        
            
    }

}
