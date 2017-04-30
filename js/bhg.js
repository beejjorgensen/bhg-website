;(function () {
	"use strict";

	let pageCached = {};

	/**
	 * querySelector helper
	 */
	function qs(s) {
		return document.querySelector(s);
	}

	/**
	 * querySelectorAll helper
	 */
	function qsa(s) {
		return document.querySelectorAll(s);
	}

	/**
	 * Show or hide the loading indicator
	 */
	function showLoading(show) {
		let loading = qs("#loading");

		if (show) {
			loading.classList.remove('hidden');
		} else {
			loading.classList.add('hidden');
		}
	}

	/**
	 * Load a page into the cache, then show it
	 */
	function cachePage(page) {
		let pelem = qs('#' + page);

		function stateChange() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					pageCached[page] = true;
					pelem.innerHTML = xhr.responseText;
					showPage(page);

				} else {
					alert("Error loading page " + page + ": " + xhr.status + " " + xhr.statusText);
				}

				showLoading(false);
			}
		}

		let url = pelem.getAttribute('data-url');

		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = stateChange;
		xhr.open('GET', url);
    	xhr.send();

		showLoading(true);
	}

	/**
	 * Shows an already-cached page
	 */
	function showPage(page) {
		for (let p of qs('#content').querySelectorAll('.page')) {
			if (p.id == page) {
				p.classList.remove('hidden');
			} else {
				p.classList.add('hidden');
			}
		}
	}

	/**
	 * Set nav highlights
	 */
	function highlightNav(page) {
		for (let a of qs('#nav').querySelectorAll('a')) {
			let pageRef = a.getAttribute('data-page');

			if (pageRef == page) {
				a.classList.add('current');
			} else {
				a.classList.remove('current');
			}
		}
	}

	/**
	 * Show or cache a page
	 */
	function showOrCache(page) {
		if (pageCached.hasOwnProperty(page)) {
			showPage(page);
		} else {
			cachePage(page);
		}

		highlightNav(page);
	}

	/**
	 * When a nav button is clicked
	 */
	function onNavClick(ev) {
		let button = ev.currentTarget;

		let page = button.getAttribute('data-page');

		if (page === null || page === '') {
			alert("data-page not defined for anchor #" + button.id);
			return;
		}

		showOrCache(page);

		ev.preventDefault();
	}

	/**
	 * On DOM ready
	 */
	function onReady() {
		// We have JS enabled, so remove the hassle screen
		qs("#nojs-site").classList.add("hidden");
		qs("#js-site").classList.remove("hidden");

		for (let button of qsa('.nav-button')) {
			button.addEventListener('click', onNavClick);
		}

		showOrCache('page-main');
	}

	window.addEventListener('DOMContentLoaded', onReady);

}());