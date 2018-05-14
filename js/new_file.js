$(document).ready(function() {
	$("input[type='checkbox']").click(function() {
		var is_all_checked = $(this).prop("checked") == true || $(this).prop("checked") == "checked";
		$(this).attr("checked", is_all_checked);		
		var store_id=$(this).attr("id").replace("chack_pro_","");		
		if($(this).attr("name") == "chack_all") {
			$("#store_"+store_id+" input[type='checkbox']").each(function() {
				$(this).attr("checked", is_all_checked);
				priceTotle("#store_"+store_id);	
			})
		};				
	});
	//点击加一
	$("div[id^='store_pl_'] a[id^='add_btn_']").click(function(){//匹配所有id以store_pl_开头的div里面，所有id以add_btn_开头的a标签
		var store_id=$(this).attr("name");//取出所点击元素的name值
		var id="num_"+$(this).attr("id").replace("add_btn_", "");//定义变量id等于字符串"num_"拼接id末尾的数字
		$("#"+id).val(parseInt($("#"+id).val())+1);//通过val设置input的value值
	});
	//点击减一
	$("div[id^='store_pl_'] a[id^='del_btn_']").click(function(){
		var store_id=$(this).attr("name");//取出所点击元素的name值
		var id="num_"+$(this).attr("id").replace("del_btn_","");
		if (!(parseInt($("#" + id).val()) > 1)) {            
            return;
        }
		$("#" + id).val(parseInt($("#" + id).val()) - 1);		
	});	
})

function priceTotle(store_id){	
	var priceArr=[];	
        $(store_id + " div[id^='car_del_']").each(function () {
            if (($(this).find("input[type=checkbox]")).prop("checked")) {
                var product_id = $(this).attr("id").replace("car_del_", "");
                var t_num = $(this).find("input#num_" + product_id).val();
                var t_price=parseInt($(this).find("b")[0].innerText);
                var t_totle=t_num*t_price;
                console.log(t_totle);
            }
        });
}
