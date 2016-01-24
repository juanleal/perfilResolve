<?php

namespace Camp;

use Illuminate\Database\Eloquent\Model;

class Fotos extends Model {

    protected $fillable = [
        'user_id',
        'imagen'
    ];

}
