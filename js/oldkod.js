var a = [ 'linear',
'quadIn',
'quadOut',
'quadInOut',
'cubicIn',
'cubicOut',
'cubicInOut',
'easeIn',
'easeOut',
'easeInOut',
'quartIn',
'quartOut',
'quartInOut',
'quintIn',
'quintOut',
'quintInOut',
'sineIn',
'sineOut',
'sineInOut',
'expoIn',
'expoOut',
'expoInOut',
'circIn',
'circOut',
'circInOut',
'bounceIn',
'bounceOut',
'bounceInOut',
'elasticIn',
'elasticOut',
'elasticInOut'];



		$('.label').tween({
			opacity: {
				start: 0,
				stop: 100,
				time: 0,
				duration: 1,
				effect: easeType
			}
		}).tween({
			opacity: {
				start: 100,
				stop: 0,
				time: 3,
				duration: 1,
				effect: easeType
			}
		});