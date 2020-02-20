({
    sendHelper: function (component, getEmail, getSubject, getbody, dossierId) {
        // call the server side controller method   
        var action = component.get("c.sendMailMethod");
        var templateId = component.get("v.templateIDs");
        // set the 3 params to sendMailMethod method   
        action.setParams({
            'mMail'     : getEmail,
            'mSubject'  : getSubject,
            'mbody'     : getbody,
            'dossierId' : dossierId,
            'folderId'  : component.get("v.folderId"),
            'templateId': component.get("v.templateIDs")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // if state of server response is comes "SUCCESS",
                // display the success message box by set mailStatus attribute to true
                component.set("v.mailStatus", true);
            }
        });
        $A.enqueueAction(action);
    },
    getEmailTemplateHelper: function (component, event) {
        var id = component.get("v.recordId");
        var action = component.get("c.getEmailTempaltes");
        action.setParams({
            'recordId'     : id
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue() != null) {
                component.set("v.emailfolderVSTemplateList", response.getReturnValue());
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
        $A.enqueueAction(action);
    },
    downloadPdfFile : function(component,event,helper){
        var body = component.get("v.emailbody"); //pass this value into vf page
        window.setTimeout(
          $A.getCallback(function() {
            // visualforce page URL
            window.location=location.origin + '/apex/SamplePage?id=' + component.get("v.recordId");
         }), 1000
      );
    },
    
    //Function that gets all Dossier__c Record
    getAllRecords : function(component) {
       var action = component.get("c.getAllRecords");
        action.setCallback(this, function(response){           
                component.set("v.emailbody",response.getReturnValue());
        });
        $A.enqueueAction(action);     
     },
    
    //Function to create Record
    createRecord : function(component, recordDetail) {
        this.upsertRecord(component, recordDetail, function(a){
            var recordDetails = component.get("v.emailbody");
            recordDetails.push(a.getReturnValue());
            component.set("v.emailbody",recordDetails);
        })
     },
    
    //Function to Insert/Update Record
    upsertRecord : function(component, recordDetail, callback) {
       var action = component.get("c.saveRecord");
        action.setParams({
            "recordDetail":recordDetail
        });
        if(calback){
            action.setCallback(this, callback);
        }   
        $A.enqueueAction(action);     
     }
})