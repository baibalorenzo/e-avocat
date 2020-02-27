import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'Dossier__c.timer_opp__c',
    'Dossier__c.total_timer_opp__c',
];

/**
 * 
 * Calcul de temps passé par dossier
 * Le calcul se déclenche depuis l'objet personnalisé dossier
 *
 */

export default class LightningFileTimer extends LightningElement {
    
    @track showStartBtn = true;
    @track timeVal ;
    @api recordId;
    @api objectApiName;
    @track timeTotal;
    //@track name1;
    //@track name2;
    @track hidePause = false;
    @track hideDemarrer = true;
    @track hideStop = true;
    @track openmodel = false;
    //@track name9 ;
    @track customerId ;
    timeTotalTemp;
    timeIntervalInstance;
    totalMilliseconds;
    myValue=true;
 


/**
 * 
 * Calcul de temps passé par dossier
 * Le calcul se déclenche depuis l'objet personnalisé dossier
 *
 */

    // @wire(getRecord, { recordId: '$recordId', fields: FIELDS }) Opportunity;

    @wire (getRecord, {recordId : '$recordId', 
    fields:
        ['Dossier__c.timer_opp__c',
        'Dossier__c.total_timer_opp__c']
    }) Dossier__c;
   
    get timer_opp__c() {
        return this.timeVal = this.Dossier__c.data.fields.timer_opp__c.value;
    }
    get total_timer_opp__c() {
       return this.timeTotal = this.Dossier__c.data.fields.total_timer_opp__c.value;

    }


/**
 * 
 * Début du traitement du timer
 * 
 *
 */
    start(component,event) {

        var parentThis = this;
        this.hidePause = true;
        this.hideDemarrer = false;
        this.hideStop = false;

/**
 * 
 * Récupérer la dernière valeur du timer 
 * 
 *
 */
        function getLastTimer (startTime) {
            var i
            var hours  
            var minutes
            var seconds
            var totalMillisecondss
            var times = [ 0, 0, 0 ]
            var max   = times.length
            var a     = (startTime || '').split(':')
          
            for ( i = 0; i < max; i++) {
                a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
            
            }
            hours   = a[0] * 3600
            minutes = a[1] * 60
            seconds = a[2]
        
            totalMillisecondss = hours  + minutes + seconds  
        
            return totalMillisecondss * 1000
        }
      
/**
 * 
 * Valeur Récupérer depuis le DOM  
 * Field cible : Temps passé récemment (timer_opp__c)
 *
 */
        parentThis.totalMilliseconds =  getLastTimer(this.template.querySelector("lightning-input-field[data-my-id=in3]").value); 
/**
 * 
 * Calcule du temps en Heure, Minutes et Secondes
 * 
 *
 */
        this.timeIntervalInstance = setInterval(function() {
            
             var hourss = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
             var minutess = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
             var secondss = Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000)
            
           
/**
 * 
 * Afficher le résultat dans la variable timeVal
 * Field cible : timer_opp__c
 *
 */ 
            parentThis.timeVal = hourss + 'h : ' + minutess + 'm : ' + secondss  + 's'
            parentThis.totalMilliseconds += 100
        }, 100);
     
    }



/**
 * 
 * Réinitialiser le timer
 * 
 *
 */
    reset(component, event) {
        
        this.openmodel = true;

    }

/**
 * 
 * Mettre en pause le timer
 * 
 *
 */
    stopTimer (component, event) {


        this.hidePause = false;
        this.hideDemarrer = true;
        this.hideStop = true;


        function addTimes (startTime, endTime, temp) {
            var times = [ 0, 0, 0 ]
            var max   = times.length
            var a     = (startTime || '').split(':')
            var b     = (endTime   || '').split(':')
            var c     = (temp   || '').split(':')
            var i;
            var j;
            var h;
            // Normalize time values
            for ( i = 0; i < max; i++) {
                a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
                b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
                c[i] = isNaN(parseInt(c[i])) ? 0 : parseInt(c[i])
            }

            // Store time values
            for (j = 0; j < max; j++) {
                times[j] = a[j] + b[j] - c[j]
            }

            var hours   = times[0];
            var minutes = times[1];
            var seconds = times[2];

            // Normalize minutes
            if (minutes >= 60) {
                 h    = (minutes / 60) << 0
                hours   += h
                minutes -= 60 * h
            }

            // Normalize seconds
            if (seconds >= 60) {
                var m    = (seconds / 60) << 0
                minutes += m
                seconds -= 60 * m
            }


            return hours + 'h : ' + minutes +'m : '  + seconds + 's'
        }

        this.timeTotal = addTimes(this.timeVal,this.timeTotal,this.timeTotalTemp); 
        this.timeTotalTemp = this.timeVal;
        this.timeVal = this.timeVal ;
        clearInterval(this.timeIntervalInstance);

    }

    closeModal(component, event) {
        this.openmodel = false


    }
    
    saveMethod(component, event) {

        this.totalMilliseconds = 0;
        this.template.querySelector("lightning-button[data-my-id=in03]").style.visibility ='hidden';
        this.template.querySelector("lightning-button[data-my-id=in01]").style.visibility ='hidden';
        this.timeVal = this.timeVal;
        this.timeTotal = '0h : 0m : 0s';
        clearInterval(this.timeIntervalInstance);
        this.closeModal();
        

    }

    onLoad (component, event) 
    {
       
        
        this.timeVal = this.timer_opp__c;

      if( this.total_timer_opp__c=='0h : 0m : 0s')
      {
       this.template.querySelector("lightning-button[data-my-id=in03]").style.visibility ='hidden';
       this.template.querySelector("lightning-button[data-my-id=in01]").style.visibility ='hidden';
       this.template.querySelector("lightning-input-field[data-my-id=in3]").style.visibility ='hidden';
      

      }
        
    }

       
            


}
