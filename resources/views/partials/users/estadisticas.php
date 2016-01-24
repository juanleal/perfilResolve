<link type="text/css" rel="stylesheet" href="css/estadisticas.css"/>
<div class="row stats card-panel orange darken-3">
    <div class="center">
        <div ng-controller="CalendarCtrl" ng-init="eventosAsistidos()">
            <div class="white-text">En el último mes has asistido a {{ asistidos.length | numeroEventos }}</div>
        </div>
        <div ng-controller="UserController">
            <div class="white-text">Tu perfil se ha visto {{authenticatedUser.visitas | numeroVisitas }}</div>
        </div>
        <div>
            <div class="white-text">Tienes {{authenticatedUser.fotos | numeroFotos }} fotos</div>
        </div>
    </div>
</div>