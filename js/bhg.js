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
	 * When a nav button is clicked
	 */
	function onNavClick(ev) {
		let button = ev.currentTarget;

		let page = button.getAttribute('data-page');

		if (page === null || page === '') {
			alert("data-page not defined for anchor #" + button.id);
			return;
		}

		if (pageCached.hasOwnProperty(page)) {
			showPage(page);
		} else {
			cachePage(page);
		}
	}

	/**
	 * On DOM ready
	 */
	function onReady() {
		for (let button of qsa('.nav-button')) {
			button.addEventListener('click', onNavClick);
		}
	}

	window.addEventListener('DOMContentLoaded', onReady);

}());