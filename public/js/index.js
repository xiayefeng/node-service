(function( win, doc, $ ){
	var activeTopNavIdx = '1'
	var navArr = []
	var timer = null

	$( '.go-top-btn' ).unbind().bind( 'click', function( e ){
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth'
		})
	})
	window.onscroll = function( e ){
		timer && clearTimeout( timer )
		timer = setTimeout( function(){
			if( window.scrollY > 480 )
			{
				$( '.go-top-btn' ).show()
			}
			else
			{
				$( '.go-top-btn' ).hide()
			}
			timer = null
		}, 100 )
	}
	var scrollDes = [ 500, 1200, 1800, 2450, 2665 ];
	$( '.mid-nav-wrap' ).find( '.mid-nav-item' ).each( function( idx, item ){
		// console.log(item)
		$( item ).data( 'idx', idx ).unbind().bind( 'click', function(){
			var index = $( this ).data( 'idx' )
			window.scroll( {
				top: scrollDes[ index ],
				left: 0,
				behavior: 'smooth'
			} )
		} )
	} )
	$( '.second-btn' ).click( function( e ){
		e.preventDefault()
		// console.log(111)
	} )
	$( '.left-nav' ).find( '.nav-item' ).hover( function(){
		if( !$( this ).hasClass( 'active' ) )
		{
			$( this ).addClass( 'active' ).siblings().removeClass( 'active' )
		}
	} )

	// 获取导航
	function getNav(){
		var data = { orgId: '1' }
		var url = '/admin/menu/getMenuInitTree'
		ajaxCommon( null, data, url, function( res ){
			var arr = res && res.filter(function(item){
				return item.status === 1
			})
			arr.sort(function(a, b){
				return a.orderNum - b.orderNum
			})
			arr && renderTopNav( arr )
		}, function( err ){
			console.log( err )
		} )
	}

	// getNav()


	function renderTopNav( navData ){
		var arr = navData.filter( function( item, idx ){
			return item.status === 1
		} )

		var subArr = []
		arr.map( function( item, idx ){
			if( item.level === 1 ){
				navArr.push( item )
			}else{
				subArr.push( item )
			}
		})
		subArr.sort(function(a, b){
			return a.orderNum - b.orderNum
		})
		var num = 0
		for( var i = 0; i < navArr.length; i++ ){
			for( var j = 0; j < subArr.length; j++ ){
				if( j === 0 ){
					num = 0
				}
				if( navArr[ i ].id === subArr[ j ].pId )
				{
					if( num === 0 )
					{
						navArr[ i ].style = subArr[ j ].style
					}
					num++
					if( navArr[ i ].subMenu )
					{
						navArr[ i ].subMenu.push( subArr[ j ] )
					}
					else
					{
						navArr[ i ].subMenu = [ subArr[ j ] ]
					}
				}
			}
		}

		var navHtml = ''
		navArr.map( function( item, idx ){
			navHtml += '<li class="nav-item pull-left" data-id="' + item.id + '" data-type="' + item.style + '">' + item.name;

			if( item.subMenu ){
				navHtml += '<ul class="top-select-menu hide-item" data-id="' + item.id + '" data-type="' + item.style + '">'
				item.subMenu.map( function( item2, idx2 ){
					navHtml += '<li class="nav-item-submenu" data-id="' + item2.id + '">' + item2.name + '</li>';
				} )
				navHtml += '</ul>'
			}
			navHtml += '</li>'
		} )
		console.log(navArr)
		var $topNav = $( '.top-nav' )
		var rawHtml = $topNav.html()
		rawHtml += navHtml
		$topNav.html( rawHtml )
		bindEvent()
		getBanner()
	}

	// 获取banner图
	function getBanner(){
		var data = { orgId: '1' }
		var url = '/admin/banner/listBanner'
		ajaxCommon( null, data, url, function( res ){
			console.log( res )
			var arr = res && res.rows
			var arr2 = arr.filter(function(item){
				return item.status === 2
			})
			initBanner( arr2 )
		}, function( err ){
			console.log( err )
			alert( err.message )
		} )
	}

	function initBanner( bannerData ){
		var html = ''
		var $swiperWrapper = $( '.swiper-wrapper' )
		bannerData.map( function( item, idx ){
			html += '<div class="swiper-slide banner" data-id="' + item.contentId + '" style="background-image: url(' + hostURL + item.url + ')"></div>'
		})
		$swiperWrapper.html( html )
		var mySwiper = new Swiper( '.swiper-container', {
			autoplay: 3500,//可选选项，自动滑动
			// delay: 2000,
			speed: 1000,
			loop: true,
			pagination: '.swiper-pagination',
		})
		$( '.swiper-container' ).on( 'click', function( e ){
			var $dom = $( e.target )
			var id = $dom.data( 'id' )
			ajaxCommon( null, { id: id }, '/admin/content/findById', function( res ){
				console.log( res )
				var munuId = res.menuId
				navArr.map( function( item ){
					if( item.subMenu ){
						item.subMenu.map( function( item2, idx2 ){
							if( item2.id === munuId )
							{
								var parentId = item.id
								console.log( parentId )
								var $navItem = $( ".nav-item[data-id=" + parentId + "]" )
								$navItem.trigger('click', { trigger: true })
								var type = $navItem.data('type')
								console.log(type)
								if(type === 1){
									$('.container1').find('.list-box').addClass('hide-item')
										.parent().find('.detail-box').removeClass('hide-item')
										.find('.article-title').text(res.name)
										.parent().find('.article-time').text(res.createTimeStr)
										.parent().find('.detail-content').html(res.content)
										.parent().find('.M-box1').addClass('hide-item')
								}else if( type === 2) {
									$('.container2').find('.right-content').html(res.content)
								}else if( type === 3){
									$('.container3').find('.content-list-box4').addClass('hide-item')
										.parent().find('.content-detail4').removeClass('hide-item')
										.parent().find('.M-box3').addClass('hide-item')
										.parent().find('.article-title').text(res.name)
										.parent().find('.detail-content').html(res.content)
								}
							}
						} )
					}
				} )
			}, function( err ){
				console.log( err )
			} )

		} )
	}

	function bindEvent(){
		var timer = null
		var $topNav = $( '.top-nav' )
		$topNav.unbind().bind( 'click', function( e, param ){
			var id = e.target.dataset && e.target.dataset.id || e.target.getAttribute('data-id')
			var dom = e.target
			if( dom.tagName === 'SPAN' ){
				dom = dom.parentNode
				id = dom.dataset && dom.dataset.id || dom.getAttribute( 'data-id' )
			}
			if( !id ){
				return
			}
			if( dom.tagName === 'LI' && id ){
				$( dom ).addClass( 'active' ).siblings().removeClass( 'active' )
				/*	.find('.top-select-menu').addClass('hide-item')
				var $topSelectMenu = $( dom ).find('.top-select-menu')
				if( id > 1 && $topSelectMenu.hasClass('hide-item')){
					$topSelectMenu.removeClass('hide-item')
				}*/

				var type = $( dom ).data( 'type' )
				activeTopNavIdx = id
				navArr.map( function( item, idx ){
					if( item.id === id && type ) {
						var subMenu = item.subMenu
						var $leftNav = $( '.container' + (type || '') ).find( type === 2 ? '.left-nav' : '.left-nav3' )

						if( subMenu&&subMenu.length > 0 ) {
							addLeftNav( $leftNav, subMenu, type )
						} else {
							$leftNav.html('')
						}
						if( type === 2 ){
							var timer = null
							$leftNav.find('.nav-item').unbind().bind( 'mouseenter', function( e ){
								timer && clearTimeout( timer )
								var $nav = $( this )
								timer = setTimeout( function(){
									// console.log($nav)
									if( $nav.hasClass( 'nav-item' ) && $nav.find( '.my-popover' ).children().length === 0 )
									{
										var dataId = $nav.data( 'id' )
										// console.log( dataId )
										// $nav.find( '.my-popover' ).hide()
										getMenuContent( dataId, 2 )
									}else if( $nav.hasClass( 'nav-item' ) && $nav.find( '.my-popover' ).children().length > 0 )	{
										// $nav.find( '.my-popover' ).show()
									}
									timer = null
								}, 200 )
								if( $nav.hasClass( 'nav-item' ) && !$nav.hasClass( 'active' ) )
								{
									$nav.addClass( 'active' ).siblings().removeClass( 'active' )
								}
							} )
							$leftNav.find( '.my-popover' ).unbind().bind( 'click', (function( e ){
								// console.log(this)
								$( this ).addClass('hide-item')
								var $seft = $(this)
								setTimeout(function (){
									$seft.removeClass('hide-item')
								}, 400)
							}) )
						}else if( type === 1) {
							$( '.left-nav3' ).find( '.nav-item' ).unbind().bind( 'click', function(e){
								// console.log($(this).data())
								getMenuContent($(this).data('id'), type)
								$('.right-content3').find('.list-box').removeClass('hide-item')
									.parent().find('.detail-box').addClass('hide-item')
								$( this ).addClass( 'active' ).siblings().removeClass( 'active' )
							} )
						}
					    if( !param ) {
							if( item.subMenu && item.subMenu.length > 0 ){
								var menuId = item.subMenu[ 0 ].id
								console.log( '点击菜单' + menuId )
								getMenuContent( menuId, type )
							} else if( !item.subMenu ) {
								getMenuContent( id, type )
							}
						}
					}
				})
				$( '.container' + (type || '') ).show().siblings().hide()
			}
		} )
		$topNav.find( '.nav-item' ).bind( 'mouseover', function(){
			var id = $( this ).data( 'id' )
			var $topSelectMenu = $( this ).find( '.top-select-menu' )
			$( this ).siblings().find( '.top-select-menu' ).addClass( 'hide-item' )
			timer && clearTimeout( timer )
			// getMenuContent(id, 2)
			if( $topSelectMenu.hasClass( 'hide-item' ) && $topSelectMenu.data( 'id' ) === id )
			{
				$topSelectMenu.removeClass( 'hide-item' )
			}
		} ).bind( 'mouseout', function(){
			var id = $( this ).data( 'id' )
			var $topSelectMenu = $( this ).find( '.top-select-menu' )
			timer = setTimeout( function(){
				$topSelectMenu.addClass( 'hide-item' )
			}, 300 )
		} )
		$( '.top-select-menu' ).find( '.nav-item-submenu' ).unbind().bind( 'click', function( e ){
			e.stopPropagation()
			$( this ).parent().addClass( 'hide-item' )
				.parent().trigger( 'click', { trigger: true } )
			var dom = e.target
			var $dom = $( dom )
			var id = $( dom ).data( 'id' )
			var type = $( this ).parent().data( 'type' )
			getMenuContent(id, type)
			var $leftNav = $( '.container' + (type || '') ).find( type === 2 ? '.left-nav' : '.left-nav3' )
			if( type === 1 )
			{
				$leftNav.find( '.nav-item[data-id=' + id + ']' ).addClass( 'active' ).siblings().removeClass( 'active' )
			}
			else if( type === 2 )
			{
				$leftNav.find( '.nav-item[data-id=' + id + ']' ).addClass( 'active' ).siblings().removeClass( 'active' )

			}
		} )
	}

	function addLeftNav( $el, arr, type ){
		// console.log($el,  arr, type)
		var html = ''
		arr.map( function( item, idx ){
			if( type === 2 ){
				html += '<div class="nav-item ' + (idx === 0 ? 'active' : '') + '" data-id="' + item.id + '" data-type="'+ item.style +'"><span>' + item.name + '</span><div class="my-popover" data-id="' + item.id + '"></div></div>'
			}else{
				html += '<div class="nav-item ' + (idx === 0 ? 'active' : '') + '" data-id="' + item.id + '" data-type="' + item.style +'">' + item.name + '</div>'
			}
		})
		$el.html(html)
	}

	function getMenuContent( id, type  )	{
		var data = {
			menuId: id
		}

		if( type === 1 || type === 3){
			data.page = 1
			data.rows = 10
		}
		var url = '/admin/content/listContent'
		ajaxCommon( null, data, url, function( res ){
			console.log( res )
			var arr = res.rows
			arr.filter(function(item){
				return item.status === 2
			})
			var html = ''
			arr.map(function(item, idx){
              if( type === 2){
				  html += '<div class="popover-item" data-id="'+item.id+'"><img src="'+ hostURL + item.url+'" alt="产品图"><p class="product-name">'+item.name+'</p></div>'
			  }else if( type === 1){
              	html += '<div class="right-item3" data-id="'+item.id+'"><div class="img-box"><img src="'+ hostURL +item.url+'" alt="缩略图"></div><div class="title-box">' +
						'<h4 class="article-title">'+item.name+'</h4><p class="publish-date">'+ item.createTimeStr +'</p></div></div>'
			  }else if( type === 3){
              	html += '<div class="content-list-item" data-id="'+ item.id +'"><div class="img-box4"><img src="'+hostURL +item.url+'" alt="缩略图"></div>' +
						'<div class="title-box4"><h4 class="content-title">'+item.name+'</h4>' +
						'<div class="summary-content">'+item.content+'</div></div></div>'
			  }
			})
			if( (type === 1 || type === 3) && res.total > 10){
				$('.M-box'+ type).removeClass('hide-item').pagination({
					prevContent:'上页',
					nextContent:'下页',
					showData: 10,
					totalData: res.total,
					keepShowPN: true,
                    callback: function(api){
						console.log(api.getCurrent())
                        ajaxCommon(null, {menuId: id, rows: 10, page: api.getCurrent()}, url, function(res){
                           console.log(res)
							var arr = res.rows
							var html  = ''
							arr.filter(function(item){
								return item.status === 2
							})
							arr.map(function(item, idx){
								if( type === 1){
									html += '<div class="right-item3" data-id="'+item.id+'"><div class="img-box"><img src="'+ hostURL +item.url+'" alt="缩略图"></div><div class="title-box">' +
											'<h4 class="article-title">'+item.name+'</h4><p class="publish-date">'+ item.createTimeStr +'</p></div></div>'
								}else if( type === 3){
									html += '<div class="content-list-item" data-id="'+ item.id +'"><div class="img-box4"><img src="'+hostURL +item.url+'" alt="缩略图"></div>' +
											'<div class="title-box4"><h4 class="content-title">'+item.name+'</h4>' +
											'<div class="summary-content">'+item.content+'</div></div></div>'
								}
							})
							if( type === 1 ){
								$( '.container1' ).find( '.list-box' ).html(html)

								$( '.right-content3' ).find( '.right-item3' ).unbind().bind( 'click', function(){
									var id = $(this).data('id')
									var $self = $(this)
									console.log(id)
									ajaxCommon(null, {id: id}, '/admin/content/findById', function(res){
										console.log(res)
										$( '.right-content3' ).find('.detail-box .article-title').text(res.name)
											.parent().find('.article-time').text(res.createTimeStr)
											.parent().find('.detail-content').html(res.content)
									}, function( err ){
										console.log(err)
									})
									$( this ).parent().addClass( 'hide-item' ).parent().find( '.detail-box' ).removeClass( 'hide-item' )
										.parent().find('.M-box1').addClass('hide-item')
								})
							}else if( type === 3 ){
								$( '.container3').find( '.content-list-box4' ).html( html )

								$( '.content-list-box4' ).find( '.content-list-item' ).unbind().bind( 'click', function( e ){
									// console.log(1)
									var id = $(this).data('id')
									ajaxCommon(null, {id: id}, '/admin/content/findById', function(res){
										console.log(res)
										$('.container3').find('.detail-wrap .article-title').text(res.name)
											.parent().find('.detail-content').html(res.content)

									}, function(err){
										console.log(err)
									})
									$( this ).parent().addClass( 'hide-item' ).parent().find( '.content-detail4' ).removeClass( 'hide-item' )
										.parent().find('.M-box3').addClass('hide-item')
								} )
								$( '.content-detail4' ).find( '.nav-box' ).unbind().bind( 'click', function(){
									$( this ).parent().addClass( 'hide-item' ).parent().find( '.content-list-box4' ).removeClass( 'hide-item' )
								} )
							}
						}, function(err){
                        	console.log(err)
						})
					}
				})
			}else{
				if( type === 1){
					$('.container1').find('.M-box1').addClass('hide-item')
				}else if( type === 3) {
					$('.container3').find('.M-box3').addClass('hide-item')
				}
			}
			if( type === 2 ){
				$( '.container2' ).find( '.my-popover[data-id=' + id + ']' ).html( html )
				popoverBindClick()
				$( '.container2' ).find( '.my-popover .popover-item' ).eq(0).trigger('click')
			}else if( type === 1 ){
				$( '.container1' ).find( '.list-box' ).html(html).removeClass('hide-item')
					.parent().find('.detail-box').addClass('hide-item')

				$( '.right-content3' ).find( '.right-item3' ).unbind().bind( 'click', function(){
					var id = $(this).data('id')
					var $self = $(this)
					console.log(id)
					ajaxCommon(null, {id: id}, '/admin/content/findById', function(res){
                       console.log(res)
						$( '.right-content3' ).find('.detail-box .article-title').text(res.name)
							.parent().find('.article-time').text(res.createTimeStr)
							.parent().find('.detail-content').html(res.content)
					}, function( err ){
						console.log(err)
					})
					$( this ).parent().addClass( 'hide-item' ).parent().find( '.detail-box' ).removeClass( 'hide-item' )
						.parent().find('.M-box1').addClass('hide-item')
				})
			}else if( type === 3 ){
				$( '.container3').find( '.content-list-box4' ).html( html )
					.parent().find( '.content-detail4' ).addClass( 'hide-item' )


				$( '.content-list-box4' ).find( '.content-list-item' ).unbind().bind( 'click', function( e ){
					// console.log(1)
					var id = $(this).data('id')
					ajaxCommon(null, {id: id}, '/admin/content/findById', function(res){
						console.log(res)
						$('.container3').find('.detail-wrap .article-title').text(res.name)
							.parent().find('.detail-content').html(res.content)

					}, function(err){
						console.log(err)
					})
					$( this ).parent().addClass( 'hide-item' ).parent().find( '.content-detail4' ).removeClass( 'hide-item' )
						.parent().find('.M-box3').addClass('hide-item')
				} )
				$( '.content-detail4' ).find( '.nav-box' ).unbind().bind( 'click', function(){
					$( this ).parent().addClass( 'hide-item' ).parent().find( '.content-list-box4' ).removeClass( 'hide-item' )
						.parent().find('.M-box3').removeClass('hide-item')
				} )
			}
		}, function( err ){
			console.log( err )
			alert( err.message )
		})
	}

	function popoverBindClick()	{
		$( '.container2' ).find( '.my-popover .popover-item' ).unbind().bind( 'click', function(){
			var $self = $( this )
			var id = $self.data('id')
			console.log(id)
			ajaxCommon(null, {id: id}, '/admin/content/findById', function(res){
				console.log(res)
				$('.container2').find('.right-content').html(res.content)
			}, function(err){
				console.log(err)
			})
			
		} )
		/*$( '.nav-item' ).find( '.btn' ).unbind().bind( 'click', function(){
			var $self = $( this )
			$self.parent().addClass( 'hide-item' )

			setTimeout( function(){
				$self.parent().removeClass( 'hide-item' )
			}, 500 )
		} )*/
	}

})( window, document, jQuery )
