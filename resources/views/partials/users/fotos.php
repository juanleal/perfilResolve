<link type="text/css" rel="stylesheet" href="css/fotos.css"/>
<div ng-controller="FotosController">
    <div id="viewSlider" class="col s12 m12 l6" ng-include src="'/partials/users/slider/'"></div>
    <div class="row">
        <div class="fixed-action-btn">
            <a class="btn-floating btn-large red">
                <i class="material-icons">image</i>
            </a>
            <ul>
                <li><a class="btn-floating blue"><i class="material-icons">share</i></a></li>
                <li><a class="modal-trigger btn-floating green waves-effect waves-light red bottom tooltipped" data-position="left" data-delay="50" data-tooltip="Agregar una foto" href="#modalAdd"><i class="material-icons">add</i></a></li>
            </ul>
        </div>
        <div id="modalAdd" class="modal bottom-sheet">
            <div class="modal-content">
                <div class="row">
                    <form name="addFoto" ng-submit="" novalidate>
                        <div class="file-field input-field">
                            <div class="btn col s2">
                                <span>Cargar</span>
                                <input type="file" name="newFoto" class="validate" ng-model="newFoto" accept="image/*" app-filereader required/>
                            </div>
                            <div class="file-path-wrapper">
                                <input class="file-path validate" ng-model="nameFile" type="text" placeholder="Selecciona la imagen">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12 m5 l5">
                                <img ng-if="newFoto !== null" ng-src="{{newFoto}}" width="300" /><br />
                            </div>
                            <div class="col s12 m7 l7">
                                <a class="waves-effect waves-light btn red lighten-1" ng-click="newFoto = null;
                                            nameFile = null" ng-show="!!newFoto && !!nameFile"><i class="material-icons right">delete</i> Quitar</a>
                                <a ng-if="addFoto.$valid" ng-click="create()" class="teal modal-action modal-close waves-effect btn">Guardar</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div
    </div>
</div>
<script>
    $(document).ready(function () {
        $('.modal-trigger').leanModal();
        $('.tooltipped').tooltip({delay: 50});
        $("#viewSlider").bind("DOMSubtreeModified", function () {
            alert("tree changed");
        });
    });
</script>