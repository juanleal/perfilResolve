<script>
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
</script>
<div class="row">
    <div class="col s12 valign-wrapper">
        <form name="registerForm" class="col s6 well col-centered" ng-controller="UserController" ng-submit="create()" novalidate>
            <div class="row">
                <span  class="col s4 m12 center">Si ya tienes cuenta <strong><a href="auth/login">ingresa</a>!</strong></span>
            </div>
            <div class="row">
                <div class="input-field col s6" ng-class="{
                        'has-error'
                                : registerForm.nombre.$invalid && !registerForm.nombre.$pristine }">
                    <input type="text" name="nombre" ng-pattern="/^[a-zA-Z\s]*$/" class="form-control" ng-model="nombre" required>
                    <label for="nombre" data-error="Sólo&nbsp;letras">Nombre</label>
                    <!--<p class="help-block" ng-show="registerForm.apellidos.$error.required">Este campo es requerido.</p>
                    <p class="help-block" ng-show="registerForm.apellidos.$error.pattern">Solo letras.</p>-->
                </div>
                <div class="input-field col s6" ng-class="{
                        'has-error'
                                : registerForm.apellidos.$invalid && !registerForm.apellidos.$pristine }">
                    <input type="text" name="apellidos" ng-pattern="/^[a-zA-Z\s]*$/" class="form-control" ng-model="apellidos" required>
                    <label for="apellidos" data-error="Sólo&nbsp;letras">Apellidos</label>
                    <!--<p class="help-block" ng-show="registerForm.apellidos.$error.required">Este campo es requerido.</p>
                    <p class="help-block" ng-show="registerForm.apellidos.$error.pattern">Solo letras.</p>-->
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input type="email" name="email" class="form-control" ng-model="email" required>
                    <label for="email" data-error="Email&nbsp;inválido">Email</label>
                    <!--<p class="help-block" ng-show="registerForm.email.$error.required">Este campo es requerido.</p>
                    <p class="help-block" ng-show="registerForm.email.$error.email">Ingrese un email válido.</p>-->
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input type="password" name="password" class="form-control" ng-model="password"  wj-validation-error="passwordConfirmation != password" required>
                    <label for="password" data-error="Campo&nbsp;requerido">Password</label>
                    <!--<p class="help-block" ng-show="registerForm.password.$error.required">Este campo es requerido.</p>
                    <p class="help-block" ng-show="!registerForm.password.$error.required && registerForm.password.$invalid && !registerForm.password.$pristine">Las contraseñas no coinciden.</p>-->
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input type="password" name="passwordConfirmation" class="form-control" id="passwordConfirmation" ng-model="passwordConfirmation" wj-validation-error="passwordConfirmation != password" required>
                    <label for="passwordConfirmation" data-error="Contraseña&nbsp;no&nbsp;coincide">Repetir password</label>
                    <!--<p class="help-block" ng-show="registerForm.passwordConfirmation.$error.required">Este campo es requerido.                    
                    <p class="help-block" ng-show="!registerForm.passwordConfirmation.$error.required && registerForm.passwordConfirmation.$invalid && !registerForm.passwordConfirmation.$pristine">Las contraseñas no coinciden.</p>-->
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input type="date" name="fecha" class="datepicker" ng-model="fecha" required>
                    <label for="fecha" data-error="Contraseña&nbsp;no&nbsp;coincide">Fecha de nacimiento</label>
                </div>
            </div>
            <button ng-if="registerForm.$valid" class="btn waves-effect waves-light" type="submit" name="action">Registrame
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