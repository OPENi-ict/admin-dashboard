/**
 * Created by dconway on 23/03/15.
 */


var subscription = "";

var subToDiv = function(context){

   var html = '<div class="contextInstance">';

   for ( var i in context){
      html += '<div  class="nvp"><span class="nvp_name">' + i + '</span><span class="nvp_value"  nvp_name="' + i + '">: ' + context[i] + '</span></div>'
   }

   html += '</div>';

   return html
};

$('#buildSub').click(function(){

   //t_9de6b0dfdd4bb308a33129fb8033b49c-741
   var entry = {
      "@openi_type": "t_9de6b0dfdd4bb308a33129fb8033b49c-741",
      "@data": {
         "client_id"          : $(':selected', '#clientID').attr('key'),
         "openi_type"             : $('#typeID').val(),
         "notification_type"  : $(':selected', '#notifType').attr('key')
      }
   };

   if ( !$(".endpoint").hasClass('hidden') ) {
      entry['@data']["endpoint"] = $("#endpoint").val();
   }

   if ( !$(".datafield").hasClass('hidden') ) {
      entry['@data']["data"] = $("#datafield").val();
   }

   subscription=entry;

   $("#createSub").removeClass('hidden');
   //$('#subObject').append(subToDiv(entry))

   $("#subObject").html(  JSON.stringify(entry,     undefined, 2));

});

$('#notifType').click(function() {

   if ($('#notifType').val() === "Android Notification") {

      $("#endpointLabel").text("Android Device ID");
      $(".endpoint").removeClass('hidden');
   }
   else if($('#notifType').val() === "Email" || $('#notifType').val() === "SMS Text Message"){

      var label = "";
      ($('#notifType').val() === "Email") ? label = "Email Address" : label = "Phone Number";

      $("#endpointLabel").text(label);
      $(".endpoint").removeClass('hidden');

      $("#dataLabel").text("Data");
      $(".datafield").removeClass('hidden');
   }
   else{
      $(".endpoint").addClass('hidden');
      $(".datafield").addClass('hidden');
   }

});


$('#createSub').click(function() {

   var sessionToken = $("#session").val();

   console.log(subscription['@data'].client_id);
   console.log(subscription['@data'].openi_type);
   console.log(subscription['@data'].openi_type === "");

   if(subscription['@data'].client_id === ""){
      errorModal('Client ID Required');
      return
   }
   else if(subscription['@data'].openi_type === "" || !isTypeId(subscription['@data'].openi_type)){
      errorModal('Valid OPENi Type ID Required');
      return
   }

   $.ajax({
      url: '/api/v1/objects',
      type: 'post',
      data: JSON.stringify(subscription),
      headers: {
         "Authorization" : sessionToken,
         "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (data) {
         $("#dialog-modal").html('<pre>OPENi Type created: ' + data['@id'] + '</pre>');
         $("#dialog-modal").dialog( { "title" : data['@id'] + ' created' } );
         $("#dialog-modal").dialog("open");
      },
      error: function (data) {
         $("#dialog-modal").html('<pre>Error:' +  data.responseJSON.error + '</pre>');
         $("#dialog-modal").dialog( { "title" : 'Error' } );
         $("#dialog-modal").dialog("open");
      }
   });

});


var errorModal = function(error){
   $("#dialog-modal").html('<pre>Error:' +  error + '</pre>');
   $("#dialog-modal").dialog( { "title" : 'Error' } );
   $("#dialog-modal").dialog("open");
};
