<script>
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 110 // Creates a dropdown of 15 years to control year
    });
</script>
<div ng-controller="UserController" ng-init="findOne()" class="form-group col-sm-12 col-md-12">
    <div class="row">
        <div class="col s12 valign-wrapper">
            <form class="col s6 well col-centered" name="registerForm" ng-submit="update(user)" novalidate>
                <div class="row">
                    <div class="input-field col s6" ng-class="{
                            'has-error'
                                    : registerForm.nombre.$invalid && !registerForm.nombre.$pristine }">
                        <input type="text" name="nombre" ng-pattern="/^[a-zA-Z\s]*$/" class="validate" ng-model="user.nombre" required="" aria-required="true">
                        <label class="active" for="nombre" data-error="Sólo&nbsp;letras">Apellidos</label>
                        <!--<p class="help-block" ng-show="registerForm.apellidos.$error.required">Este campo es requerido.</p>
                        <p class="help-block" ng-show="registerForm.apellidos.$error.pattern">Solo letras.</p>-->
                    </div>
                    <div class="input-field col s6" ng-class="{
                            'has-error'
                                    : registerForm.apellidos.$invalid && !registerForm.apellidos.$pristine }">
                        <input type="text" name="apellidos" ng-pattern="/^[a-zA-Z\s]*$/" class="validate" ng-model="user.apellidos" required="" aria-required="true">
                        <label class="active" for="apellidos" data-error="Sólo&nbsp;letras">Apellidos</label>
                        <!--<p class="help-block" ng-show="registerForm.apellidos.$error.required">Este campo es requerido.</p>
                        <p class="help-block" ng-show="registerForm.apellidos.$error.pattern">Solo letras.</p>-->
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input type="email" name="email" class="validate" ng-model="user.email" required="" aria-required="true">
                        <label class="active" for="email" data-error="Email&nbsp;inválido">Email</label>
                        <!--<p class="help-block" ng-show="registerForm.email.$error.required">Este campo es requerido.</p>
                        <p class="help-block" ng-show="registerForm.email.$error.email">Ingrese un email válido.</p>-->
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input type="text" name="url" class="validate" ng-model="user.url" required="" aria-required="true">
                        <label class="active" for="url" data-error="Campo&nbsp;requerido">Url</label>
                    </div>
                </div>
                <!--<div class="form-group">
                    <input type="password" name="password" class="form-control" placeholder="Contraseña" ng-model="user.password"  wj-validation-error="passwordConfirmation != password" required>
                    <p class="help-block" ng-show="registerForm.password.$error.required">Este campo es requerido.</p>
                    <p class="help-block" ng-show="!registerForm.password.$error.required && registerForm.password.$invalid && !registerForm.password.$pristine">Las contraseñas no coinciden.</p>
                </div>
                <div class="form-group">
                    <input type="password" name="passwordConfirmation" class="form-control" placeholder="Repetir contraseña" id="passwordConfirmation" ng-model="user.passwordConfirmation" wj-validation-error="passwordConfirmation != password" required>
                    <p class="help-block" ng-show="registerForm.passwordConfirmation.$error.required">Este campo es requerido.                    
                    <p class="help-block" ng-show="!registerForm.passwordConfirmation.$error.required && registerForm.passwordConfirmation.$invalid && !registerForm.passwordConfirmation.$pristine">Las contraseñas no coinciden.</p>
                </div>-->
                <div class="row">
                    <div class="input-field col s12">
                        <input type="date" name="fecha" class="validate datepicker" ng-model="user.fecha" required="" aria-required="true">
                        <label class="active" for="fecha" data-error="Campo&nbsp;requerido">Fecha de nacimiento</label>
                    </div>
                </div>
                <div class="row">
                    <div class="file-field input-field">
                        <div class="btn col s2">
                            <span>Cargar</span>
                            <input type="file" name="imagen" class="validate" ng-model="user.imagen" accept="image/*" app-filereader /><br />
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" ng-model="user.nameFile" type="text" placeholder="Selecciona la imagen">
                        </div>
                    </div>
                    <img ng-if="user.imagen !== null" ng-src="{{user.imagen}}" width="300" /><br />
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn red lighten-1" ng-click="user.imagen = null;
                        user.nameFile = null" ng-show="!!user.imagen && !!user.nameFile"><i class="material-icons right">delete</i> Quitar</a>
                </div>

                <div class="row">
                    <button ng-if="registerForm.$valid" class="btn waves-effect waves-light" type="submit" name="action">Actualizar
                        <i class="material-icons right">send</i>
                    </button>
                </div>
                <div class="row">
                    <div class="card-panel red lighten-3" ng-if="error">
                        <strong>Error: </strong> {{error.error}}
                        <br>Por favor verifique
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>