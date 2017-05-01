;(function () {
	"use strict";

	const MAINPAGE = 'page-main';

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
			let nextPage;

			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					pageCached[page] = true;
					pelem.innerHTML = xhr.responseText;
					addNavClickHandlers(pelem);
					nextPage = page;

				} else {
					alert("Error loading page " + page + ": " + xhr.status + " " + xhr.statusText);
					nextPage = MAINPAGE;
				}

				showPage(page);
				showLoading(false);
			}
		}

		let url = pelem.getAttribute('data-url');

		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = stateChange;
		xhr.open('GET', url);
		xhr.send();

		showPage(null);
		showLoading(true);
	}

	/**
	 * Shows an already-cached page, or pass null to simply hide pages
	 */
	function showPage(page) {
		let title;

		for (let p of qs('#content').querySelectorAll('.page')) {
			if (p.id == page) {
				title = p.getAttribute('data-title');
				p.classList.remove('hidden');
			} else {
				p.classList.add('hidden');
			}
		}

		if (page !== null) {
			history.replaceState({}, title, '#' + page);
		}
	}

	/**
	 * Set nav highlights
	 */
	function highlightNav(page) {
		for (let a of qs('#nav').querySelectorAll('a')) {
			let pageRef = a.getAttribute('href').substr(1);

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
	 * Add nav click handlers for a DOM subtree
	 */
	function addNavClickHandlers(p, force) {
		if (!force && p.getAttribute('data-has-nav-click-handler') == "true") {
			return;
		}

		p.setAttribute('data-has-nav-click-handler', 'true');

		for (let a of p.querySelectorAll('a[data-pageref="true"]')) {
			a.addEventListener('click', onNavClick);
		}
	}

	/**
	 * When a nav button is clicked
	 */
	function onNavClick(ev) {
		let button = ev.currentTarget;

		let page = button.getAttribute('href');
		
		if (page === null || page === '') {
			alert("href not defined for anchor #" + button.id);
			return;
		}

		showOrCache(page.substr(1));

		ev.preventDefault();
	}

	/**
	 * Show the initial page (maybe based on URL)
	 */
	function showInitialPage() {
		// Find the hash part of the current URL
		// https://gist.github.com/jlong/2428561
		let a = document.createElement('a');
		a.href = window.location.href;
		let hash = a.hash;

		let page;

		if (hash && hash !== '') {
			page = hash.substr(1);

			// Verify this page exists, else redirect to main
			if (!qs('#content > div#' + page + ".page")) {
				page = MAINPAGE;
			}
		} else {
			page = MAINPAGE;
		}

		showOrCache(page);
	}

	/**
	 * On DOM ready
	 */
	function onReady() {
		// We have JS enabled, so remove the hassle screen
		qs("#nojs-site").classList.add("hidden");
		qs("#js-site").classList.remove("hidden");

		// Add nav click handlers
		addNavClickHandlers(qs("#nav"));

		showInitialPage();
	}

	window.addEventListener('DOMContentLoaded', onReady);

}());