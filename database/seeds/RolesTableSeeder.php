<?php

use Illuminate\Database\Seeder;
use \Camp\Roles;

// composer require laracasts/testdummy
use Laracasts\TestDummy\Factory as TestDummy;

class RolesTableSeeder extends Seeder {

    public function run() {

        DB::table('roles')->delete();
        $roles = array(
            [
                'nombre' => 'Administrador',
                'descripcion' => 'Administrador de la aplicación.'],
            [
                'nombre' => 'Usuario',
                'descripcion' => 'Usuario registrado.'
        ]);
        // Loop through each user above and create the record for them in the database
        foreach ($roles as $user) {
            Roles::create($user);
        }
    }

}
