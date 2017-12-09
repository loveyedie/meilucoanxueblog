/**
 * Created by Administrator on 2017/12/7.
 * bootstrapValidate
 * 配置说明
 * @param errContainer  错误显示位置
 * @param raise    时间类型  默认 keyup
 *
 * __RULES__可自己扩展
 */
;(function(root,factory,plug){
    factory.call(root,root.jQuery,plug);
})(this,function($,plug){
    //规则
    var __RULES__ = {
        "required":function(){     //空
            return this.val() != '';
        },
        "minlength":function (num) {  //最小长度
            return this.val().length >= parseInt(num);
        },
        "maxlength":function (num) {   //最大长度
            return this.val().length <= parseInt(num);
        },
        "eamil":function () {   //eamil
            return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.val());
        },
        "equal":function (input) {  //相等
            return this.val() == this.parents("form").find('input[name=' + input + ']').val();
        },
        'mobile':function () {  //手机
            return /^1(3|4|5|7|8)\d{9}$/.test(this.val());
        },
        'personcard': function () {  //身份证
            return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(this.val());
        },
        'isajax': function (param, callback) { //仅供自己使用
            $.get('/api/u?' + param + '=' + this.val(), function (result) {
                callback(result.status);
            });
        }
    };


    var __DEFS__ = {
        errContainer:'.afly-form-err',
        raise:"keyup"
    };

    function showMessage($group,$field,rule,errContainer){
        var msg = $field.data("bv-"+rule+"-message");
        if(errContainer){
            msg && $group.find(errContainer).addClass("text-danger").html(msg);
        }else {
            msg && $field.after('<p class="text-danger">'+ msg +'</p>');
        }
    }

    $.fn[plug] = function(options){
        $.extend(this, __DEFS__, options);
        var errContaner = this.errContainer;
        if(this.is("form")){
            var $fileds = this.find("input,texteara,select");
            var hasErr = {};
            $fileds.on(this.raise,function(){
                var _name = $(this).attr("name");
                var $filed = $(this);
                var $group = $filed.parents(".form-group:first");
                $group.removeClass("has-success has-error");//.removeClass();
                if(errContaner){
                    $group.find(errContaner).removeClass("text-danger").html('');
                }else{
                    $filed.nextAll().remove();
                }

                var result = false;
                var oldVal = $filed.val();
                //1秒内没有输入才做验证
                var timer = setTimeout(function () {
                    var curVal = $filed.val();
                    if(curVal == oldVal){
                        $.each(__RULES__, function(rule, valid) {
                            if($filed.data("bv-"+rule)){
                                if(rule == 'isajax'){
                                    valid.call($filed, $filed.data("bv-"+rule), function (status) {
                                        hasErr[_name] = status ? 1 : 0;
                                        $group.addClass(status ? "has-error" : "has-success");
                                        if(status){
                                            showMessage($group,$filed,rule,errContaner);
                                        }
                                    });
                                }else{
                                    result = valid.call($filed, $filed.data("bv-"+rule));
                                    hasErr[_name] = result ? 0 : 1;
                                    $group.addClass(result?"has-success":"has-error");
                                    if(!result){
                                        showMessage($group,$filed,rule,errContaner);
                                    }
                                }
                            }
                        });
                    }else{
                        clearTimeout(timer);
                    }
                },1000);

            });


            this.submit(function(e){
                e.preventDefault();
                var self = this;
                setTimeout(function () {
                    var errNum = 0;
                    $.each(hasErr,function (n,v) {
                        errNum += v;
                    })
                    if(!errNum) self.submit();
                },1000);
            });

        }else{
            throw new Error("调用的容器必须是个表单容器！");
        }
    }
    $.fn[plug].extendRule = function(rule){
        $.extend(__RULES__ , rule);
    }
},"myValidator");