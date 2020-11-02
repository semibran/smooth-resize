let tablist = document.querySelectorAll(".box-tab")
let tabs = document.querySelector(".box-tabs")
let tab = document.querySelector(".box-tab.-select")
let content = document.querySelector(".box-content.-" + tab.id)
let wrap = document.querySelector(".box-wrap")
let animate = false

const switchtab = newtab => {
	// ignore clicks if animating OR tab is already selected
	if (animate || newtab.classList.contains("-select")) return

	// switch tabs
	tab.classList.remove("-select")
	tab = newtab
	tab.classList.add("-select", "-animate")

	// we're animating now; block all clicks
	animate = true

	// start fading out old content
	content.classList.add("-exit")

	// store exact value for height animation
	wrap.style.height = content.clientHeight + "px"

	// add new content, but keep it hidden for now
	let newcontent = document.querySelector(".box-content.-" + newtab.id)
	newcontent.classList.add("-select", "-enter")

	// set new value (triggers animation)
	wrap.style.height = newcontent.clientHeight + "px"

	// remove old content when finished fading out
	content.addEventListener("transitionend", function onexit() {
		content.removeEventListener("transitionend", onexit)
		content.classList.remove("-exit", "-select")

		// only switch if wrap animation is also complete
		if (!wrap.style.height) {
			switchcontent()
		}
	})

	// reset wrap height when finished resizing
	wrap.addEventListener("transitionend", function onresize() {
		wrap.removeEventListener("transitionend", onresize)
		wrap.style.height = null

		// only switch if content animation is also complete
		if (!content.classList.contains("-select")) {
			switchcontent()
		}
	})

	// fade in new content
	function switchcontent() {
		newcontent.classList.remove("-enter")
		newcontent.addEventListener("transitionend", function onenter() {
			newcontent.removeEventListener("transitionend", onenter)
			tab.classList.remove("-animate")
			animate = false
			content = newcontent
		})
	}
}

for (let tab of tablist) {
	tab.addEventListener("click", evt => switchtab(evt.target))
}
