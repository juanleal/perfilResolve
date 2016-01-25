<?php namespace Camp\Events;

use Camp\Events\Event;

use Illuminate\Queue\SerializesModels;

class Usuarios extends Event {

	use SerializesModels;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

}
