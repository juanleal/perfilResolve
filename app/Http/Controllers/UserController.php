<?php

namespace Camp\Http\Controllers;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Camp\Http\Requests;
use Camp\User;
use Tymon\JWTAuth\JWTAuth;
use Camp\Http\Controllers\Crypt;
use Hash;

class UserController extends Controller {

    private $req;
    private $user;
    private $jwtAuth;

    function __construct(Request $request, User $user, ResponseFactory $responseFactory, JWTAuth $jwtAuth) {
        $this->req = $request;
        $this->user = $user;
        $this->res = $responseFactory;
        $this->jwtAuth = $jwtAuth;
        $this->middleware('jwtauth', ['except' => ['login', 'getByToken']]);
    }

    /**
     * Login de la app
     *
     * @return Response
     */
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
        try {
            // verify the credentials and create a token for the user
            if (!$token = $this->jwtAuth->attempt($credentials)) {
                return response()->json(['error' => 'credenciales inválidas'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        $user = $this->user->authenticate($this->req->input('email'), $this->req->input('password'));
        // verifica si el usuario está bloqueado
        if ($user->bloqued == 'false') {
            return response()->json(['error' => 'Parece que no tienes permisos'], 401);
        }
        $user['token'] = $this->jwtAuth->fromUser($user);
        return response()->json($user);
    }

    /**
     * Verifica el toooken de sesión del usuario, en otras palabra el estado de sesión
     *
     * @return Response
     */
    public function getByToken() {
        //return $this->jwtAuth->parseToken()->authenticate();

        try {
            if (!$user = $this->jwtAuth->parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());
        }

        // the token is valid and we have found the user via the sub claim
        return $user;
    }

    /**
     * Muestra los usuarios por cada 4 registros para el link de explorar perfiles
     *
     * @return Response
     */
    public function index() {
        return User::where('bloqued', false)->paginate(4);
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
     * Guarda usuarios
     *
     * @return Response
     */
    public function store() {
        $reqUsr = $this->req->all();
        $reqUsr['url'] = Hash::make($this->req->email);
        $user = new User($reqUsr);
        if (!$user->save()) {
            abort(500, 'Could not save user.');
        }
        $user['token'] = $this->jwtAuth->fromUser($user);
        return $user;
    }

    /**
     * Carga la información del perfil de un usuario.
     *
     * @param  int $url
     * @return Response
     */
    public function show($url) {
        $usrIn = $this->req->input('userIn');
        //$this->guardarVisitaPerfil($url, $usrIn);
        $usuario = User::where('url', '=', $url)->where('bloqued', false)->first();
        if ($usuario) {
            $this->guardarVisitaPerfil($usuario, $usrIn);
        }
        return $usuario;
    }

    /*
     * Almacena las visitas de los perfiles que se visitan
     */
    public function guardarVisitaPerfil($newModel, $userIn) {
        if ($newModel->id != $userIn) {
            $newModel->visitas = $newModel->visitas + 1;
            $newModel->save();
        }
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
     * Actualiza el usuario
     *
     * @param  int $id
     * @return Response
     */
    public function update($id) {
        $user = User::find($id);
        $campos = [
            'nombre', 'apellidos', 'fecha', 'url', 'imagen'
        ];
        $newUser = $this->hasesInputs($user, $campos);
        if ($this->req->has('bloqued') && $this->req->has('userIn')) {
            //El administrador no se puede bloquear así mismo
            if ($this->req->input('userIn') == $id) {
                return response()->json([
                            'status' => 401,
                            'error' => 'Hey!, tú eres el admin!'], 401);
            }
            //Garatizar que esta operación sólo la haga el administrador
            if ($this->isAdmin($this->req->has('userIn'))) {
                $newUser->bloqued = $this->req->input('bloqued');
            } else {
                return response()->json(['status' => 401, 'error' => 'Ups!, parece que estás haciendo lo que no debes'], 401);
            }
        }
        if (!$user->save()) {
            abort(500, "Updating failed");
        }
        return $newUser;
    }

    /**
     * Esta función lo que hace es verificar que campos vienen para crear 
     * un nuevo modelo que se va a actualizar
     * @param type $model
     * @param type $arrayInputs
     * @return type
     */
    public function hasesInputs($model, $arrayInputs) {
        foreach ($arrayInputs as $value) {
            if ($this->req->has($value)) {
                $model->$value = $this->req->input($value);
            }
        }
        return $model;
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

    /**
     * Función que verifica si un usuario es administrador
     * @param type $id
     * @return boolean
     */
    public function isAdmin($id) {
        $usr = User::find($id);
        if ($usr->role_id == 1) {
            return true;
        }
        return false;
    }

    /**
     * Función que carga todos los usuarios desde el administrador
     * @return type
     */
    public function usersAdmin() {
        $id = $this->req->input('userId');
        if ($this->isAdmin($id)) {
            return response()->json(['data' => User::all()]);
        }
        return response()->json(['status' => 401, 'error' => 'Ups!, parece que estás buscando lo que no debes'], 401);
    }

}
