"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},dataAccess=require("../data_access"),logger=require("./../logger").logger,cloudHandler=require("../cloudHandler"),e=require("../errors"),log=logger.getLogger("RoomsResource");exports.createRoom=function(t,n,a){var i=t.authData;if("object"!==_typeof(t.body)||null===t.body||"string"!=typeof t.body.name||""===t.body.name)return a(new e.BadRequestError("Invalid request body"));if(t.body.options&&"object"!==_typeof(t.body.options))return a(new e.BadRequestError("Invalid room option"));t.body.options=t.body.options||{};var s=t.body.options;s.name=t.body.name,dataAccess.room.create(i.service._id,s,function(o,r){!o&&r?(log.debug("Room created:",t.body.name,"for service",i.service.name),n.send(r),r&&r.sip&&(log.info("Notify SIP Portal on create Room"),cloudHandler.notifySipPortal("create",r,function(){}))):(log.info("Room creation failed",o?o.message:s),a(o||new e.AppError("Create room failed")))})},exports.represent=function(o,t,n){var a=o.authData;o.query.page=Number(o.query.page)||void 0,o.query.per_page=Number(o.query.per_page)||void 0,dataAccess.room.list(a.service._id,o.query,function(o,r){r?(log.debug("Representing rooms for service ",a.service._id),t.send(r)):n(o||new e.AppError("Get rooms failed"))})};