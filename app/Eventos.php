<?php

namespace Camp;

use Illuminate\Database\Eloquent\Model;

class Eventos extends Model {

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'start',
        'end'
    ];

}
