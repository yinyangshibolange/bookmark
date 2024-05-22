(window.onload=function(){document.querySelectorAll("dt > a").forEach(t=>{var e=document.createElement("img");e.setAttribute("src",t.getAttribute("icon")),t.prepend(e)});var s;document.querySelectorAll("dl > dt").forEach(t=>{console.log(t.querySelectorAll("h3"))}),document.querySelectorAll("dt > a");$("dt > a").each(function(t,e){var s=$(`
  <div class="content-item">
  <img src='${$(e).find("img").attr("src")}'>
  <div>${$(e).text()}</div>
  </div>
  `);$(e).html(s)}),$("body").prepend(`
 <div class="controllers">
  <div class="controller-a-btns">
   <a class="" onclick="foldall()">展开所有</a>
   <span>|</span>
   <a class="" onclick="coverItem()">固定宽度</a>
   <span>|</span>
   <a class="active" onclick="autoItem()">不固定宽度</a>
  </div>
 </div> 
 `),window.foldall=function(){$("dt > dl").css("height","auto")},window.coverItem=function(t){$(".controller-a-btns > a").removeClass("active"),$(window.event.target).addClass("active"),$("dt > a ").css("width","200px")},window.autoItem=function(t){$(".controller-a-btns > a").removeClass("active"),$(window.event.target).addClass("active"),$("dt > a ").css("width","auto")},$("body").prepend(`
 <div class="content-search">
  <input id="searchInput" placeholder="请输入关键词">
 </div>
 `),$("#searchInput").on("input",function(t){var e=$(this).val();console.log(e),clearTimeout(s),s=setTimeout(()=>{var s;s=e,$("dt > a > .content-item > div").each(function(t,e){!s||(console.log($(e).text()),-1<$(e).text().indexOf(s))?$(e).closest("dt").show():$(e).closest("dt").hide()})},300)}),$("dt > h3").on("click",function(t){$(this).hasClass("hidden")?($(this).removeClass("hidden"),$(this).siblings("dl").css("height","auto")):($(this).addClass("hidden"),$(this).siblings("dl").css("height","0"))})})();