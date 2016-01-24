<div class="col s12 m12 l12" ng-init="getFotos()">
    <div class="row">
        <div class="slider" ng-if="fotos.length">
            <ul class="slides">
                <!--<div class="row" data-ng-repeat="foto in fotos">
                    <img src="{{foto.imagen}}"
                </div>-->
                <li data-ng-repeat="foto in fotos" my-repeat-directive>
                    <img src="{{foto.imagen}}">  random image 
                    <div class="caption center-align">
                        <h3>This is our big Tagline!</h3>
                        <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
<div ng-show="!fotos.length">
    <div class="caption center-align">
        <p><i class="bad material-icons">mood_bad</i><p>
        <h5 class="light grey-text text-lighten-3">Todavía no tienes fotos.</h5>
    </div>
</div>