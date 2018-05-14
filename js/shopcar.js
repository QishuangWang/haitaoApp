$(document).ready(function () {
    $("input[name='check_all_store']").click(function () {
        var store_id = $(this).attr('id');
        var is_all_checked = $(this).prop("checked") == true || $(this).prop("checked") == "checked";
        $("#store_" + store_id + " div input[type=checkbox]").each(function () {
            $(this).prop("checked", is_all_checked);
        });

        ShoppingCar.on_shippingcart_product_changed(store_id);
    });

    $("input:checkbox[id^='check_product_']").click(function () {
        //var ulid = $(this).closest("ul").attr('id');
        //var store_id = ulid.replace("store_pl_", "");
        var store_id = $(this).attr('name');
        var ulid = "store_pl_" + store_id;

        var is_cur_store_checked = true;
        $("#" + ulid + " input:checkbox[id^='check_product_']").each(function () {
            if ($(this).prop("checked") || $(this).prop("checked") == "checked")
                return;
            is_cur_store_checked = false;
        });

        $("#" + store_id).prop("checked", is_cur_store_checked);

        ShoppingCar.on_shippingcart_product_changed(store_id);
    });

    //产品数量改变时
    $('div[id^="store_pl_"] input[id^="num_"]').change(function () {
        if (!(parseInt($(this).val()) > 0)) {
            tips_out_wrong("商品数量须大于0哦");
            $(this).val(1);
        }
        //else
        //var ulid = $(this).closest("ul").attr('id');
        //var store_id = ulid.replace("store_pl_", "");
        var store_id = $(this).attr('name');
        ShoppingCar.on_shippingcart_product_changed(store_id);
    });

    //点击删除
    $('div[id^="store_pl_"] a[id^="del_"]').click(function () {
        if ($(this).prop('disabled') == true) {
            return;
        }

        if (!confirm("是否确认从购物车里移除此产品？"))
            return;
        //var ulid = $(this).closest("ul").attr('id');
        //var store_id = ulid.replace("store_pl_", "");
        var store_id = $(this).attr('name');
        var product_id = $(this).attr('id').replace('del_', '');
//      $.post(
//              '/ajax/car/ajax_tuan_checkout.php',
//              {'action': 'del', 'product_id': product_id},
//              function (msg) {
//                  if (msg.errorMsg != "") {
//                      tips_out_wrong(msg.errorMsg);
//                  }
//                  if ('1' == msg.result) {
//                      $("#car_del_" + product_id).remove();
//                      if ($("#store_pl_" + store_id).children("li").length < 1) {
//                          window.location.reload();
//                      } else {
//                          ShoppingCar.on_shippingcart_product_changed(store_id);
//                      }
//                  }
//              }, "json");
    });

    //点击加一
    $('div[id^="store_pl_"] a[id^="increment_"]').click(function () {
        if ($(this).prop('disabled') == true || $(this).prop('disabled') == "disabled") {
            return;
        }

        //var ulid = $(this).closest("ul").attr('id');
        //var store_id = ulid.replace("store_pl_", "");
        var store_id = $(this).attr('name');
        var id = "num_" + $(this).attr("id").replace("increment_", "");
        $("#" + id).val(parseInt($("#" + id).val()) + 1);
        ShoppingCar.on_shippingcart_product_changed(store_id);
    });

    //点击减一
    $('div[id^="store_pl_"] a[id^="decrement_"]').click(function () {
        if ($(this).prop('disabled') == true || $(this).prop('disabled') == "disabled") {
            return;
        }

        //var ulid = $(this).closest("ul").attr('id');
        //var store_id = ulid.replace("store_pl_", "");
        var store_id = $(this).attr('name');
        var id = "num_" + $(this).attr("id").replace("decrement_", "");
        if (!(parseInt($("#" + id).val()) > 1)) {
            tips_out_wrong('产品数量必须大于0');
            return;
        }
        $("#" + id).val(parseInt($("#" + id).val()) - 1);
        ShoppingCar.on_shippingcart_product_changed(store_id);
    });

    $("select[name='shipping_chennel']").change(function () {
        var store_id = $(this).attr('id').replace("shipping_chennel_", "");
        var channel_id = $(this).val();

//      $.post('/ajax/car/ajax_tuan_checkout.php',
//              {
//                  'chnlid': channel_id,
//                  'action': 'get_channel_intro'
//              },
//              function (msg) {
//                  $("#freight_" + store_id).html(msg.errorMsg != "" ? msg.errorMsg : msg.freight);
//              }, "json");
        ShoppingCar.on_shippingcart_product_changed(store_id);
    });

    //提交订单
    $("#coupon_ul input:radio[name='coupon_radio']").change(function () {
        //var selectedvalue = $("#coupon_ul input:radio[name='coupon_radio']:checked").attr("alt");        
        var coupon_price = parseFloat($(this).attr("alt"));
        $("#used_coupon_price").text(coupon_price);

        var total_order_price = parseFloat($("#total_order_price").text());
        var last_pay_price = total_order_price - coupon_price;
        last_pay_price = !(last_pay_price > 0) ? 0 : last_pay_price;
        $("#last_pay_price").text(last_pay_price.toFixed(2));
    });

    $('input[name="save_button_id"]').click(function () {
        var store_id = $(this).attr('id').replace("save_button_id_", "");
        var product_list = '';
        $("#store_pl_" + store_id + " div[id^='car_del_']").each(function () {
            if (($(this).find("input[type=checkbox]")).prop("checked")) {
                var product_id = $(this).attr("id").replace("car_del_", "");
                var t_num = $(this).find("input#num_" + product_id).val();
                product_list += "#" + product_id + "-" + t_num;
            }
        });

        if (product_list == "") {
            tips_out_wrong("请至少选择一件商品。");
            return;
        }

        var chennel_id = $('#shipping_chennel_' + store_id).val();
        var dom = $("#shopping_car_msg_" + store_id);
        dom.html("");
        tips_in();
        $('#save_button_id_' + store_id).prop('disabled', true);
        var t_d_o_type = $('input[name="t_d_o_type"]') == undefined ? "" : $('input[name="t_d_o_type"]').val();
//      $.post(
//              '/ajax/car/ajax_tuan_checkout.php',
//              {
//                  'action': 'checkout',
//                  'store_id': store_id,
//                  'chnlid': chennel_id,
//                  'product_list': product_list,
//                  't_d_o_type': t_d_o_type
//              },
//              function (msg) {
//                  tips_out("", 0);
//                  $('#save_button_id_' + store_id).prop("disabled", false);
//                  if (msg) {
//                      if (msg.errorMsg != "") {
//                          dom.html(msg.errorMsg);
//                      } else {
//                          window.location.href = msg.url;
//                      }
//                  } else {
//                      dom.html("调用错误");
//                  }
//              }, "json");
    });

    $("#submit_order").click(function () {
        tips_in();

        var address_id = 0;
        $("input[name='r-group-1']").each(function () {
            if ($(this).prop("checked") == true) {
                address_id = $(this).val();
                return false;
            }
        });

        //var address_id = $("input[name='r-group-1'][checked]").val();
        if (address_id == undefined || address_id == 0)
        {
            tips_out_wrong("请选择收货人");
            ///alert("请选择收件人信息");
            return;
        }
        var checkout_ai = $("#tuan_checkout_ai").val();
        if (checkout_ai == undefined || checkout_ai == "")
        {
            tips_out_wrong("订单错误 请重新提交");
            ////alert("请重新提交");
            return;
        }

        //var coupon_id = $("#coupon_ul input:radio[name='coupon_radio']:checked").val();
        var coupon_id = null;
        $("#coupon_ul input:radio[name='coupon_radio']").each(function (index, element) {
            if ($(this).prop("checked") == true) {
                coupon_id = $(this).val();
                return false;
            }
        });

        if (coupon_id == null || coupon_id == undefined)
            coupon_id = 0;
        $("#submit_order").hide();
        ////$("#submit_order_back").html("<img src=\"http://item.haitao.com/img/loading.gif\">");
        var t_d_o_type = $('input[name="t_d_o_type"]') == undefined ? "" : $('input[name="t_d_o_type"]').val();
        var uat = $('input[name="uat"]') == undefined ? "" : $('input[name="uat"]').val();
//      $.post(
//              '/ajax/car/ajax_tuan_checkout.php',
//              {
//                  'action': 'submit_order',
//                  'address_id': address_id,
//                  'checkout_ai': checkout_ai,
//                  'coupon_id': coupon_id,
//                  't_d_o_type': t_d_o_type
//              },
//              function (msg) {
//                  $("#submit_order_back").html("");
//                  if (msg) {
//                      if (msg.errorMsg != "") {
//                          ////$('#submit_order_back').html(msg.errorMsg);
//                          tips_out_wrong(msg.errorMsg);
//                          $("#submit_order").show();
//                          return;
//                      } else {
//                          if (uat == "Haitao_APP") {
//                              callAPP({'action': 'gotoPayment', 'order_code': msg.result, 'payment_amt': "'" + msg.op + "'", 'user_mobile': msg.om, 'user_address': msg.oa, 'user_name': msg.on});
//                              //window.location.href = "http://my.haitao.com/tuan/";
//                          } else {
//                              window.location.href = msg.url;
//                          }
//                      }
//                  } else {
//                      $("#submit_order").show();
//                      tips_out_wrong("订单错误 请重试");
//                      ////$('#submit_order_back').html("调用错误");
//                  }
//              }, "json");
    });

    $("#pay_order").click(function () {
        var order_code = $("#order_code").val();
        if (order_code == undefined || order_code == "") {
            return;
        }
        var balance_payments = $("#balance_payments").val();
        if (balance_payments == undefined)
        {
            tips_out_wrong("请确认是否使用余额支付");
            ////alert("请设置是否使用余额支付");
            return;
        }
        if (balance_payments == "")
        {
            balance_payments = 0;
        }
        //var online_payment_method_id = $("input[name='r-pay-1'][checked]").val();
        var online_payment_method_id = null;
        $("input[name='r-pay-1']").each(function () {
            if ($(this).prop("checked") == true) {
                online_payment_method_id = $(this).val();
                return false;
            }
        });
        if (online_payment_method_id == null || online_payment_method_id == undefined)
        {
            tips_out_wrong("请选择支付方式");
            ///alert("请选择支付方式");
            return;
        }

        $("#pay_order").hide();
        $("#pay_order_back").html("<img src=\"http://item.haitao.com/img/loading.gif\">");
        var t_d_o_type = $('input[name="t_d_o_type"]') == undefined ? "" : $('input[name="t_d_o_type"]').val();
//      $.post(
//              '/ajax/car/ajax_tuan_checkout.php',
//              {
//                  'action': 'tuan_pay',
//                  'balance': balance_payments,
//                  'payment_method': online_payment_method_id,
//                  'order_code': order_code,
//                  't_d_o_type': t_d_o_type
//              },
//              function (msg) {
//                  $("#pay_order_back").html("");
//                  if (msg) {
//                      if (msg.errorMsg == "0") {
//                          $('#pay_order_back').html(msg.result);
//                          window.location.href = msg.url;
//                      } else if (msg.errorMsg == "1") {
//                          $("#pay_1_trade_no").val(msg.result);
//                          document.pay_1_form.submit();
//                      } else if (msg.errorMsg == "3") {
//                          $("#pay_3_trade_no").val(msg.result);
//                          document.pay_3_form.submit();
//                      } else if (msg.errorMsg == "45") {
//                          $("#pay_45_trade_no").val(msg.result);
//                          document.pay_45_form.submit();
//                      } else {
//                          //$("#pay_order").show();
//                          $('#pay_order_back').html(msg.errorMsg);
//                      }
//                      $("#pay_order").show();
//                  } else {
//                      $("#pay_order").show();
//                      tips_out_wrong("调用错误");
//                      ///$('#pay_order_back').html("调用错误");
//                  }
//              }, "json");
    });

});

