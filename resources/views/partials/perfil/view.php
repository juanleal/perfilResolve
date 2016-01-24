<div ng-controller="DashboardController" ng-model="board" ng-init="board()">
    <!--<h1>{{user.username}}</h1>
    Email: {{user.email}}
</div>-->
    <div class="row">
        <div class="col s12 m6 l3" ng-controller="UserController" ng-init="findOne()" ng-include src="'/partials/users/profile/'"></div>
        <div class="col s12 m6 l3" ng-include src="'/partials/perfil/clima/'"></div>
        <div class="col s12 m12 l6" ng-controller="FotosController" ng-include src="'/partials/users/slider/'"></div>
    </div>
    <div class="row">
        <div class="col s12 m12 l7" ng-include src="'/partials/users/proximoseventos/'"></div>
        <div class="col s12 m12 l5" ng-include src="'/partials/users/estadisticas/'"></div>
    </div>
</div>