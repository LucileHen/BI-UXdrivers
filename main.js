//Button color change
$("button.jQueryColorChangeYear").click(function () {
    $("button.jQueryColorChangeYear").removeClass('selectedYear');
    $(this).toggleClass("selectedYear");
});
//define var data
var data = undefined;

// define margin
var margin = {top: 50, right: 20, bottom: 30, left: 40};

//Define colors
var colors = ["#0B4F6C", "#F4AA29", "#20BF55", "#F4295F", "#248ED8"];

//Crate a barchart
function bar_chart(element, country, type) {
    //Clean html in id element
    $("#" + element).html("");
    //create a group for svg with margin
    var svg = d3.select("#" + element).append("svg").attr("width", 900).attr("height", 350);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var myTool = d3.select("body")
        .append("div")
        .attr("class", "tooltipD3")
        .style("opacity", "0")
        .style("display", "none");

    var labels = {
        pol: ["Emission NOx (T)", "Emission CO2 (T)", "Emission PM10 (T)" ],
        voit: ["Diesel", "Essence", "HDiesel", "HEssence", "Electrique"]
    };

    //Select just the line we want
    vehicules = data_vehicules.filter(function (f) {
        return f.Name === country;
    });

    //create the array for the barchart
    if (vehicules.length > 0) {
        line = vehicules[0];
        var country_data = [];
        labels[type].forEach(function(e){
            country_data.push({label:e, value: +line[e]})
        })
    } else {
        return;
    }


    var data = country_data;

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
        return d.label;
    }));

    //Define the domain of y axe
    y.domain([0, d3.max(data, function(d) {
        return d.value;
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
            return x(d.label)
        })
        .attr("y", function (d) {
            return y(d.value)
        })
        .attr("height",function(d) {
            return height - y(d.value);
        })
        .attr("width", x.bandwidth())
        .style("fill", function (d) {
            return z(d.label)
        })
        .on('mouseover', function(d) {
            d3.select(this).style('fill-opacity',"0.7");
        })
        .on('mouseout', function(d) {
            d3.select(this).style('fill-opacity',"1");
        });

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

    g.append('text')
        .attr('x', 5)
        .attr('y', -15)
        .text("Emissions pour la Belgique");
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
var w = 600;
var h = 600;

//Define map projection
var projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
    .center([13, 55.5]) //comment centrer la carte, longitude, latitude
    .translate([w / 2, h / 2]) // centrer l'image obtenue dans le svg
    .scale([w / 1.2])// zoom, plus la valeur est petit plus le zoom est gros
    .rotate([0, 0, -2.7]);

var selected = "none";

//Load the googlesheet data
var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOo8Wdui9u_DWB3171EW2V6hFE5On_JWKw8o6-dsKtVM4scU7PdiPqp0utqTnUj_MluY_kx9diSOOM";
URL += "/pub?single=true&output=csv";

var data_vehicules = [];

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Create SVG
var svg = d3.select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


function draw() {
    opacity_scale = d3.scaleLinear().range([1, 0.5]);
    opacity_scale.domain([
        0,
        d3.max(data_vehicules, function (d){
                 return +d.Note.replace(",",".");

        })
    ]);

    svg.selectAll("path")
        .style("fill-opacity", function (e) {


            vehicules = data_vehicules.filter(function (f) {
                return f.Name === e.properties.NAME;
            });

            if (vehicules.length > 0) {
                return opacity_scale(Math.round(vehicules[0].Note.replace(",", ".")*100)/100);
            } else {
                $(this).addClass("unknown");
            }
        })

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

        bar_chart("pol", "Belgium", "pol");
        bar_chart("voit", "Belgium", "voit");

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "unclicked color_0")
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", "0.6")
            .on("click", function (d) {
                var e = $(this);
                var t = $(".clicked");
                vehicules = data_vehicules.filter(function (f) {
                    return f.Name === d.properties.NAME;
                });
                if (vehicules.length > 0) {
                    if (e.hasClass("unclicked")) {
                        t.removeClass("clicked");
                        t.addClass("unclicked");
                        e.removeClass("unclicked");
                        e.addClass("clicked");
                        selected = d.properties.NAME;
                        console.log(selected);
                    } else if (e.hasClass("clicked")) {
                        e.removeClass("clicked");
                        e.addClass("unclicked");
                        selected = "none";
                        console.log(selected);
                    }
                }
            })
            .on("mousemove", function (d) {
                d3.select(".tooltipD3")
                    .style("display", "block")
                    .style("left", d3.mouse(this)[0] - 30 + "px")
                    .style("top", d3.mouse(this)[1] + 120 + "px")
                    .text(function (e) {
                        vehicules = data_vehicules.filter(function (f) {
                            return f.Name === d.properties.NAME;
                        });
                        var note = "";
                        if (vehicules.length > 0) {
                            note = vehicules[0].Note;
                            return d.properties.NAME + " | Niveau de pollution : " + note;
                        } else{
                            return d.properties.NAME + " | Données non connues";
                        }
                    })
            })
            .on("mouseout", function (d) {
                d3.select(".tooltipD3")
                    .style("display", "none");
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