var ShoppingCar = {
    //计算总价格
    on_shippingcart_product_changed: function (store_id) {
        var shipping_channel_id = $('#shipping_chennel_' + store_id).length > 0 ? $('#shipping_chennel_' + store_id).val() : 0;
        if (!(shipping_channel_id > 0)) {
            return;
        }
        var product_list = '';
        $("#store_pl_" + store_id + " div[id^='car_del_']").each(function () {
            if (($(this).find("input[type=checkbox]")).prop("checked")) {
                var product_id = $(this).attr("id").replace("car_del_", "");
                var t_num = $(this).find("input#num_" + product_id).val();
                product_list += "#" + product_id + "-" + t_num;
            }
        });

        var dom = $("#shopping_car_msg_" + store_id);
        dom.html("");
        tips_in();
        ShoppingCar.on_request_sending();
        $('#save_button_id_' + store_id).prop('disabled', true);
        $("#total_price_span_id_" + store_id).text(0.00);
        $("#shipping_weight_span_id_" + store_id).text(0.00);
        $("#shipping_price_span_id_" + store_id).text(0.00);
        $("#all_price_span_id_" + store_id).text(0.00);
        var t_d_o_type = $('input[name="t_d_o_type"]') == undefined ? "" : $('input[name="t_d_o_type"]').val();
        $.post(
                '/ajax/car/ajax_tuan_checkout.php',
                {
                    'action': 'get_ship_price',
                    'chnlid': shipping_channel_id,
                    'product_list': product_list,
                    't_d_o_type': t_d_o_type
                },
                function (msg) {
                    ///tips_out("", 0);
                    ShoppingCar.on_request_response();
                    var obj = eval("(" + msg + ")");
                    if (typeof (obj) == "object") {//返回1表示成功 

                        var weight_price = Number(obj.price);
                        var product_price = Number(obj.product_price);
                        var sale_price = Number(obj.sale_price);
                        var discount_price = Number(obj.discount_price);
						var daren_price_off = Number(obj.sale_price-obj.discount_price);

                        $("#total_price_span_id_" + store_id).text(product_price.toFixed(2));
                        $("#total_sale_price_span_id_" + store_id).text(sale_price.toFixed(2));
                        $("#total_discount_price_span_id_" + store_id).text(discount_price.toFixed(2));
                        $("#shipping_weight_span_id_" + store_id).text(Number(obj.weight).toFixed(2));
                        $("#shipping_price_span_id_" + store_id).text(weight_price.toFixed(2));
						$("#daren_price_off_span_id_" + store_id).text(daren_price_off.toFixed(2));

                        if (obj.errorMsg != "") {
                            tips_out_wrong(obj.errorMsg);
                            dom.html("<i class='tips'>注意：</i>" + obj.errorMsg);
                            return;
                        } else {
                            tips_out("", 0);
                            dom.html("");
                            $("#all_price_span_id_" + store_id).text((weight_price + product_price).toFixed(2));
                            $('#save_button_id_' + store_id).prop("disabled", false);
                        }
                    } else {
                        tips_out_wrong("服务繁忙请重试");
                        ////dom.html("<i class='tips'>注意：</i> 服务繁忙请重试");
                    }
                });
    }
    ,
    on_request_sending: function () {
        $("input[type=checkbox]").each(function () {
            $(this).prop('disabled', true);
        });

        $("a[id^='decrement_']").each(function () {
            $(this).prop('disabled', true);
        });

        $("a[id^='increment_']").each(function () {
            $(this).prop('disabled', true);
        });

        $("input[id^='num_']").each(function () {
            $(this).prop('disabled', true);
        });

        $("a[id^='del_']").each(function () {
            $(this).prop('disabled', true);
        });
    }
    ,
    on_request_response: function () {
        $("input[type=checkbox]").each(function () {
            $(this).prop('disabled', false);
        });

        $("a[id^='decrement_']").each(function () {
            $(this).prop('disabled', false);
        });

        $("a[id^='increment_']").each(function () {
            $(this).prop('disabled', false);
        });

        $("input[id^='num_']").each(function () {
            $(this).prop('disabled', false);
        });

        $("a[id^='del_']").each(function () {
            $(this).prop('disabled', false);
        });
    }
};

function get_tuan_address(id, ship_id) {
    $('#detail_address').html('');
    if (id == 0) {
        tips_out_wrong("请选择收货地址");
        ////alert("请选择收货地址");
        $('#user_ship_address_id option[value=0]').attr('selected', 'selected');
        //$('#add_sel_back').val("请选择收货地址");
        return;
    }
    var shipping_chennel_id = $('#shipping_chennel').val();
    if (shipping_chennel_id < 1) {
        ////alert("请先选择配送方式");
        tips_out_wrong("请先选择配送方式");
        $('#user_ship_address_id option[value=0]').attr('selected', 'selected');
        //$('#add_sel_back').val("请先选择配送方式");
        return;
    }
    $.post('/ajax/ship/ajax_ship_order.php',
            {
                'address_id': id,
                'ship_id': ship_id,
                'channel_id': shipping_chennel_id,
                'action': 'get_address'
            }, function (obj) {//
        if (obj.errorCode == 1) {
            tips_out_wrong(obj.errorMsg);
            ////alert(obj.errorMsg);
        }
        $('#detail_address').html(obj.errorMsg);
    }, "json");
}