"use strict";var dataAccess=require("../data_access"),logger=require("./../logger").logger,e=require("../errors"),log=logger.getLogger("ServiceResource"),superService=global.config.nuve.superserviceID,doInit=function(e,r,i){e._id=e._id+"",e._id!==superService?i("error"):dataAccess.service.get(r,function(e,r){e&&i("error"),i(r)})};exports.represent=function(r,i,s){var t=(r.authData||{}).service._id.toString();if(t!==superService&&t!==r.params.service)return log.info("Service ",r.params.service," not authorized for this action"),s(new e.AccessError("Permission denied"));dataAccess.service.get(r.params.service,function(e,r){if(e)return log.warn("Failed to get service:",e.message),s(e);log.info("Representing service ",r._id),i.send(r)})},exports.deleteService=function(s,t,o){var r=s.authData||{};doInit(r.service,s.params.service,function(r){if("error"===r)return log.info("Service ",s.params.service," not authorized for this action"),o(new e.AccessError("Permission denied"));if(null==r)return o(new e.NotFoundError("Service not found"));var i="";if((i+=r._id)===superService)return t.status(401).send("Super service not permitted to be deleted"),o(new e.AccessError("Permission denied to delete super service"));dataAccess.service.delete(i,function(e,r){if(e)return log.warn("Failed to delete service:",e.message),o(e);log.info("Serveice ",i," deleted"),t.send("Service deleted")})})};