<link type="text/css" rel="stylesheet" href="css/eventos.css"/>
<div ng-controller="CalendarCtrl" ng-init="proximosEventos()">
    <ul class="collection with-header">
        <li class="collection-header #ffc400 amber darken-2"><h5><i class="material-icons small">events</i> Próximos eventos <span class="right asist">¿asistirás?</span></h5></li>
        <div class="collection-item" ng-show="!proximos.length">No tiene próximos eventos</div>
        <li class="collection-item" ng-repeat="proximo in proximos">
            <div class="row">
                <div class="col s5 m5 l5">
                    {{proximo.title}}
                </div>
                <div class="col s5 m5 l5 duracion">
                    <ul>
                        <li><b>Empieza: </b>{{proximo.start| date:'medium'}}</li>
                        <li><b>Termina: </b>{{ proximo.end | date:'medium'}}</li>
                    </ul>
                </div>
                <div class="col s2 m2 l2">
                    <input type="checkbox" id="{{proximo.id}}" ng-click="actualizarAsistencia($event)" ng-checked="proximo.asistio"/>
                    <label for="{{proximo.id}}"></label>
                </div>
            </div>
        </li>
    </ul>
</div>