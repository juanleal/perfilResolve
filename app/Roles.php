<?php

namespace Camp;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model {

    protected $table = 'roles';

    /*public function users() {
        return $this->hasMany('Camp\User', 'role_id', 'id');
    }*/

}
