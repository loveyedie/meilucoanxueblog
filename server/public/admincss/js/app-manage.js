$('[data-toggle="hover"]').on('mouseover', function (e) {
    e.preventDefault();
    var $this = $(this);
    $('#' + $this.data('target')).removeClass('hide');
});

$('[data-toggle="hover"]').on('mouseout', function (e) {
    e.preventDefault();
    var $this = $(this);
    $('#' + $this.data('target')).addClass('hide');
});

$('[data-toggle="fullscreen"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $target = $($this.data('target'));
    if ($target.hasClass('fullscreen')) {
        $($this.data('target')).removeClass('fullscreen');
    } else {
        $($this.data('target')).addClass('fullscreen');
    }
});

$('[data-toggle="confirm"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var msg = $this.data('message');
    if (confirm(msg)) {
        location.href = $this.attr('href');
    }
});
var editor = new Editor({
    element: document.getElementById('editor')
});
if (document.querySelector('textarea')) {
    editor.render();
}

$('#shareUrl').on('blur', function () {
    var url = this.value;
    $.get('/dashboard/p/getTitleByUrl?url=' + url, function (data) {
        console.log(data);
        $('#shareTitle').val(data);
    });
});
if($(".js-afly-upload").length) uploadUserPic();

function uploadUserPic() {
    var canClick = true;
    $(".js-afly-upload").bind("click", function (e) {
        if(!canClick) return;
        canClick = false;
        var uploadfrom = $(".js-afly-upload").data("upload");
        console.log(uploadfrom);
        var file = $(".afly-hidden-file")[0].files[0];
        if(!file) return;
        var formdata = new FormData();
        formdata.append('avatar', file);
        console.dir(formdata.get("avatar"));
        $.ajax({
            url: '/uploadfile/' + uploadfrom + '?v=' + new Date().getTime(),
            type: 'post',
            data: formdata,
            dataType: 'JSON',
            //async:false,
            //cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if(data.status){
                    $(".js-user-pic").attr("src", data.result.picUrl).data("picId", data.result.picId);
                    $(".js-afly-userpic").val(data.result.picUrl);
                }else{
                    alert(data.message);
                }
                $(".afly-hidden-file").val('');
                canClick = true;
                console.log("upload success!");
            },
            error: function (err) {
                alert("大爷，不好意思，服务器出错了!"+err);
                canClick = true;
            }
        });
    })
}