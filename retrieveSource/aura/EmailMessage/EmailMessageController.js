({
    doInit: function (component, event, helper) {
        var dossierId = component.get("v.recordId");
        var action    = component.get("c.getdossierRec");
        action.setParams({
            "dossierId": dossierId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if (response.getReturnValue()    != null 
                    && response.getReturnValue() != "" 
                    && response.getReturnValue() != undefined) {
                    component.set("v.emailbody", response.getReturnValue().Email_Body__c);
                }
            }
        });
        $A.enqueueAction(action);
        helper.getEmailTemplateHelper(component, event);
    },
    // when user click on the close buttton on message popup ,
    // hide the Message box by set the mailStatus attribute to false
    // and clear all values of input fields.   
    closeMessage: function (component, event, helper) {
        component.set("v.mailStatus", false);
        component.set("v.email", null);
        component.set("v.subject", null);
        component.set("v.emailbody", null);
        $A.get('e.force:refreshView').fire();
    },
    onSelectEmailFolder: function (component, event, helper) {
        var folderId = event.target.value;
        component.set("v.folderId", folderId);
        if (folderId != null && folderId != '' && folderId != 'undefined') {
            var emailfolderVSTemplateList = component.get("v.emailfolderVSTemplateList");
            emailfolderVSTemplateList.forEach(function (element) {
                if (element.folderId == folderId) {
                    component.set("v.emailTemplateList", element.emailtemplatelist);
                }
            });
        } else {
            var temp = [];
            component.set("v.emailTemplateList", temp);
        }
    },
    onSelectEmailTemplate: function (component, event, helper) {
        var emailTempId  = event.target.value;
        var emailbody    = component.get("v.emailbody");;
        var emailSubject = '';
        component.set("v.templateIDs", emailTempId);
        if (emailTempId != null && emailTempId != '' && emailTempId != 'undefined') {
            var emailTemplateList = component.get("v.emailTemplateList");
            emailTemplateList.forEach(function (element) {
                if (element.emailTemplateId == emailTempId && element.emailbody != null) {
                    emailbody = element.emailbody;
                    emailSubject = element.emailSubject;
                }
            });
        }
        component.set("v.emailbody", emailbody);
        component.set("v.subject", emailSubject);
    },
    save : function(component, event, helper) {
        component.find("body").get("e.recordSave");
        var url = location.origin + '/apex/PDFGenerator?id=' + component.get("v.recordId");
        window.open(url, '_blank');
    },
    
    //This function redirects the template content as a pdf file
    printPageAction: function(component, event, helper) {
        
        console.log(component.get("v.emailbody"));
        var url = location.origin + '/apex/Courrier?id=' + component.get("v.recordId");
        window.open(url, '_blank');
    },
    
    //This function saves body in RTF Object and redirect it as a pdf ***This function is not used***
    printAction: function(component, event, helper) {        
        var newBody = component.get("v.emailbody");
        var action  = component.get("c.saveRecord");
        action.setParams({ 
            "recordDetail": newBody
        });
        action.setCallback(this, function(a) {
               var state = a.getState();
                if (state === "SUCCESS") {
                    //component.find("divbod").get("e.recordSave").fire();
                    component.set("v.emailbody",a.getReturnValue());
                }
            });
        $A.enqueueAction(action)
        var url = location.origin + '/apex/PDFGenerator?id=' + component.get("v.recordId");
        window.open(url, '_blank');
        
    },
    
    //Download calls downloadPdfFile from helper
    download : function (component,event,helper) {  
        helper.downloadPdfFile(component,event,helper);  
    },
    
    //This function calls helper funtions
    createRecord: function(component, event, helper){
        var newrecordDetails = component.get("v.newrecordDetails");
        helper.createRecord(component, newrecordDetails);
    },
    
    //Attach file to attachments
    attachAction : function (component,event,helper) {  
        var body = component.get("v.emailbody");
        var action    = component.get("c.savePdf");
        action.setParams({
            "body": body
        });
        action.setParams({ firstName : cmp.get("v.firstName") });

        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                alert("From server: " + response.getReturnValue());

                // You would typically fire a event here to trigger 
                // client-side notification that the server-side 
                // action is complete
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });

        // optionally set storable, abortable, background flag here

        // A client-side action could cause multiple events, 
        // which could trigger other events and 
        // other server-side action calls.
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },
    // Upload function
    handleUploadFinished: function (cmp, event) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        alert("Téléchargement terminé : " + uploadedFiles.length);
    },
    
})