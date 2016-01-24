<div class="row" ng-controller="UserController" ng-init="findOne()">
    <div class="col s16 m12 l12" ng-include src="'/partials/users/profile/'"></div>
    <a ng-if="authenticatedUser != null"  ng-show="authenticatedUser.id == user.id" href="{{authenticatedUser.url}}/perfil/edit" class="card-face__editar btn-floating btn-large waves-effect waves-light red right"><i class="material-icons">edit</i></a>
</div>