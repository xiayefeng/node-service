// mySwiper.appendSlide('<div class="swiper-slide" data-id="4">这是一个新的slide</div>')
(function( win, $ ){
	var isHome = false
	var prefix = ''
	console.log(location.pathname)
	if( location.pathname.indexOf( 'index' ) > -1 || location.pathname === '/') {
		isHome = true
		prefix = 'html/'
	}

console.log(isHome)
	if( !isHome ) {
		$( '.head' ).load('common/header.html', function( res ){
			$( this ).empty().append( res )
			bindEvent(prefix)
			switchNav()
		} )
		$( '.foot' ).load( 'common/footer.html', function( res ){
			$( this ).empty().append( res )

		} )
	} else {
		bindEvent(prefix)
		switchNav()
	}

	function bindEvent(prefix) {
		$( '.top-nav' ).unbind().bind( 'click', function( e ){
			console.log(222)
			var id = e.target.dataset.id
			var dom = e.target
			if( dom.tagName === 'LI' ) {
				$( dom ).addClass( 'active' ).siblings().removeClass( 'active' )
			}
			if( id === '1' )
			{
				location.href = prefix ? 'index.html': '../index.html'
			}
			else if( id === '2' )
			{
				location.href = prefix + 'product-introduce.html'
			}
			else if( id === '3' )
			{
				location.href = prefix + 'news.html'
			}
			else if( id === '4' )
			{
				location.href = prefix + 'cooperative-partner.html'
			}
			else if( id === '5' )
			{
				location.href = prefix + 'channel-cooperation.html'
			}
		} )
	}

	function switchNav() {
		var pathname = location.pathname
		if( pathname.indexOf( 'index.html' ) > -1 ) {
			$('.top-nav').find('.nav-item').eq(0).addClass('active').siblings().removeClass('active')
		}else if( pathname.indexOf('product-introduce.html') > -1 ){
			$('.top-nav').find('.nav-item').eq(1).addClass('active').siblings().removeClass('active')
		}else if( pathname.indexOf('news.html') > -1 ) {
			$('.top-nav').find('.nav-item').eq(2).addClass('active').siblings().removeClass('active')
		}else if( pathname.indexOf('cooperative-partner.html') > -1  ) {
			$('.top-nav').find('.nav-item').eq(3).addClass('active').siblings().removeClass('active')
		}else if( pathname.indexOf('channel-cooperation.html') > -1  ) {
			$('.top-nav').find('.nav-item').eq(4).addClass('active').siblings().removeClass('active')
		}

	}

})( window, jQuery )
