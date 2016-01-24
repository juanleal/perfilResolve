<!doctype html>
<html lang="en">
    <head>
        <base href="/">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Perfil Resolve</title>
        <!--Import Google Icon Font-->
        <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <!--Import materialize.css-->
        <link type="text/css" rel="stylesheet" href="bower_components/Materialize/dist/css/materialize.min.css"  media="screen,projection"/>
        <link rel="stylesheet" href="bower_components/fullcalendar/dist/fullcalendar.css"/>
        <link href="bower_components/toastr/toastr.css" rel="stylesheet"/>
        <link type="text/css" rel="stylesheet" href="css/style.css"/>
        <script src="http://maps.googleapis.com/maps/api/js?sensor=false&language=en"></script>
        <script type="application/javascript" src="bower_components/jquery/dist/jquery.js"></script>
        <script src="bower_components/angular/angular.js"></script>
        <script type="text/javascript" src="bower_components/Materialize/dist/js/materialize.min.js"></script>
        <script type="text/javascript" src="bower_components/Materialize/js/date_picker/picker.time.js"></script>
        <script src="bower_components/toastr/toastr.js"></script>
        <script src="bower_components/moment/moment.js"></script>
        <script type="text/javascript" src="bower_components/fullcalendar/dist/fullcalendar.min.js"></script>
        <script type="text/javascript" src="bower_components/fullcalendar/dist/gcal.js"></script>
        <script type="text/javascript" src="bower_components/angular-ui-calendar/src/calendar.js"></script>
        <script type="application/javascript" src="<% elixir('js/all.js') %>"></script>
        <!--<link rel="stylesheet" href="/css/app.css"/>
        <link rel="stylesheet" href="<% elixir('css/all.css') %>"/>-->
    </head>
    <body ng-app="campApp" ng-controller="MainController" ng-init="getAuthenticatedUser()">
        <div class="navbar-fixed">
            <nav>
                <div class="nav-wrapper" ng-model="authenticatedUser">
                    <a ng-if="authenticatedUser != null" href="/" class="brand-logo center tooltipped" data-position="bottom" data-delay="50" data-tooltip="Explora!"><i class="large material-icons">public</i></a>
                    <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
                    <ul class="hide-on-med-and-down">
                        <!--<li ng-class="{active:isActive('/posts/index')}"><a href="/posts/index">Posts</a></li>-->
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url)}"><a href="/{{authenticatedUser.url}}">Dashboard</a></li>
                        <li ng-if="authenticatedUser == null" ng-class="{active:isActive('/auth/signup')}"><a href="/auth/signup">Sign Up</a></li>
                        <li ng-if="authenticatedUser == null" ng-class="{active:isActive('/auth/login')}"><a href="/auth/login">Log in</a></li>
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url + '/perfil')}"><a ng-href="/{{authenticatedUser.url}}/perfil">{{authenticatedUser.nombre| capitalize:true }}</a></li>
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url + '/fotos')}"><a ng-href="/{{authenticatedUser.url}}/fotos">Fotos <span class="badge">{{authenticatedUser.fotos }}</span></a></li>
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url + '/eventos')}"><a ng-href="/{{authenticatedUser.url}}/eventos">Eventos</a></li>
                        <li ng-if="authenticatedUser != null && authenticatedUser.role_id == 1" ng-class="{active:isActive('/users/admin')}"><a ng-href="/users/admin">Usuarios</a></li>
                        <li ng-if="authenticatedUser != null" ng-click="logout()" class="logout"><a ng-href="#">Log out</a></li>
                    </ul>
                    <ul class="side-nav" id="mobile-demo">
                        <!--<li ng-class="{active:isActive('/posts/index')}"><a href="/posts/index">Posts</a></li>-->
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url)}"><a href="/{{authenticatedUser.url}}">Dashboard</a></li>
                        <li ng-if="authenticatedUser == null" ng-class="{active:isActive('/auth/signup')}"><a href="/auth/signup">Sign Up</a></li>
                        <li ng-if="authenticatedUser == null" ng-class="{active:isActive('/auth/login')}"><a href="/auth/login">Log in</a></li>
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url + '/perfil')}"><a ng-href="/{{authenticatedUser.url}}/perfil">{{authenticatedUser.nombre| capitalize:true }}</a></li>
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url + '/fotos')}"><a ng-href="/{{authenticatedUser.url}}/fotos">Fotos</a></li>
                        <li ng-if="authenticatedUser != null" ng-class="{active:isActive('/' + authenticatedUser.url + '/eventos')}"><a ng-href="/{{authenticatedUser.url}}/eventos">Eventos</a></li>
                        <li ng-if="authenticatedUser != null && authenticatedUser.role_id == 1" ng-class="{active:isActive('/users/admin')}"><a ng-href="/users/admin">Usuarios</a></li>
                        <li ng-if="authenticatedUser != null" ng-click="logout()"><a ng-href="#">Log out</a></li>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="container">
            <div ng-view></div>
            <!--<div ng-view>
            </div>-->
        </div> 

    </body>

</html>
