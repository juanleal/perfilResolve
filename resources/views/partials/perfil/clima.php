<link rel="stylesheet" href="css/clima.css" />
<style type="text/css">
    .map {
        height: 400px;
        width: 100%;
    }
    .main {
        margin-top: 30px;
    }
</style>
<!--<div class="row">
    <div id="map_canvas" ui-map="model.myMap" class="map" ui-options="mapOptions">
    </div>
    <div ng-repeat="marker in myMarkers" ui-map-marker="myMarkers[$index]">
    </div>
</div>-->
<div class="row climaW">
    <div class="col s12 m12 l12">
        <div class="col-centered" ng-controller="GeoController">
            <div id="weather">
                <ul id="scroller">
                    <li ng-repeat="e in estados">
                        <img src="/images/icons/{{ e.img}}.png" />
                        <span class="day">{{ e.day}}</span>
                        <span class="cond">{{ e.condition}}</span>
                    </li>
                </ul>
                <p class="location"></p>
                <a href="#" class="arrow previous">Previous</a>
                <a href="#" class="arrow next">Next</a>
            </div>


            <div id="clouds"></div>
        </div>
        <div class="row" ng-show="showResult()">
            Latitude: {{lat}} <br />
            Longitude: {{lng}} <br />
            Accuracy: {{accuracy}}
        </div>
        <!--<div class="row" ng-show="!showResult()">
            Error : {{error}}
            Error Code: {{error.code}}-->
    </div>
</div>