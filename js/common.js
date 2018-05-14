$(document).ready(function() {
	$(document).off('click.bs.dropdown.data-api');
});

$(document).ready(function() {
	dropdownOpen(); //调用
});
/**
 * 鼠标划过就展开子菜单，免得需要点击才能展开
 */
function dropdownOpen() {
	var $dropdownLi = $('li.dropdown');
	$dropdownLi.mouseover(function() {
		$(this).addClass('open');
	}).mouseout(function() {
		$(this).removeClass('open');
	});
}

//$(window).load(function() {
//	$("img").lazyload({});
//});

var success_tips = "<p><span class='fa fa-check-circle fa-3x'></span><br>成功</p>";

/////
if($('#articl-affix-left').lenth != 0) {
	var affix_left_width = $("#articl-affix-left").width();
	jQuery(window).scroll(function() {
		$("#articl-affix-left").css("width", affix_left_width);
	});
}

if($('#articl-affix-right').lenth != 0) {
	var affix_right_width = $("#articl-affix-right").width();
	jQuery(window).scroll(function() {
		$("#articl-affix-right").css("width", affix_right_width);
	});
}

$(document).on("hidden.bs.modal", ".modal:not(.local-modal)", function(e) {
	$(e.target).removeData("bs.modal").find(".modal-content").empty();
});

/*描点*/
function goto(elements) {
	var pos = 0;
	if(elements) {
		pos = $("#" + elements).offset().top;
	};
	$("html,body").animate({
		scrollTop: pos - 20
	}, 300);
}
$(function() {
	$("#side_them_nav a").click(function() {
		$("#side_them_nav a").removeClass("active");
		$(this).addClass("active");
	});
});

///弹窗初始化
$(function() {
	$('[data-toggle="popover"]').popover()
})
///提示
$(function() {
	$('[data-toggle="tooltip"]').tooltip()
})

///提示进入
function tips_in() {
	var content = "<span class='fa fa-refresh fa-spin'></div>";
	$("#web_back_tips").html(content);
	$('#web_back_tips').fadeIn();
}
///关闭
function tips_out(msg, time, pid) {
	if(!time) {
		var time = "500";
	}
	if(!pid) {
		var pid = "web_back_tips";
	}
	if(msg) {
		$("#" + pid).html(msg);
		$("#" + pid).fadeIn();
	}
	$("#" + pid).fadeOut(time);
}

///需手动关闭
function tips_out_wrong(msg) {
	$("#web_back_tips").html("<p>" + msg + "</p><p><a href=\"javascript:void(0)\"  onclick=\"tips_out();return false;\" class='btn btn-danger btn-sm'>知道了</a></p>");
	$('#web_back_tips').fadeIn();
}

///延迟刷新页面
function page_reload() {
	setTimeout(function() {
		document.location.reload();
	}, 1000);
}

//收藏通用
function collect(ptype, id, type) {
	tips_in();
	var collect_num = parseInt($("#collect_num_" + ptype + "_" + id).text());
	if(isNaN(collect_num)) {
		collect_num = 0;
	}
	$.post('/ajax/collect.php', {
		'ptype': ptype,
		'id': id,
		'type': type
	}, function(msg) { //
		if('1' == msg) {
			if(type == 1) {
				tips_out(success_tips);
				$("#collect_btn_" + ptype + "_" + id).addClass("btn-warning");
				$("#collect_fa_" + ptype + "_" + id).addClass("text-gold");
				$("#collect_num_" + ptype + "_" + id).text(collect_num + 1);
			}
			if(type == 2) {
				tips_out(success_tips);;
				$("#collect_btn_" + ptype + "_" + id).removeClass("btn-warning");
				$("#collect_btn_" + ptype + "_" + id).addClass("btn-default");
				$("#collect_fa_" + ptype + "_" + id).removeClass("text-gold");
				$("#collect_num_" + ptype + "_" + id).text(collect_num - 1);
			}
		} else {
			tips_out_wrong(msg);
		};
	});
}

