<?php

namespace Camp\Http\Controllers;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Camp\Http\Requests;
use Camp\Fotos;
use Tymon\JWTAuth\JWTAuth;
use Camp\Http\Controllers\Crypt;
use Hash;

class FotoController extends Controller {

    private $req;
    private $foto;
    private $jwtAuth;

    function __construct(Request $request, Fotos $foto, ResponseFactory $responseFactory, JWTAuth $jwtAuth) {
        $this->req = $request;
        $this->foto = $foto;
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
        $user = new Fotos($reqFoto);
        if (!$user->save()) {
            abort(500, 'Could not save foto.');
        }
        $user['token'] = $this->jwtAuth->fromUser($user);
        return $user;
    }

    /**
     * Display the specified resource.
     * Consulta las fotos de un usuario
     *
     * @param  int $user_id
     * @return Response
     */
    public function show($user_id) {
        $fotos = Fotos::where('user_id', '=', $user_id)->get();
        $arrFotos = [];
        for ($i = 0; $i < count($fotos); $i++) {
            $arrFotos[$i]['imagen'] = $fotos[$i]->imagen;
        }
        return json_encode($arrFotos);
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
    public function update($id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id) {
        //
    }

}
