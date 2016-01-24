/**
 * calendarDemoApp - 0.9.0
 */
var eventos = angular.module('CalendarCtrl', ['ui.calendar'])
        .controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, Eventos, serviceEventos) {
    $scope.events = [];
    $scope.proximos = [];
    $scope.getEventos = function () {
        serviceEventos.getEventos($scope.authenticatedUser.id).then(mostrarEventos);
    }
    
    /*
     * alimenta al model events que son los eventos que se muestran en el calendario
     * @param {type} datos
     * @returns {undefined}
     */
    function mostrarEventos(datos) {
        for (var i = 0; i < datos.data.length; i++) {
            $scope.events.push({
                title: datos.data[i].title,
                start: datos.data[i].start,
                end: datos.data[i].end,
                id: datos.data[i].id
            })
        }
    }
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.info = date;
        $('#infoEvento').openModal();
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            console.log(sources[key])
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    
    /*
     * Agrega un evento al calendario
     * @param {type} objNewEvent
     * @returns {undefined}
     */
    $scope.addEvent = function (objNewEvent) {
        $scope.events.push(objNewEvent);
        toastr.success('Agregaste un nuevo evento!');
        $scope.nuevoEvento = null;
    };

    /*
     * Guarda un evento en la bd
     * @returns {undefined}
     */
    $scope.guardarEvento = function () {
        var eventDefault = $scope.nuevoEvento;
        var objNewEvent = {
            title: $scope.nuevoEvento.descripcion,
            start: $scope.nuevoEvento.fecha1 + ' ' + $scope.nuevoEvento.hora1,
            end: $scope.nuevoEvento.fecha2 + ' ' + $scope.nuevoEvento.hora2,
            className: ['openSesame']
        };
        if ($scope.agregarEvento.$valid) {
            var evento = new Eventos({
                user_id: $scope.authenticatedUser.id,
                title: $scope.nuevoEvento.descripcion,
                start: $scope.nuevoEvento.fecha1 + ' ' + $scope.nuevoEvento.hora1,
                end: $scope.nuevoEvento.fecha2 + ' ' + $scope.nuevoEvento.hora2,
            });
            evento.$save(function (data) {
                $scope.nuevoEvento = angular.copy(eventDefault);
                $scope.agregarEvento.$setPristine();
                $('#addEvent').closeModal();
                $scope.addEvent(objNewEvent);
            }, function (err) {
                toastr.error('Ups!, hubo un error!');
                console.log(err);
            });
        }
    };
    /*
     * Quita un evento del calendario
     * @param {type} index
     * @returns {undefined}
     */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    }
    /*
     * Elimina un elemento de la bd
     * @param {type} index
     * @returns {undefined}
     */
    $scope.eliminaEvento = function (index) {
        var idEliminar = this.info.id;
        $.each($scope.events, function (index, value) {
            if (value.id == idEliminar) {
                $scope.remove(index);
            }
        });
        Eventos.remove({userId: idEliminar}, function (res) {
            $('#infoEvento').closeModal();
            toastr.success('Eliminaste un evento!');
        }, function (err) {
            toastr.error('Ups!, hubo un error eliminando el evento!');
        });
    };
    /*
     * alimenta el model de los próximos eventos
     * @param {type} proximosEventos
     * @returns {undefined}
     */
    function mostrarProximos(proximosEventos) {
        angular.forEach(proximosEventos.data, function (value, key) {
            value.start = new Date(value.start);
            value.end = new Date(value.end);
            $scope.proximos.push(value);
        });
    }
    /*
     * Carga los próximos eventos del usuario logueado
     * @returns {undefined}
     */
    $scope.proximosEventos = function () {
        serviceEventos.getProximos($scope.authenticatedUser.id).then(mostrarProximos);
    }
    /* config object */
    $scope.uiConfig = {
        calendar: {
            editable: false,
            header: {
                center: 'title',
                left: 'today prev,next',
                right: ''
            },
            eventClick: $scope.alertOnEventClick,
            //eventDrop: $scope.alertOnDrop,
            eventDrop: false,
            //eventResize: $scope.alertOnResize,
            eventResize: false,
            //eventRender: $scope.eventRender,
            eventRender: false,
            dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events];

    /*
     * Actualiza el estado de una asistencia a un evento
     * @param {type} $event
     * @returns {undefined}
     */
    $scope.actualizarAsistencia = function ($event) {
        Eventos.update({
            id: $event.target.id,
            asistio: $event.target.checked
        }, function (res) {
            toastr.success('Actualizaste la asistencia a un evento!')
        }, function (err) {
            toastr.error('Ups!, hubo un error!')
            console.log(err);
        });
    };

    /*
     * Verifica a cuantos eventos se han asistido en el último mes
     * @returns {undefined}
     */
    $scope.eventosAsistidos = function () {
        serviceEventos.getAsistidos($scope.authenticatedUser.id).then(function (data) {
            $scope.asistidos = data.data;
        }, function (err) {
            toastr.error('Ups!, No pudimos saber a cuantos eventos has asistido!')
            console.log(err);
        });
    };


    $(document).on('click', '.fc-prev-button', function () {
        $scope.getEventos();
    });
    $(document).on('click', '.fc-next-button', function () {
        $scope.getEventos();
    });
}
/* EOF */

eventos.filter('numeroEventos', function () {
    return function (input) {
        return input>1 || input < 1 ? input + ' eventos' : input + ' evento';
    };
});