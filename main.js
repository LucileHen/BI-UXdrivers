//Button color change
$("button.jQueryColorChangeYear").click(function () {
    $("button.jQueryColorChangeYear").removeClass('selectedYear');
    $(this).toggleClass("selectedYear");
});

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

//Create SVG
var svg = d3.select("#container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


function draw() {
    opacity_scale = d3.scaleLinear().range([1, 0.2]);
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
    d3.csv(URL, function (data) {
        data_vehicules = data;

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
                    .style("left", d3.mouse(this)[0] + 23 + "px")
                    .style("top", d3.mouse(this)[1] + 130 + "px")
                    .text(function (e) {
                        return d.properties.NAME;
                    });

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
