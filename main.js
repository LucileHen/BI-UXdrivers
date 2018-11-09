//Button color change
$("button.jQueryColorChangeYear").click(function () {
    $("button.jQueryColorChangeYear").removeClass('selectedYear');
    $(this).toggleClass("selectedYear");
});
//define var data
var data = undefined;

// define margin
var margin = {top: 50, right: 20, bottom: 30, left: 95};

//Define colors
var colorsvoit = ["#248ED8", "#F4AA29","#F4295F","#0B4F6C","#20BF55"];
var europe_color = "#DEDEDE";
var colorspol = ["#0ed845", "#f44062","#9af47b"];

//Crate a barchart
function bar_chart(element, country, type) {
    //Clean html in id element
    $("#" + element).html("");
    //create a group for svg with margin
    var svg = d3.select("#" + element).append("svg").attr("width", 600).attr("height", 350);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var myTool = d3.select("body")
        .append("div")
        .attr("class", "tooltipD3")
        .style("opacity", "0")
        .style("display", "none");

    var labels = {
        pol: ["Emission NOx", "Emission CO", "Emission PM10" ],
        voit: ["Diesel", "Essence", "Hybride Diesel", "Hybride Essence", "Electrique"]
    };

    //Select just the line we want
    vehicules = data_vehicules.filter(function (f) {
        return f.Nom === country;
    });
    vehicules_europe = data_vehicules.filter(function (f) {
        return f.Nom === "Europe";
    });


    //create the array for the barchart
    if (vehicules.length > 0) {
        line = vehicules[0];
        console.log(line);
        var country_data = [];
        labels[type].forEach(function(e){
            country_data.push({label:e, value: +line[e]})
        })
    } else {
        return;
    }

    if (vehicules_europe.length > 0) {
        line = vehicules_europe[0];
        var europe_data = [];
        labels[type].forEach(function(e){
            europe_data.push({label:e, value: +line[e]})
        })
    } else {
        return;
    }

    var data = country_data;
    console.log(data, europe_data);
    //Create var x
    var x = d3.scaleLog()
        .rangeRound([0, width]);

    //Create var y
    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .padding(0.1);

    //Create var z
    var z = d3.scaleOrdinal();

    //Find the max of collumns
    var max_co2 = d3.max(data_vehicules, function(d) {
        return +d["Emission CO2"];
    });
    var max_NOX = d3.max(data_vehicules, function(d) {
        return +d["Emission NOx"];
    });
    var max_diesel = d3.max(data_vehicules, function(d) {
        return +d["Diesel"];
    });
    var max_essence = d3.max(data_vehicules, function(d) {
        return +d["Essence"];
    });

    var title = [];

    //Define the domain of x axe it's different for the two BC
    if (type === "voit"){
        x.domain([1, d3.max([max_diesel, max_essence])]);
        title = [": Répartition des types de moteurs."]
        z = d3.scaleOrdinal(colorsvoit);
    }
    else if (type === "pol"){
        x.domain([1, d3.max([max_co2, max_NOX])]);
        title = [": Quelles émissions de polluants?"]
        z = d3.scaleOrdinal(colorspol);
    }

    //Define the domain of y axe
    y.domain(data.map(function(d) {
        return d.label
    }));

    //draw the barchart
    var bar_gr = g.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d){
            return "translate(0, " + y(d.label) + ")";
        });

    bar_gr.append("rect")
        .attr("class", "bar")
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", y.bandwidth()/2)
        .attr("width",function(d) {
            return x(d.value);
        })
        .style("fill", function (d) {
            return z(d.label)
        })
        .on("mousemove", function (d) {
            if (type === "voit"){
                d3.select(this).style('fill-opacity',"0.5");
                d3.select(".tooltipD3-bar")
                    .style("display", "block")
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 20 + "px")
                    .text(function (e) {
                        return d.value + " Voitures " + d.label;
                    })
            }else if (type === "pol"){
                d3.select(this).style('fill-opacity',"0.5");
                d3.select(".tooltipD3-bar")
                    .style("display", "block")
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 20 + "px")
                    .text(function (e) {
                        return d.value + " Tonne d'" + d.label;
                    })
            }
        })
        .on('mouseout', function(d) {
            d3.select(this).style('fill-opacity',"1");
            d3.select(".tooltipD3-bar")
                .style("display", "none");
        });

    bar_gr.append("rect")
        .attr("class", "bar")
        .attr("y", y.bandwidth()/2)
        .attr("x", 0)
        .attr("height", y.bandwidth()/2)
        .attr("width",function(d) {
            var v = 0;
            europe_data.forEach(function(e){
                if (e.label === d.label){
                    v = e.value;
                }
            });
            return x(v);
        })
        .style("fill", function (d) {
            return europe_color;
        })
        .on("mousemove", function (d) {
            if (type === "voit"){
                d3.select(this).style('fill-opacity',"0.5");
                d3.select(".tooltipD3-bar")
                    .style("display", "block")
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 20 + "px")
                    .text(function (e) {
                        return d.value + " Voitures " + d.label + " en moyenne en Europe";
                    })
            }else if (type === "pol"){
                d3.select(this).style('fill-opacity',"0.5");
                d3.select(".tooltipD3-bar")
                    .style("display", "block")
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 20 + "px")
                    .text(function (e) {
                        return d.value + " Tonne d'" + d.label + " en moyenne en Europe";
                    })
            }
        })
        .on('mouseout', function(d) {
            d3.select(this).style('fill-opacity',"1");
            d3.select(".tooltipD3-bar")
                .style("display", "none");
        });

    //create a group for x axe
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4)
            .tickFormat(d3.format(".0s")));

    //crate a group for y axe
    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

    //create a group for the title
    g.append('text')
        .attr('x', 5)
        .attr('y', -15)
        .text(vehicules[0].Nom + " " + title);
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

var selected = "Europe";

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
    opacity_scale = d3.scaleLinear().range(["#248ED8", "red"]);
    opacity_scale.domain([
        d3.min(data_vehicules, function (d){
            return +d.Note.replace(",",".");
        }),
        d3.max(data_vehicules, function (d){
            return +d.Note.replace(",",".");

        })
    ]);

    svg.selectAll("path")
        .style("fill", function (e) {


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

        bar_chart("pol", selected, "pol");
        bar_chart("voit", selected, "voit");

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
                        selected = vehicules[0].Nom;
                        console.log(selected);
                        bar_chart("pol", selected, "pol");
                        bar_chart("voit", selected, "voit");
                    } else if (e.hasClass("clicked")) {
                        e.removeClass("clicked");
                        e.addClass("unclicked");
                        selected = "Europe";
                        console.log(selected);
                        bar_chart("pol", selected, "pol");
                        bar_chart("voit", selected, "voit");
                    }
                }
            })//TEST
            .on("mousemove", function (d) {
                d3.select(".tooltipD3")
                    .style("display", "block")
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 20 + "px")
                    .text(function (e) {
                        vehicules = data_vehicules.filter(function (f) {
                            return f.Name === d.properties.NAME;
                        });
                        var note = "";
                        if (vehicules.length > 0) {
                            note = vehicules[0].Note;
                            nom = vehicules[0].Nom;
                            return nom + " | Niveau de pollution : " + note;
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
