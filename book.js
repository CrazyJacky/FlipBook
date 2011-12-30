(function($) {
	$.fn.book = function(params) {
	
		params = $.extend({turn_speed: 500, page_width: 400}, params);
		
		this.each(function() {
			var modal = $(this);
			$(this).dialog({modal: true, width: params.page_width * 2, height: params.page_width, draggable: false, resizable: false, position: "center"});
			
			var left_arrow = $('<a class="left-arrow arrow">&lt;</a>').prependTo($(this)).hide();
			var right_arrow = $('<a class="right-arrow arrow">&gt;</a>').appendTo($(this));
			
			var pages = $(this).find(".page").wrapInner('<div class="page_wrapper" />');
			
			pages.each(function() {
				$(this).children(".page_wrapper").width($(this).width());
			});
			
			var first_page = pages.first();
			first_page.css({'width': params.page_width, 'left': params.page_width});
			
			var page_count = pages.length;
			pages.each(function(index) {
				$(this).css({'z-index': page_count - index, 'left': params.page_width}).addClass("right-side");
			});
			
			$(window).resize(function() {
				modal.dialog({position: "center"});
			});
			
			function FlipLeft() {
				if($(".page_flipping").length == 0) {
					var flip_page = $(".left-side").last();
					var next_page = flip_page.prev(".page");

					var zindexes = $(".right-side").map(function() { return parseInt($(this).css("z-index")); }).toArray();
					var highest_index = (zindexes.length == 0) ? 0 : zindexes.max();
					var first_z = ++highest_index;
					var second_z = ++highest_index;
					
					flip_page.addClass("page_flipping");
					next_page.addClass("page_flipping");

					flip_page.animate({"width": 0, "left": params.page_width}, { duration: params.turn_speed / 2, queue: false, easing: "linear", complete: function() {
						$(this).css({"z-index": first_z, "width": 400}).addClass("right-side").removeClass("left-side");
						$(this).removeClass("page_flipping");
					}});
					
					next_page.css({"width": 0});
					next_page.animate({"left": params.page_width / 2, "width": params.page_width / 2 }, { duration: params.turn_speed / 2, queue: false, easing: "linear", complete: function() {
						$(this).css("z-index", 1000).addClass("right-side").removeClass("left-side");
						
						if($(".left-side").length == 0) {
							left_arrow.hide();
						} else {
							left_arrow.show();
						}
						
						right_arrow.show();
						
						$(this).animate({"left": params.page_width, "width": params.page_width }, { duration: params.turn_speed / 2, queue: false, easing: "linear", complete: function() {
							$(".right-side").css("width", params.page_width);
							$(this).css("z-index", second_z);
							$(this).removeClass("page_flipping");
						}});
					}});
				}
			}
			
			function FlipRight() {
				if($(".page_flipping").length == 0) {
					var flip_page = $(".right-side").first();
					var next_page = flip_page.next(".page");
					next_page.css("left", params.page_width * 2);

					var indexes = $(".left-side").map(function() { return parseInt($(this).css("z-index")); }).toArray();
					var highest_index = (indexes.length == 0) ? 0 : indexes.max();
					var first_z = ++highest_index;
					var second_z = ++highest_index;
					
					flip_page.addClass("page_flipping");
					next_page.addClass("page_flipping");

					flip_page.animate({"width": 0}, { duration: params.turn_speed / 2, queue: false, easing: "linear", complete: function() {
						$(this).css({"left": 0, "z-index": first_z}).addClass("left-side").removeClass("right-side");
						$(this).removeClass("page_flipping");
					}});
					
					next_page.css({"width": 0});
					next_page.animate({"left": params.page_width, "width": params.page_width / 2 }, { duration: params.turn_speed / 2, queue: false, easing: "linear", complete: function() {
						$(this).css("z-index", 1000).addClass("left-side").removeClass("right-side");
						
						if($(".right-side").length == 0) {
							right_arrow.hide();
						} else {
							right_arrow.show();
						}
						
						left_arrow.show();
						
						$(this).animate({"left": 0, "width": params.page_width }, { duration: params.turn_speed / 2, queue: false, easing: "linear", complete: function() {
							$(".left-side").css("width", params.page_width);
							$(this).css("z-index", second_z);
							$(this).removeClass("page_flipping");
						}});
					}});
				}
			}
			
			$("body, .ui-dialog").keyup(function(event) {
				console.log(event.which);
				switch(event.which) {
					case 39: /* right */
					case 32: /* space */
					case 38: /* up */
						FlipRight();
						break;
					case 40: /* down */
					case 37: /* left */
						FlipLeft();
						break;
				}
			});
			
			right_arrow.click( FlipRight );
			left_arrow.click( FlipLeft );
		});
		
		return this;
	}
})(jQuery);