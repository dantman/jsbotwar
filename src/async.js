{
	let {TimeUnit, DelayQueue, Delayed} = java.util.concurrent;
	let _queue = new DelayQueue();
	let now = function now() {
		return TimeUnit.NANOSECONDS.toMillis(java.lang.System.nanoTime());
	};
	
	let setDelayed = function setDelayed(fn, milliseconds, interval) {
		var expires = now() + milliseconds;
		var timeout = new JavaAdapter(Delayed, {
			getDelay: function getDelay(unit) {
				return unit.convert(expires-now(), TimeUnit.MILLISECONDS);
			},
			compareTo: function compareTo(d) {
				return this.getDelay(TimeUnit.MILLISECONDS)-d.getDelay(TimeUnit.MILLISECONDS);
			},
			isInterval: function() {
				return interval;
			},
			nextInterval: function() {
				expires += milliseconds;
			},
			run: function() {
				fn();
			}
		});
		_queue.add(timeout);
		return timeout;
	};
	
	function setTimeout(fn, milliseconds) {
		return setDelayed(fn, milliseconds, false);
	};
	
	function setInterval(fn, milliseconds) {
		return setDelayed(fn, milliseconds, true);
	};

	function clearTimeout(timeout) {
		return !!_queue.remove(timeout);
	}

	function async(fn) { return setTimeout(fn, 0); }

	function runAsync(blocking) {
		var d = _queue[blocking===false?"poll":"take"]();
		if ( !d )
			return false;
		
		if ( d.isInterval() ) {
			d.nextInterval();
			_queue.put(d);
		}
		
		try {
			d.run();
		} catch(e) {
			print(e);
		} finally {
			return true;
		}
	}

	function runAllAsync() {
		while(!!_queue.size())
			runAsync(true);
	}
}
