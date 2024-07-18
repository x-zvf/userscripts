// ==UserScript==
// @name         Ilias[kœri]
// @version      1.2
// @description  [kœri] makes everything better; Automate the login process to KIT's ilias.
// @author       xzvf (Péter Bohner)
// @match        https://ilias.studium.kit.edu/*
// @match        https://idp.scc.kit.edu/idp/profile/SAML2/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// ====== UserScript Config ====== //
let shouldAutofill = true;         // should this extension autofill the username and password specified below? true => yes, false => no
let noAutofillTimeout = 5000;      // if it should not autofill, how long should it wait before pressing the login button (this is so that your browser has time to autofill the login)
let username = "YOUR-USERNAME";    // your KIT username
let password = "YOUR-PASSWORD";    // your KIT password
// =============================== //

let iliasUrl = /https\:\/\/ilias\.studium\.kit\.edu\/.*/;
let shiboUrl = /https\:\/\/idp\.scc\.kit\.edu\/idp\/profile\/SAML2\/.*/;

function login() {
    if (shiboUrl.test(location.href)) {
        if (!GM_getValue("shibLoginAttempted", false)) {
            GM_setValue("shibLoginAttempted", true);
            document.getElementById("sbmt").dispatchEvent(new MouseEvent("click"));
        }
    }
}

(function() {
    'use strict';
    if (iliasUrl.test(location.href)) {
        var loginAttempted = GM_getValue("shibLoginAttempted", false);
        GM_setValue("shibLoginAttempted", false);
        if (loginAttempted) {
            var dashboardLink = Array.from(document.querySelectorAll(".il-link[role=menuitem]")).filter(x => /jumpToMemberships/.test(x.getAttribute("href")))[0]
            if (dashboardLink) {
                dashboardLink.dispatchEvent(new MouseEvent("click"));
            }
        }

        var loginButton = Array.from(document.getElementsByTagName("a")).filter(x => /login.php\?.*/.test(x.getAttribute("href")))[0]
        if (loginButton && !/login.php\?.*/.test(location.href)) {
            loginButton.dispatchEvent(new MouseEvent("click"));
        }
        var shibButton = document.getElementById("button_shib_login")
        if (shibButton) {
            shibButton.dispatchEvent(new MouseEvent("click"));
        }
    } else if (shiboUrl.test(location.href)) {
        if (shouldAutofill) {
            document.getElementById("username").value = username;
            document.getElementById("password").value = password;
            login();
        } else {
            setTimeout(login, noAutofillTimeout);
        }
    }
})();




