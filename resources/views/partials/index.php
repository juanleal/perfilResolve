<link type="text/css" rel="stylesheet" href="css/index.css"/>
<!--<p ng-if="authenticatedUser">
    Hello {{authenticatedUser.username}}
</p>-->
<div ng-controller='UserController'>
    <div infinite-scroll='findAll()' infinite-scroll-distance='0'>
        <div class="row" ng-model="viewsExplorer">
            <div ng-repeat='user in users'>
                <div class="col s12 m6 l6" ng-include src="'/partials/users/profile/'"></div>
            </div>
        </div>
    </div>
</div>
<div class="center-align center">
    <div class="mensaje">
        <h3 ng-if="!authenticatedUser" class="col s12 m6 l6">
            Hola!, si deseas ver los demás perfiles debes hacer login.
        </h3>
    </div>
</div>
