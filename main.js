//Button color change
$("button.jQueryColorChangeYear").click(function () {
    $("button.jQueryColorChangeYear").removeClass('selectedYear');
    $(this).toggleClass("selectedYear");
});

//Width and height
var w = 700;
var h = 500;

//Define map projection
var projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
    .center([13, 55.5]) //comment centrer la carte, longitude, latitude
    .translate([w / 2, h / 2]) // centrer l'image obtenue dans le svg
    .scale([w / 1.5])// zoom, plus la valeur est petit plus le zoom est gros
    .rotate([0, 0, -2.7]);


//Load the googlesheet data
var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpT3hvIkP5GZfoM7yOQtO4QKpTrcJcuAJ_QC736fuD106U0wBjQ6A_QJ1cyGf3Avsn15ez9K_Y-GEH";
URL += "/pub?single=true&output=csv";

var data_vehicules = [];

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Define the default year
var year = 2012;
var type = "ElectriqueP";

//Create SVG
var svg = d3.select("#container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

function reset_color(e) {
    for (var i = 0; i < 5; i++) {
        $("path").removeClass("color_" + i);
    }
}

function draw() {
    opacity_scale = d3.scaleLinear().range([0.3, 0.9]);
    opacity_scale.domain([
        0,
        d3.max(data_vehicules, function (d) {
             if (d["Année"] == year){
                 return +d[type].replace(",",".");
             } else {
                 return 0.0;
             }
        })
    ]);

    svg.selectAll("path")
        .style("fill-opacity", (function (e) {

            vehicules = data_vehicules.filter(function (f) {
                return f.Name === e.properties.NAME && f["Année"] == year;
            });

            if (vehicules.length > 0) {
                return opacity_scale(+vehicules[0][type].replace(",", "."));
            }
            else {
                return 0.0;
            }

        }))
}

//Load in GeoJSON data
d3.json("countries.json", function (json) {

    //Create csv with googlesheet data
    d3.csv(URL, function (data) {
        data_vehicules = data;

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "unclicked color_0")
            .attr("stroke", "#606060")
            .style("fill-opacity", function (e) {


                vehicules = data_vehicules.filter(function (f) {
                    return f.Name === e.properties.NAME && f["Année"] == year;
                });

                if (vehicules.length > 0) {
                    return +vehicules[0][type].replace(",", ".");
                } else {
                    return 0.0;
                }
            })
            .on("click", function (d) {
                var e = $(this);
                if (e.hasClass("unclicked")) {
                    e.removeClass("unclicked");
                    e.addClass("clicked");
                } else if (e.hasClass("clicked")) {
                    e.removeClass("clicked");
                    e.addClass("unclicked");
                }

            })
            .on("mousemove", function (d) {

                d3.select(".tooltipD3")
                    .style("display", "block")
                    .style("left", d3.mouse(this)[0] + "px")
                    .style("top", d3.mouse(this)[1] + "px")
                    .text(function (e) {

                        vehicules = data_vehicules.filter(function (f) {
                            return f.Name === d.properties.NAME && f["Année"] == year;
                        });
                        if (vehicules.length > 0) {
                            return +vehicules[0][type].replace(",", ".") * 100. + " %";
                        } else {
                            return '?';
                        }
                    });

            })
            .on("mouseout", function (d) {
                d3.select(".tooltipD3")
                    .style("display", "none");
                d3.select(this)
                    .transition().duration(100)
            });


        $(".btnyear2012").click(function () {
            year = 2012;
            draw();
        });
        $(".btnyear2013").click(function () {
            year = 2013;
            draw();
        });
        $(".btnyear2014").click(function () {
            year = 2014;
            draw();
        });
        $(".btnyear2015").click(function () {
            year = 2015;
            draw();
        });
        $(".btnyear2016").click(function () {
            year = 2016;
            draw();
        });

        $(".btnmotor").click(function () {
            var id = $(this).attr("id").replace("btn", "");
            type = $(this).attr("data-type");
            reset_color();
            $("path").addClass("color_" + (+id - 1));
            draw();
        });
        draw();
    });

});
