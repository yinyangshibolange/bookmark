(window.onload = function () {

 const aitem = document.querySelectorAll("dt > a")


 aitem.forEach(item => {
  const image = document.createElement("img")
  image.setAttribute("src", item.getAttribute("icon"))
  item.prepend(image)
 })


 const dldt = document.querySelectorAll("dl > dt")

 dldt.forEach(item => {
  console.log(item.querySelectorAll("h3"))

 })

 const dta = document.querySelectorAll("dt > a")
 $("dt > a").each(function (index, item) {
  const newdiv = $(`
  <div class="content-item">
  <img src='${$(item).find("img").attr("src")}'>
  <div>${$(item).text()}</div>
  </div>
  `)
  $(item).html(newdiv)
 })

 $("body").prepend(`
 <div class="controllers">
  <div class="controller-a-btns">
   <a class="" onclick="foldall()">展开所有</a>
   <span>|</span>
   <a class="" onclick="coverItem()">固定宽度</a>
   <span>|</span>
   <a class="active" onclick="autoItem()">不固定宽度</a>
  </div>
 </div> 
 `)

 window.foldall = function() {
  $("dt > dl").css("height", "auto")
 }

 window.coverItem = function (ev) {
  $(".controller-a-btns > a").removeClass("active")
  $(window.event.target).addClass("active")
$("dt > a ").css("width", "200px")
 }

 window.autoItem = function (ev) {
  $(".controller-a-btns > a").removeClass("active")
  $(window.event.target).addClass("active")
  $("dt > a ").css("width", "auto")
  
 }

 $("body").prepend(`
 <div class="content-search">
  <input id="searchInput" placeholder="请输入关键词">
 </div>
 `)

 function searchFilterContent (searchText) {

  $("dt > a > .content-item > div").each(function (index, item) {
   // console.log(searchText)
   if (!searchText) {
    $(item).closest("dt").show()
   } else {
    console.log($(item).text())
    if ($(item).text().indexOf(searchText) > -1) {
     $(item).closest("dt").show()
    } else {
     $(item).closest("dt").hide()
    }
   }

  })
 }

 var timer
 $("#searchInput").on("input", function (ev) {
  var text = $(this).val()
  console.log(text)
  clearTimeout(timer)
  timer = setTimeout(() => {
   searchFilterContent(text)
  }, 300)
 })



 $("dt > h3").on("click", function (ev) {
  if ($(this).hasClass("hidden")) {
   $(this).removeClass("hidden")
   $(this).siblings("dl").css("height", "auto")
  } else {
   $(this).addClass("hidden")
   $(this).siblings("dl").css("height", "0")
  }
 })
})()