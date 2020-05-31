// mySwiper.appendSlide('<div class="swiper-slide" data-id="4">这是一个新的slide</div>')
(function( win, $ ){
	var baseURL = 'http://192.168.8.239:8888/website-backend'
	win.hostURL = 'http://192.168.8.239:8888'

	var doc = win.document;
	var docEl = doc.documentElement;
	var metaEl = doc.querySelector('meta[name="viewport"]')
	var drp = win.devicePixelRatio || 1;
	if (drp >=3) {
		drp = 3
	} else if(drp >= 2) {
		drp = 2
	} else {
		drp = 1
	}
	var scale = 1 / drp

	if (!metaEl) {
		metaEl = doc.createElement('meta');
		metaEl.setAttribute('name', 'viewport');
		metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', minimum-scale='+ scale + ', maximum-scale=2' );
		if (docEl.firstElementChild) {
			docEl.firstElementChild.appendChild(metaEl);
		} else {
			var wrap = doc.createElement('div');
			wrap.appendChild(metaEl);
			doc.write(wrap.innerHTML);
		}
	}
	
	//公共ajax请求
	win.ajaxCommon = function( type, params, url, successCallback, failCallback) { //ajax通用方法
		type = type || 'get'; //get

		var xhr = $.ajax({
			type: type,
			url: baseURL + url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			timeout: 20000, // 设置超时时间
			data: params,
			dataType: 'json',
			xhrFields: {
				withCredentials: true, //让ajax携带cookie,解决跨域报错问题
			},
			crossDomain: true,
			success: function (data) {
				successCallback && successCallback(data);
			},
			error: function (res,status,e) {
				console.log(res,status,e);
				if( failCallback ) failCallback(res)
			},
			complete: function (XMLHttpRequest, status) {
				if (status === 'timeout') {
					xhr.abort(); // 超时后中断请求
                    console.log()
					location.reload();
				}
			}
		});
	}
	
})( window, jQuery )
