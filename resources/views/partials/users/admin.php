<div ng-if="authenticatedUser != null && authenticatedUser.role_id == 1" ng-controller="UserController" ng-init="usersAdmin()">
    <div class="well">
        <h5 class="center-align">Usuarios registrados</h5>
        <hr/>
        <table>
            <thead>
            <th>Nombres completo</th>
            <th>Email</th>
            <th>Bloquear</th>
            </thead>
            <tr class="row" ng-repeat="user in users">
                <td class="col-lg-6">
                    <span>{{user.nombre + ' ' + user.apellidos}}</span>
                </td>
                <td class="col-lg-6">
                    <span>{{user.email}}</span>
                </td>
                <td>
                    <input type="checkbox" id="{{user.id}}" ng-click="changeEstateUser($event)" ng-checked="user.bloqued"/>
                    <label for="{{user.id}}"></label>
                </td>
            </tr>
        </table>
    </div>
</div>


