public with sharing class EmailMessageComp {
    
    //Generate PDF
    /*public String PDFData {get; set;}   
   
    public PageReference downloadPDF(){
        PDFData = '';
        System.PageReference pageRef = new System.PageReference('/apex/PDFGenerator');
    
        //ensure pdf downloads and is assigned with defined name
        pageRef.getHeaders().put('content-disposition', 'attachment; filename=TestPDF.pdf');
     
        return pageRef;
    }*/
    //public EmailMessageComp(){}
    //constructor to get the Dossier record
    /*public Id owner {get; set;}
    public Id Id { get; set; }
    public Dossier__c doss { get; set; }
    public EmailMessageComp(ApexPages.StandardController controller) {
    	doss =  (Dossier__c) controller.getRecord();
    	Id = doss.Id;
    	System.debug('The Dossier record: ' + doss);
    	owner = doss.OwnerId;
    }*/
    
    /*public String emailBody {get;set;}
    public EmailMessageComp() {
        //Get Dossiers records
        Set<Id> Dossiers = new Set<Id>();
        for(Dossier__c doss : [select Name, Client__c, currentDate__c,OwnerId from Dossier__c limit 100])
        {
            Dossiers.add(doss.Id);
        }
        List<emailTemplateWrapper> emailTemplateWrapperlist     = new List<emailTemplateWrapper>();        
        Map<String, emailTemplateWrapper> folderIdVsTemplateMap = new Map<String,emailTemplateWrapper>();
        Folder folderObj                                        = new Folder();
        folderObj = [SELECT Id,Name 
                     FROM   Folder 
                     WHERE  Name='Custom Email Template'];
        //emailBody = ApexPages.currentPage().getParameters().get('v.emailbody');
        for(sobject emailtemp : [SELECT Id, FolderId, HtmlValue, FolderName, isActive, body, Name, subject 
                                 FROM   EmailTemplate 
                                 WHERE FolderId =: folderObj.Id ]){ 
            if( folderIdVsTemplateMap.containskey( String.valueof(emailtemp.get('FolderId'))) ){                
                EmailTemplates template    = new EmailTemplates();
                template.emailTemplateId   = String.valueOf(emailtemp.get('Id'));
                template.emailTemplatename = String.valueOf(emailtemp.get('Name'));
                template.emailbody         = (emailtemp.get('body') != null ? String.valueOf(emailtemp.get('body')) : '' );
                Map<Id, String> bod        = MergeFields.parse(Dossiers, template.emailbody ); //parsing 
                template.emailbody         = String.valueOf(bod); //Parse bod to String 
                emailBody                  = template.emailbody ;
                template.emailSubject      = String.valueOf(emailtemp.get('subject'));                
                folderIdVsTemplateMap.get( String.valueof(emailtemp.get('FolderId')) ).emailtemplatelist.add( template );
                                
            }else{
                emailTemplateWrapper tempWrap = new emailTemplateWrapper();
                tempWrap.folderId             = String.valueOf(emailtemp.get('FolderId'));
                tempWrap.folderName           = String.valueOf(emailtemp.get('FolderName'));
                
                EmailTemplates template    = new EmailTemplates();
                template.emailTemplateId   = String.valueOf(emailtemp.get('Id'));
                template.emailTemplatename = String.valueOf(emailtemp.get('Name'));
                template.emailbody         = (emailtemp.get('HtmlValue') != null ? String.valueOf(emailtemp.get('HtmlValue')) : '' );
                Map<Id, String> bod        = MergeFields.parse(Dossiers, template.emailbody ); //parsing 
                template.emailbody         = String.valueOf(bod); //Parse bod to String
                template.emailSubject      = String.valueOf(emailtemp.get('subject'));
                tempWrap.emailtemplatelist = new list<EmailTemplates>{ template };
                folderIdVsTemplateMap.put( String.valueof(emailtemp.get('FolderId'))  , tempWrap );
            }   
        }
    }
    
    @AuraEnabled
    public static Dossier__c saveBody(Dossier__c bod) {
        insert bod;
        return bod;
    }

    public static Sobject getRecords(Id recordId) {
        String objectName = 'Dossier__c';
        String field = 'Email_Body__c';
        String soql = 'Select ' + field + ' from ' + objectName + ' where Id = :'+ recordId;
        Sobject rec = Database.query(soql);
        return rec;
    }*/
    
    /*public Id owner {get; set;}
    public Id Id { get; set; }
    public Dossier__c doss { get; set; }
    public EmailMessageComp(ApexPages.StandardController controller) {
    	doss =  (Dossier__c) controller.getRecord();
    	Id = doss.Id;
    	System.debug('The Dossier record: ' + doss);
    	owner = doss.OwnerId;
    }*/
   
    
    @AuraEnabled
    public static list<emailTemplateWrapper> getEmailTempaltes(){
        List<emailTemplateWrapper> emailTemplateWrapperlist     = new List<emailTemplateWrapper>();        
        Map<String, emailTemplateWrapper> folderIdVsTemplateMap = new Map<String,emailTemplateWrapper>();
        Folder folderObj                                        = new Folder();
        folderObj = [SELECT Id,Name 
                     FROM   Folder 
                     WHERE  Name='Custom Email Template'];
        
        //String recordId;
        /*String recordId = ApexPages.CurrentPage().getParameters().get('id');
        Set<Id> Dossiers = new Set<Id>();
        List<Dossier__c> dossierList = [
            SELECT Name, Client__c, currentDate__c, OwnerId 
            FROM Dossier__c
            LIMIT 1
        ];
        for (Dossier__c doss : dossierList) {
            Dossiers.add(doss.Id);
          //System.debug(doss.OwnerId);
        }*/
        
        
        //Get Dossiers records
        Set<Id> Dossiers = new Set<Id>();
        for(Dossier__c doss : [SELECT Name, Client__c, currentDate__c, OwnerId 
                               FROM Dossier__c 
                               LIMIT 1]){
            Dossiers.add(doss.Id);
        }
        
        //Get Email template
        for(sobject emailtemp : [SELECT Id, FolderId, HtmlValue, FolderName, isActive, body, Name, subject 
                                 FROM   EmailTemplate 
                                 WHERE  isActive= true 
                                 AND    FolderId =: folderObj.Id ]){ 
            if( folderIdVsTemplateMap.containskey( String.valueof(emailtemp.get('FolderId'))) ){                
                EmailTemplates template    = new EmailTemplates();
                template.emailTemplateId   = String.valueOf(emailtemp.get('Id'));
                template.emailTemplatename = String.valueOf(emailtemp.get('Name'));
                template.emailbody         = (emailtemp.get('HtmlValue') != null ? String.valueOf(emailtemp.get('HtmlValue')) : '' );
                Map<Id, String> bod        = MergeFields.parse(Dossiers, template.emailbody ); //parsing 
                template.emailbody         = String.valueOf(bod); //Parse bod to String               
                template.emailSubject      = String.valueOf(emailtemp.get('subject'));                
                folderIdVsTemplateMap.get( String.valueof(emailtemp.get('FolderId')) ).emailtemplatelist.add( template );
                                
            }else{
                emailTemplateWrapper tempWrap = new emailTemplateWrapper();
                tempWrap.folderId             = String.valueOf(emailtemp.get('FolderId'));
                tempWrap.folderName           = String.valueOf(emailtemp.get('FolderName'));
                
                EmailTemplates template    = new EmailTemplates();
                template.emailTemplateId   = String.valueOf(emailtemp.get('Id'));
                template.emailTemplatename = String.valueOf(emailtemp.get('Name'));
                template.emailbody         = (emailtemp.get('HtmlValue') != null ? String.valueOf(emailtemp.get('HtmlValue')) : '' );
                Map<Id, String> bod        = MergeFields.parse(Dossiers, template.emailbody ); //parsing 
                template.emailbody         = String.valueOf(bod); //Parse bod to String
                template.emailSubject      = String.valueOf(emailtemp.get('subject'));
                tempWrap.emailtemplatelist = new list<EmailTemplates>{ template };
                folderIdVsTemplateMap.put( String.valueof(emailtemp.get('FolderId'))  , tempWrap );
            }   
        }
        
        if( !folderIdVsTemplateMap.isEmpty() ){
            emailTemplateWrapperlist.addAll( folderIdVsTemplateMap.values() );            
            return emailTemplateWrapperlist;
        }        
        return null;
    }
    
    public class emailTemplateWrapper{
        
        @AuraEnabled 
        public String folderName{get;set;}
        
        @AuraEnabled 
        public String folderId{get;set;}
        
        @AuraEnabled
        public list<emailTemplates> emailtemplatelist{get;set;}
        
    }
    
    public class emailTemplates{
        
        @AuraEnabled 
        public String emailTemplateId{get;set;}
        
        @AuraEnabled 
        public String emailbody{get;set;}
        
        @AuraEnabled
        public String emailSubject {get;set;}
        
        @AuraEnabled 
        public String emailTemplatename{get;set;}
    }  
    
    @AuraEnabled
    public static dossier__c getdossierRec(String recordId){
        Dossier__c dossierObj = new Dossier__c();
        dossierObj            = [SELECT id, Client__c, currentDate__c,OwnerId
                                 FROM    Dossier__c 
                                 WHERE   id=: recordId Limit 1];
        return dossierObj;
        
    }
}