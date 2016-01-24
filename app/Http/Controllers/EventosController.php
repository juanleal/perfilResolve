<?php

namespace Camp\Http\Controllers;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Camp\Http\Requests;
use Camp\Eventos;
use Tymon\JWTAuth\JWTAuth;
use Camp\Http\Controllers\Crypt;
use Hash;

class EventosController extends Controller {

    private $req;
    private $eventos;
    private $jwtAuth;

    function __construct(Request $request, Eventos $eventos, ResponseFactory $responseFactory, JWTAuth $jwtAuth) {
        $this->req = $request;
        $this->eventos = $eventos;
        $this->res = $responseFactory;
        $this->jwtAuth = $jwtAuth;
        $this->middleware('jwtauth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        $reqFoto = $this->req->all();
        $user = new Eventos($reqFoto);
        if (!$user->save()) {
            abort(500, 'Could not save evento.');
        }
        $user['token'] = $this->jwtAuth->fromUser($user);
        return $user;
    }

    /**
     * Display the specified resource.
     *
     * @param  int $user_id
     * @return Response
     */
    public function show($user_id) {
        $fotos = Eventos::where('user_id', '=', $user_id)->get();
        /* $arrFotos = [];
          for ($i = 0; $i < count($fotos); $i++) {
          $arrFotos[$i]['imagen'] = $fotos[$i]->imagen;
          } */
        return json_encode($fotos);
    }

    /*
     * Consulta los próximos eventos de un usuario
     */
    public function proximos() {
        $user_id = $this->req->input('userId');
        $proximos = Eventos::where('user_id', '=', $user_id)->where('start', '>=', date('Y-m-d'))->get();
        return json_encode($proximos);
    }

    /*
     * Verifica cuantos eventos ha asistido un usuario
     */
    public function asistidos() {
        $user_id = $this->req->input('userId');
        $fechaFinal = date('Y-m-d');
        $fechaInicial = date('Y-m-d', strtotime('-1 month', strtotime($fechaFinal)));
        $asistidos = Eventos::where('user_id', '=', $user_id)
                ->where('asistio', '=', true)
                ->where(function($query) use ($fechaInicial, $fechaFinal) {
                    $query->where('start', '>=', $fechaInicial)
                    ->where('start', '<', $fechaFinal);
                })
                ->get();
        return json_encode($asistidos);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update() {
        $id = $this->req->input('id');
        $post = Eventos::find((int) $id);
        $post->asistio = $this->req->input('asistio');
        if (!$post->save()) {
            abort(500, "Saving failed");
        }
        return $post;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id) {
        return Eventos::destroy($id);
    }

}
