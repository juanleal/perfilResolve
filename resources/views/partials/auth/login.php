<!--<div class="form-group col-sm-12 col-md-12">
    <div class="col-sm-8 col-md-6 col-centered login">
        <div class="well">
            <h3>Si no tienes cuenta <strong><a href="/auth/signup">registrate</a>!</strong></h3>
            <form name="loginForm" ng-controller="UserController" ng-submit="login()" novalidate>
                <div class="form-group" ng-class="{ 'has-error' : loginForm.email.$invalid && !loginForm.email.$pristine }">
                    <input type="email" name="email" class="form-control" placeholder="Email" ng-model="email" required>
                    <p ng-show="loginForm.email.$invalid && !loginForm.email.$pristine" class="help-block">Ingrese un email válido.</p>
                </div>
                <div class="form-group" ng-class="{ 'has-error' : loginForm.password.$invalid && !loginForm.password.$pristine }">
                    <input type="password" name="password" class="form-control" placeholder="Password" ng-model="password" required>
                    <p ng-show="loginForm.password.$invalid && !loginForm.password.$pristine" class="help-block">Este campo es requerido.</p>
                </div>
                <div class="form-group">
                    <button ng-if="loginForm.$valid" class="btn btn-primary btn-raised" ng-click="auth.login()">Submit</button>
                </div>
                <div class="form-group">
                    <div class="alert alert-danger" ng-if="error">
                        <strong>Error: </strong> {{error.error}}
                        <br>Por favor verifique
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>-->
<div class="row">
    <div class="col s12 valign-wrapper">
        <form name="loginForm" class="col s6 well col-centered" ng-controller="UserController" ng-submit="login()" novalidate>
            <div class="row">
                <span class="col s4 m12 center">Si no tienes cuenta <strong><a href="/auth/signup">registrate</a>!</strong></span>
            </div>
            <div class="row">
                <div class="input-field col s12" ng-class="{
                        'has-error'
                        : loginForm.email.$invalid && !loginForm.email.$pristine }">
                    <input type="email" name="email" class="validate" ng-model="email" required="" aria-required="true">
                    <label for="email" data-error="Correo&nbsp;inválido">Email</label>
                    <!--<p ng-show="loginForm.email.$invalid && !loginForm.email.$pristine" class="help-block">Ingrese un email válido.</p>-->
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12" ng-class="{
                        'has-error'
                        : loginForm.password.$invalid && !loginForm.password.$pristine }">
                    <input id="password" type="password" class="validate" ng-model="password" required="" aria-required="true">
                    <label for="password" data-error="Password&nbsp;inválido">Password</label>
                </div>
            </div>
            <button ng-if="loginForm.$valid" class="btn waves-effect waves-light" type="submit" name="action">Ingresar
                <i class="material-icons right">send</i>
            </button>
            <div class="row">
                <div class="card-panel red lighten-3" ng-if="error">
                    <strong>Error: </strong> {{error.error}}
                    <br>Por favor verifique
                </div>
            </div>
        </form>
    </div>
</div>