function getQueryString (name, url = window.location.href) {
    if (!url || !name) return null
    var reg = new RegExp("([\?&])" + name + "=([^&]*)(&|$)", "i");
    var r = url.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

window.getQueryString = getQueryString

$(document).ready(function() {
    // let images = $(".lazyload");
    // lazyload(images);

    $(".dialog-mask").click(function (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        $(this).parent().hide()
    })

    $(".dialog .dialog-cancel").click(function (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        $(this).closest(".dialog").hide()
    })
})
