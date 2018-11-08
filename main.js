//Button color change
$("button.jQueryColorChangeYear").click(function () {
    $("button.jQueryColorChangeYear").removeClass('selectedYear');
    $(this).toggleClass("selectedYear");
});
//define var data
var data = undefined;

// define margin
var margin = {top: 20, right: 20, bottom: 30, left: 40};

//Define colors
var colors = ["#0B4F6C", "#F4AA29", "#20BF55", "#F4295F", "#248ED8"];

//Crate a barchart
function bar_chart(element) {
    //Clean html in id element
    $("#" + element).html("");
    //create a group for svg with margin
    var svg = d3.select("#" + element).append("svg").attr("width", 1000).attr("height", 500);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Create an array with the only three data we need
    /*var nested_data = d3.nest()
    //Regroup data by property
        .key(function (d) {
            return d[property];
        })
        //Calculate number of property and the time it takes
        .rollup(function (d) {
            return {
                size: d.length, total_time: d3.sum(d, function (d) {
                    return d.time;
                })
            };
        })
        .entries(data);

    //Sort nested data by alphabetical order
    nested_data = nested_data.sort(function (a, b) {
        return d3.ascending(a.key, b.key)
    });*/

    //Create var x
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    //Create var y
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    //Create var z
    var z = d3.scaleOrdinal(colors);

    //Define the domain of x axe
    x.domain(data.map(function(d) {
        return d.Name;
    }));

    //Define the domain of y axe
    y.domain([0, d3.max(data, function(d) {
        return d.TOTAL;
    })]);
    //Define the domain of colors
    /*z.domain(data.map(function (d) {
        return d.colors;
    }));*/

    //draw the barchart
    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.Name)
        })
        .attr("y", function (d) {
            return y(d.TOTAL)
        })
        .attr("height",function(d) {
            return height - y(d.TOTAL);
        })
        .attr("width", x.bandwidth())
        .style("fill", function (d) {
            return z(d.Name)
        })
        /*.on("mouseover", function(d){
            d3.select(this)
                .transition().duration(100)
                .attr("fill", "black")
                .attr("y", y(d.value.size) - 20)
        })
        .on("mouseout", function(d){
            d3.select(this)
                .transition().duration(100)
                .attr("y", y(d.value.size))
        });*/

    //create a group for x axe
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //crate a group for y axe
    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
}

function clear_fuel_classes(){
    $("button.jQueryColorChangeFuel1").removeClass('selectedFuel1');
    $("button.jQueryColorChangeFuel2").removeClass('selectedFuel2');
    $("button.jQueryColorChangeFuel3").removeClass('selectedFuel3');
    $("button.jQueryColorChangeFuel4").removeClass('selectedFuel4');
    $("button.jQueryColorChangeFuel5").removeClass('selectedFuel5');
}

$("button.jQueryColorChangeFuel1").click(function () {
    clear_fuel_classes();
    $(this).toggleClass("selectedFuel1");
});

$("button.jQueryColorChangeFuel2").click(function () {
    clear_fuel_classes();
    $(this).toggleClass("selectedFuel2");
});

$("button.jQueryColorChangeFuel3").click(function () {
    clear_fuel_classes();
    $(this).toggleClass("selectedFuel3");
});

$("button.jQueryColorChangeFuel4").click(function () {
    clear_fuel_classes();
    $(this).toggleClass("selectedFuel4");
});

$("button.jQueryColorChangeFuel5").click(function () {
    clear_fuel_classes();
    $(this).toggleClass("selectedFuel5");
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
var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOo8Wdui9u_DWB3171EW2V6hFE5On_JWKw8o6-dsKtVM4scU7PdiPqp0utqTnUj_MluY_kx9diSOOM";
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
    d3.csv(URL, function (d) {
        data_vehicules = d;
        data = d;
        data.forEach(function(d){
            d.TOTAL = + d.TOTAL;
        });

        bar_chart("pol");

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
                    return Math.round(vehicules[0][type].replace(",", ".")*100)/100;
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
                    .style("left", d3.mouse(this)[0] + 10 + "px")
                    .style("top", d3.mouse(this)[1] + 35 + "px")
                    .text(function (e) {

                        vehicules = data_vehicules.filter(function (f) {
                            return f.Name === d.properties.NAME && f["Année"] == year;
                        });
                        if (vehicules.length > 0) {
                            return Math.round((vehicules[0][type].replace(",", ".") * 100)*1000)/1000+ " %"
                        } else {
                            return "Inconnues";
                        }
                    });

            })
            .on("mouseout", function (d) {
                d3.select(".tooltipD3")
                    .style("display", "none");
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
