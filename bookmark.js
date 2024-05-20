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

 const dta = document.querySelectorAll("dt > a")

 dta.forEach(item => {
  console.log(item.innerHTML)
  const newdiv = document.createElement("div")
  newdiv.innerHTML = item.innerHTML
  item.innerHTML = ""
  item.appendChild(newdiv)
 })
})()