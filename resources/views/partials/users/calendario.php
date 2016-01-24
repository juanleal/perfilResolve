<link type="text/css" rel="stylesheet" href="css/eventos.css"/>
<section id="directives-calendar" ng-controller="CalendarCtrl" ng-init="getEventos()">
    <div class="well">
        <div class="row">
            <div class="col s8 m9 l10">
                <!--<button class="btn" ng-click="addRemoveEventSource(eventSources, eventSource)">
                    Toggle Source
                </button>
                <button type="button" class="btn btn-primary" ng-click="addEvent()">
                    Agregar evento
                </button>-->
                <!-- Modal Trigger -->
                <a class="waves-effect waves-light btn modal-trigger" href="#addEvent">Nuevo evento</a>

                <!-- Modal Structure -->
                <div id="addEvent" class="modal bottom-sheet">
                    <div class="modal-content">
                        <form name="agregarEvento" novalidate>
                            <div class="row">
                                <div class="col s6">
                                    <input name="fecha1" type="date" class="datepicker" ng-model="nuevoEvento.fecha1" required>
                                    <label class="active" for="fecha1">Fecha inicio</label>
                                </div>
                                <div class="col s6">
                                    <input name="hora1" type="time" class="timepicker" ng-model="nuevoEvento.hora1" required>
                                    <label class="active" for="hora1">Hora inicio</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s6">
                                    <input name="fecha2" type="date" class="datepicker" ng-model="nuevoEvento.fecha2" required>
                                    <label class="active" for="fecha2">Fecha final</label>
                                </div>
                                <div class="col s6">
                                    <input name="hora2" type="time" class="timepicker" ng-model="nuevoEvento.hora2" required>
                                    <label class="active" for="hora2">Hora final</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <input name="descripcion" type="text" class="validate" ng-model="nuevoEvento.descripcion" required>
                                    <label for="descripcion">Descripción</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <a ng-if="agregarEvento.$valid" ng-click="guardarEvento()" class=" modal-action modal-close waves-effect waves-green btn-flat">Agregar</a>
                    </div>
                </div>
            </div>
            <div class="col s4 m3 l2">
                <a class='dropdown-button btn btn-floating btn-large' href='#' data-activates='filtroCal'><i class="material-icons">date_range</i></a>
                <ul id='filtroCal' class='dropdown-content'>
                    <li><a ng-click="changeView('agendaDay', 'myCalendar1')">Día</a></li>
                    <li class="divider"></li>
                    <li><a ng-click="changeView('agendaWeek', 'myCalendar1')">Semana</a></li>
                    <li class="divider"></li>
                    <li><a ng-click="changeView('month', 'myCalendar1')">Mes</a></li>
                </ul>
            </div>
            <!--<button class="btn btn-success" ng-click="changeView('agendaDay', 'myCalendar1')">Día</button>
            <button class="btn btn-success" ng-click="changeView('agendaWeek', 'myCalendar1')">Semana</button>
            <button class="btn btn-success" ng-click="changeView('month', 'myCalendar1')">Mes</button>-->
        </div>
        <div class="row">
            <!-- Modal ifo evento -->
            <div id="infoEvento" class="modal">
                <div class="modal-content center">
                    <div class="row">
                        <a class="red btn btn-floating delete-event right" ng-click="eliminaEvento($index)"><i class="material-icons">delete</i></a>
                    </div>
                    <div class="row">
                        <h2><i class="material-icons large">event</i></h2>
                        <h5>{{info.title}}</h5>
                        <p>Comienza: {{info.start}}</p>
                        <p>Termina: {{info.end}}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
                </div>
            </div>
        </div>
        <div class="alert-success calAlert" ng-show="alertMessage != undefined && alertMessage != ''">
            <h4>{{alertMessage}}</h4>
        </div>
        <div class="row">
            <tab select="renderCalender('myCalendar1');">

                <div class="calendar" ng-model="eventSources" calendar="myCalendar1" ui-calendar="uiConfig.calendar"></div>
            </tab>
        </div>
        <!--<div class="row">
            <ul class="unstyled">
                <li ng-repeat="e in events">
                    <div class="alert alert-info">
                        <a class="close" ng-click="remove($index)"><i class="material-icons right">delete</i></a>
                        <b> <input ng-model="e.title"></b> 
                        {{e.start| date:"MMM dd"}} - {{e.end| date:"MMM dd"}}
                    </div>
                </li>
            </ul>
        </div>-->
    </div>
</section>
<script>
    $(document).ready(function () {
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });
        $('.modal-trigger').leanModal();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 110 // Creates a dropdown of 15 years to control year
        });
        $('.timepicker').pickatime();
    });
</script>