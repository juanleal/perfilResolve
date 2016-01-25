<?php

namespace Camp\Handlers\Events;

use Camp\Events\Usuarios;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use Redis;

class UserUpdatedEventHandler {

    CONST EVENT = 'users.update';
    CONST CHANNEL = 'users.update';

    /**
     * Create the event handler.
     *
     * @return void
     */
    public function __construct() {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Usuarios  $event
     * @return void
     */
    public function handle($event) {
        $redis = Redis::connection();
        $redis->publish(self::CHANNEL, $event);
        dd($redis);
    }

}