///点赞通用
function dig(ptype, id) {
	tips_in();
	var dig_num = parseInt($("#dig_num_" + ptype + "_" + id).text());
	if(isNaN(dig_num)) {
		dig_num = 0;
	}
	$.post('/ajax/dig.php', {
		'id': id,
		'ptype': ptype
	}, function(msg) { //
		if('1' == msg) {
			tips_out(success_tips);
			$("#dig_btn_" + ptype + "_" + id).addClass("btn-warning");
			$("#dig_fa_" + ptype + "_" + id).addClass("text-gold");
			$("#dig_num_" + ptype + "_" + id).text(dig_num + 1);
		} else {
			tips_out_wrong(msg);
		}
	});
}

///添加购物车
function add_car(pid, store_id, ptype) {
	var action = "add_car";
	var user_hart = parseInt($("#tuan_car_num").text());
	tips_in();
	$.post('/ajax/tuan/shopping_car.php', {
		'pid': pid,
		'action': action,
		'ptype': ptype
	}, function(msg) { //
		if('1' == msg) {
			$("#tuan_car_num").text(user_hart + 1);
			var content = "<p>已放入购物车</p>";
			tips_out(content, 3000);
		} else {
			var content = '<p>' + msg + '</p>';
			tips_out(content, 2000);
		}
	});
}
///APP
function setupWebViewJavascriptBridge(callback) {
	if(window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if(window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() {
		document.documentElement.removeChild(WVJBIframe)
	}, 0);
}

function callAPP(data) {

	try {

		var kvs = '';
		for(var k in data) {
			if(k != 'action') {
				kvs += '"' + k + '":"' + data[k] + '",';
			}
		}
		kvs = kvs.slice(0, -1);

		var d = JSON.parse('{"action":"' + data.action + '","data":{' + kvs + '}}');

		window.webkit.messageHandlers.core.postMessage(d);

	} catch(err) {
		console.log('ERR-Catched:' + err.message);
	}

	setupWebViewJavascriptBridge(function(bridge) {
		bridge.callHandler('HTAPP_native', data, function responseCallback(responseData) {
			console.log("JS received response:", responseData)
		});
	});
	WebViewJavascriptBridge.callHandler(
		'submitFromWeb', data,
		function(responseData) {}
	);
}
//返回顶部
function backToTop() {
	var $backToTopEle = $('<div class="backToTop"><span class="fa fa-chevron-up" aria-hidden="true"></span></div>').appendTo($("body")).click(function() {
		$("html, body").animate({
			scrollTop: 0
		}, 120);
	});
	var $backToTopFun = function() {
		var st = $(document).scrollTop(),
			winh = $(window).height();
		(st > 0) ? $backToTopEle.show(): $backToTopEle.hide();
		//IE6下的定位
		if(!window.XMLHttpRequest) {
			$backToTopEle.css("top", st + winh - 166);
		}
	};
	$(window).bind("scroll", $backToTopFun);
	$backToTopFun();
}

///快速写分享
function share_quick_add() {
	tips_in();
	var action = "share_edit";
	$("#quick_share_add_btn").addClass("disabled");
	var count = 0;
	var images = new Array();
	$("#image_zone_share_quick_add  img[id^='myImage_']").each(function() {
		count++;
		if($(this).attr("src") != null && $(this).attr("src") != "") {
			images.push($(this).attr("src"));
		}
	});
	if(count > 6) {
		tips_out_wrong("图片一次性最多6张");
		return;
	}
	var info = $('#quick_share_add_info').val();
	var asso_type = $('#qucik_share_add_asso_type').val();
	var url = $('#qucik_share_add_url').val();
	var sku_id = $('#qucik_share_add_tuan_id').val();
	var product_id = $('#qucik_share_add_product_id').val();
	var upc_id = $('#qucik_share_add_upc_id').val();
	var store_id = $('#qucik_share_add_store_id').val();
	var coupon_code = $('#qucik_share_add_coupon_code').val();
//	$.post('/ajax/share/edit.php', {
//			'action': action,
//			'pic': images,
//			'info': info,
//			'asso_type': asso_type,
//			'url': url,
//			'sku_id': sku_id,
//			'product_id': product_id,
//			'upc_id': upc_id,
//			'store_id': store_id,
//			'coupon_code': coupon_code
//		},
//		function(msg) { //
//			if('1' == msg) {
//				tips_out(success_tips);
//				page_reload();
//			} else if('请先验证手机' == msg) {
//				tips_out();
//				mobile_edit();
//			} else if('0' == msg) {
//				tips_out_wrong("发布失败 请重试");
//				$("#quick_share_add_btn").removeClass("disabled");
//			} else if(msg > 1) {
//				tips_out(success_tips);
//				url = "/share/" + msg + ".html";
//				window.location = url;
//			} else {
//				tips_out_wrong(msg);
//				$("#quick_share_add_btn").removeClass("disabled");
//			}
//		});
}

function no_img(s) {
	var img = event.srcElement;
	img.src = "https://static.haitao.com/img/2016/no/" + s + ".jpg";
	img.onerror = null;
}

//添加评论
function add_review(ptype, pid, review_id) {
	var action = 'add_review';
	var review_info = $('#review_info_' + ptype + "_" + pid + "_" + review_id).val();
	$("#review_add_btn").addClass("disabled");
	var count = 0;
	var images = new Array();
	$("#image_zone_review_" + ptype + "_" + pid + "_" + review_id + " img[id^='myImage_']").each(function() {
		count++;
		if($(this).attr("src") != null && $(this).attr("src") != "") {
			images.push($(this).attr("src"));
		}
	});
	if(count > 3) {
		tips_out_wrong("一次最多3张图片");
		$("#review_add_btn").removeClass("disabled");
		return;
	}
	tips_in();
//	$.post('/ajax/review.php', {
//		'ptype': ptype,
//		'pid': pid,
//		'review_id': review_id,
//		'action': action,
//		'review_info': review_info,
//		'pic': images
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out(success_tips);
//			page_reload();
//		} else if('请先验证手机' == msg) {
//			$("#review_add_btn").removeClass("disabled");
//			tips_out();
//			mobile_edit();
//		} else {
//			tips_out(msg, 2000);
//			$("#review_add_btn").removeClass("disabled");
//		}
//	});
};

//编辑评论
function review_edit(ptype, id) {
	var action = 'review_edit';
	if(ptype == 2) {
		if(!confirm("确认删除？"))
			return;
	}
	tips_in();
	var review_info = $('#review_edit_' + id).val();
	$("#review_edit_btn").addClass("disabled");
//	$.post('/ajax/review.php', {
//		'action': action,
//		'ptype': ptype,
//		'id': id,
//		'review_info': review_info
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out(success_tips);
//			page_reload();
//		} else {
//			tips_out(msg, 2000);
//			$("#review_edit_btn").removeClass("disabled");
//		}
//	});
};

///添加分享清单商品
function share_qingdan_add(type, id) {
	var action = "share_qingdan_add";
	var share_id = $("input[name='share_radio']:checked").val();
	var intro = $('#share_qindan_intro').val();
	tips_in();
//	$.post('/ajax/share/qingdan.php', {
//		'action': action,
//		'type': type,
//		'id': id,
//		'share_id': share_id,
//		'intro': intro
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out(success_tips);
//			page_reload();
//		} else {
//			tips_out_wrong(msg);
//		}
//	});
}

///SKU相关商品
function sku_pop_more(id) {
	var action = "sku_pop_more";
	var data = "action=sku_pop_more&id=" + id;
	$("#more_sku a").removeClass("btn-warning");
	$("#pop_sku_" + id).addClass("btn-warning");
//	$.getJSON("/ajax/tuan/sku_more.php", data, function(json) {
//		var new_pic = json.pic;
//		var new_sku_id = json.id;
//		var buy_status = json.buy_status;
//		$("#pop_sku_id").html(new_sku_id);
//		$("#pop_sku_price").html(json.price);
//		$("#pop_sku_pic").attr("src", new_pic);
//		if(buy_status == 1) {
//			$("#pop_sku_add_car").attr("onclick", "add_car(" + new_sku_id + ");return false;");
//			$("#pop_sku_add_car").text("放入购物车");
//			$("#pop_sku_add_car").removeClass("btn-info");
//			$("#pop_sku_add_car").addClass("btn-danger");
//		} else if(buy_status == 0) {
//			$("#pop_sku_add_car").attr("onclick", "collect(5," + new_sku_id + ",1);return false;");
//			$("#pop_sku_add_car").text("到货提醒我");
//			$("#pop_sku_add_car").removeClass("btn-danger");
//			$("#pop_sku_add_car").addClass("btn-info");
//		}
//
//		$("#pop_sku_url").attr("href", "/tuan/view.php?id=" + new_sku_id);
//	});
}

///pricerenew
function price_renew(id, huilv) {
	var action = "price_renew";
	var seller_price = $("#seller_price").text();
	var china_price = $("#china_price").text();
	$('#price_renew_load').html("更新中…");
//	$.post('/ajax/faxian/price_renew.php', {
//		'action': action,
//		'id': id
//	}, function(msg) { //
//		if('' == msg) {
//			$('#seller_price').html(seller_price);
//			$('#china_price').html(china_price);
//			$('#price_renew_load').html("");
//		}
//		if(0 == msg) {
//			////$('#seller_price').html(seller_price);
//			$('#price_renew_load').html("");
//		} else {
//			$('#seller_price').html(msg);
//			$('#china_price').html(Math.round(msg * huilv, 2));
//			$('#price_renew_load').html("");
//		}
//	});
}
///降价提醒
function price_notic_edit(id, type) {
	var action = 'price_notic_edit';
	var price = $('#price_notic').val();
	tips_in();
//	$.post('/ajax/faxian/product.php', {
//		'id': id,
//		'action': action,
//		'type': type,
//		'price': price
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out(success_tips, 1000);
//			page_reload();
//		} else if('2' == msg) {
//			tips_out("取消成功", 1000);
//			page_reload();
//		} else {
//			tips_out_wrong(msg);
//		}
//	});
};

///滑动到回复并弹出评论
function go_share_add_topic(id, elements) {
	goto(elements);
	if($('#modal').hasClass('in')) {
		$('#modal').modal('hide');
	}
	$('#modal').modal({
		backdrop: 'static',
		keyboard: false,
		remote: '/modal/?action=2&asso_type=3&asso_id=' + id + '&them_type=1'
	});
};

///删除分享关联
function del_share_upc(id) {
	var action = "del_share_upc";
	tips_in();
//	$.post('/ajax/share/edit.php', {
//		'action': action,
//		'id': id
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out();
//			///page_reload();
//			$('#share_asso_' + id).fadeOut("slow", 0);
//		} else {
//			tips_out_wrong(msg, 2000);
//		}
//	});
}

///回复分页
function share_review_page(id, page) {
	tips_in();
	var action = "share_review_page";
//	$.post('/ajax/share/review_page.php', {
//		'action': action,
//		'id': id,
//		'page': page
//	}, function(msg) { //
//		tips_out();
//		if('1' == msg) {
//			$('#review_list').html(msg);
//		} else {
//			$('#review_list').html(msg);
//		}
//	});
}

///sharee
function share_manage(id, type) {
	var action = "share_manage";
	if(!confirm("确认提交？"))
		return;
	tips_in();
//	$.post('/ajax/share/manage.php', {
//		'action': action,
//		'id': id,
//		'type': type
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out(success_tips, 1000);
//			page_reload();
//		} else {
//			tips_out_wrong(msg, 2000);
//		}
//	});
}

///手机验证
function mobile_edit() {
	if($('#modal').hasClass('in')) {
		$('#modal').modal('hide');
	}
	$('#modal').modal({
		backdrop: 'static',
		keyboard: false,
		remote: '/modal/index.php?action=10'
	});
}

///weibo
function weibo_post(id, type, admin_id, channel_id) {
	var action = "weibo_post";
	if(!confirm("确认提交？"))
		return;
	tips_in();
//	$.post('/ajax/share/weibo.php', {
//		'action': action,
//		'id': id,
//		'type': type,
//		'admin_id': admin_id,
//		'channel_id': channel_id
//	}, function(msg) { //
//		if('1' == msg) {
//			tips_out(success_tips, 1000);
//			/////page_reload();
//		} else {
//			if(msg == "授权错误") {
//				tips_out_wrong("授权错误", 1000);
//			} else {
//				tips_out_wrong(msg, 2000);
//			}
//		}
//	});
}

///复制
if($(".copy").length) {
	var clipboard = new Clipboard('.copy');
	clipboard.on('success', function(e) {
		console.log(e);
		tips_out("<p><span class='fa fa-check-circle fa-3x'></span></p><p>复制成功</p>", 3000);
	});
	clipboard.on('error', function(e) {
		console.log(e);
		tips_out("复制失败", 2000);
	});
}
///////时间
function calcTime(city, offset) {
	var d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = new Date(utc + (3600000 * offset));
	var gmtTime = new Date(utc)
	var day = nd.getDate();
	var month = nd.getMonth();
	var year = nd.getYear();
	var hr = nd.getHours(); //+ offset 
	var min = nd.getMinutes();
	var sec = nd.getSeconds();
	if(year < 1000) {
		year += 1900
	}
	//var monthArray = new Array("1月", "2月", "March", "April", "May", "June", "July", "August", 
	//"September", "October", "November", "December") 
	var monthArray = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12")
	var monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31")
	if(year % 4 == 0) {
		monthDays = new Array("31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31")
	}
	if(year % 100 == 0 && year % 400 != 0) {
		monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31")
	}
	if(hr >= 24) {
		hr = hr - 24
		day -= -1
	}
	if(hr < 0) {
		hr -= -24
		day -= 1
	}
	if(hr < 10) {
		hr = " " + hr
	}
	if(min < 10) {
		min = "0" + min
	}
	if(sec < 10) {
		sec = "0" + sec
	}
	if(day <= 0) {
		if(month == 0) {
			month = 11
			year -= 1
		} else {
			month = month - 1
		}
		day = monthDays[month]
	}
	if(day > monthDays[month]) {
		day = 1
		if(month == 11) {
			month = 0
			year -= -1
		} else {
			month -= -1
		}
	}
	return city + "：" + year + "年" + monthArray[month] + "月" + day + "日" + hr + ":" + min + ":" + sec
}

function worldClockZone() {
	document.getElementById('localutc_time').innerHTML = "本地时间：" + (new Date()).toLocaleString();
	////document.getElementById('portland_time').innerHTML = calcTime('美国波特兰', '-8'); 
	document.getElementById('losangeles_time').innerHTML = calcTime('美国洛杉矶', '-8');
	document.getElementById('frankfurt_time').innerHTML = calcTime('德国法兰克福', '+1');
	document.getElementById('tokyo_time').innerHTML = calcTime('日本大阪', '+9');
	document.getElementById('london_time').innerHTML = calcTime('英国伦敦', '+1');
	document.getElementById('sydney_time').innerHTML = calcTime('澳洲悉尼', '+11');
	setTimeout("worldClockZone()", 1000)
}