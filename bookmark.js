(window.onload = function() {

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


})()