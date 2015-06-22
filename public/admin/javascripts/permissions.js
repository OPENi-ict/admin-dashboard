var typePatternMatch         = new RegExp(/^t_[a-z0-9]{32}-[0-9]{1,10000}$/);
var typePatternExtract       = new RegExp(/t_[a-z0-9]{32}-[0-9]{1,10000}/gm);

var objectPatternMatch       = new RegExp(/^0[a-f,0-9]{7}-[a-f,0-9]{4}-4[a-f,0-9]{3}-[a-f,0-9]{4}-[a-f,0-9]{12}$/);
var objectPatternExtract     = new RegExp(/0[a-f,0-9]{7}-[a-f,0-9]{4}-4[a-f,0-9]{3}-[a-f,0-9]{4}-[a-f,0-9]{12}/gm);

var apiKeyExtract            = new RegExp(/[a-z,0-9]{32}/gm);

var types                    = {}
var ses                      = {}


$('#openAddServiceEnablerDialog').click(function(){

   //list SEs then

   $.ajax({
      url: '/admin/ajax/list_service_enablers',
      type: 'GET',
      headers: {
         "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (data) {

         var html = "<ul>"

         for (var i = 0; i < data.length; i++){
            console.log(data[i])
            html += "<li><input value='Add' type='button' class='addSEButton' desc='" + data[i].description + "' id='" + data[i].cloudlet + "' app_id='" + data[i].app_id + "'  name='"+ data[i].name+"' > " + data[i].name + " : " + data[i].description + "</li>"
         }

         html += "</ul>"

         $("#dialog-modal").html(html);
         $("#dialog-modal").dialog( { "title" : ' Please select a service enabler' } );
         $("#dialog-modal").dialog("open");

         $(".addSEButton").click(function(){
            var input = $(this)

            var se = {
               cloudlet    : input.attr("id"),
               app_id      : input.attr("app_id"),
               name        : input.attr("name"),
               description : input.attr("desc")
            }

            ses[se.name.replace(new RegExp(" ", 'g'), "-")] = se

            $("#inputData").val($("#inputData").val() + " Service_Enabler:" + se.name.replace(new RegExp(" ", 'g'), "-") );
            $('#startEditing').click();

            $("#dialog-modal").dialog("close");
         })
      },
      error: function (data) {
         alert("error " + JSON.stringify(data))
      }
   });


});


$('#setPermissions1').click(function(){

   var html = "<ul>"

   for (var i in graph_api_mappings){
      html += "<li><input value='Add' type='button' class='addGraphButton' name='"+ i +"' > " + i + "</li>"
   }

   html += "</ul>"

   $("#dialog-modal").html(html);
   $("#dialog-modal").dialog( { "title" : ' Please select a service enabler' } );
   $("#dialog-modal").dialog("open");

   $(".addGraphButton").click(function(){
      var input = $(this)
      $("#inputData").val($("#inputData").val() + " " + input.attr("name") );
      $('#startEditing').click();
   })

})


$('#copyPermissionsOld').click(function(){

   var filename = 'permissions.json'
   var text     = $("#outputData").text()
   var pom      = document.createElement('a');

   pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
   pom.setAttribute('download', filename);
   pom.click();

})



$('#copyPermissions').click(function(){

   var arr_permissions = JSON.parse($("#outputData").text())

   var type_ids  = {}
   var se_ids  = {}
   var type_arrs = []
   var se_arrs   = []

   for ( var i = 0; i < arr_permissions.length; i++){

      if ( "type" === arr_permissions[i].type ){
         var id = arr_permissions[i].ref
         type_ids[id] = id
      }
      else if ("service_enabler" === arr_permissions[i].type ){
         se_ids[arr_permissions[i].ref.replace(new RegExp(" ", 'g'), "-")] = arr_permissions[i].ref.replace(new RegExp(" ", 'g'), "-")
      }

   }

   for ( var i in type_ids ){
      type_arrs.push(types[i])
   }

   for ( var i in se_ids ){
      se_arrs.push(ses[i])
   }

   var app_api_key = $("#app_api_key").val()

   var data = {
      "app_api_key"      : app_api_key,
      "permissions"      : arr_permissions,
      "types"            : type_arrs,
      "service_enablers" : se_arrs
   }

   var sessionToken = $("#session").val()

   $.ajax({
      url: '/admin/ajax/persist_app_perms',
      type: 'PUT',
      data: JSON.stringify(data),
      headers: {
         "Content-Type"  : "application/json"
      },
      dataType: 'json',
      success: function (data) {
         console.log(data);
         if ("update" == data.status){
            window.location.href = '/admin/permissions/' + app_api_key
         }
         else{
            alert("error " + JSON.stringify(data))
         }
      },
      error: function (data) {
         alert("error " + JSON.stringify(data))
      }
   });

})


var typeToDiv = function(p, name){

   var html = '<div class="permInstance" id="instance_' + p.ref.replace(new RegExp(' ', 'g'), '_') + '">'

   if ( typePatternMatch.test( p.ref ) ){
      html += '<div class="headingType">Type <span class="removeFromPerms">Remove</span></div>'
   }
   else if (objectPatternMatch.test( p.ref )){
      html += '<div class="headingObject">Object <span class="removeFromPerms">Remove</span></div>'
   }
   else {
      html += '<div class="headingObject">Service Enabler <span class="removeFromPerms">Remove</span></div>'
   }


   if ( objectPatternMatch.test( p.ref ) ){
      html += '<div class="immutable"> ID: ' + p.ref + '</div>'
      html += '<div><input type="checkbox" name="cloudlet_read" value="READ"> read <input type="checkbox" name="cloudlet_update" value="UPDATE"> update <input type="checkbox" name="cloudlet_delete" value="DELETE"> delete</div>'
   }
   else if (p.type === 'service_enabler'){
      html += '<div>Service Enabler: <b>' + name + '</b></div>'
   }
   else{
      html += '<div class="immutable"> ID: ' + p.ref + ' <span  class="loadTypeDetails">Details</span></div>'

      if (undefined !== name){
         html += '<div>Graph API Object: <b>' + name + '</b></div>'
      }

      html += '<div>App level <span class="help" title="Requesting app level permissions means that your application will be restricted Cloudlet objects created by that application. It cannot access objects of the same type created by other applications.">?</span></div>'
      html += '<div><input type="checkbox" name="app_create" value="CREATE"> create <input type="checkbox" name="app_read" value="READ"> read <input type="checkbox" name="app_update" value="UPDATE"> update <input type="checkbox" name="app_delete" value="DELETE"> delete</div>'

      html += '<div>Cloudlet level <span class="help" title="Requesting cloudlet level permissions means that your application will have access to all objects of this type in a users Cloudlet, even objects created by other applications. Warning: users are more likely to reject requests for Cloudlet level access.">?</span></div>'
      html += '<div><input type="checkbox" name="cloudlet_create" value="CREATE"> create <input type="checkbox" name="cloudlet_read" value="READ"> read <input type="checkbox" name="cloudlet_update" value="UPDATE"> update <input type="checkbox" name="cloudlet_delete" value="DELETE"> delete</div>'
   }
   html += '</div>'

   return html
}


var applyAccessValues = function(p){
   var inst         = $('#instance_' + p.ref )
   var name_prepend = p.access_level.toLowerCase()
   var name_append  = p.access_type.toLowerCase()

   inst.find("input[name='" + name_prepend + '_' + name_append + "']").prop('checked', true);
}


$('#startEditing').click(function(){

   $("#introText").remove()
   var raw = $("#inputData").val()

   try {
      var perms = JSON.parse(raw)

      if (Array.isArray(perms)){
         for (var p in perms){
            if ( typePatternMatch.test(perms[p].ref ) || objectPatternMatch.test(perms[p].ref )){
               if ($('#instance_' + perms[p].ref ).length === 0) {
                  $('#editContainer').append(typeToDiv(perms[p]))
               }
               applyAccessValues(perms[p])
            }
         }

         $("#inputData").text('')
         parsePermissions()
      }
      else{
         //is object
         if ( typePatternMatch.test(perms.ref ) || objectPatternMatch.test(perms.ref )){
            if ($('#instance_' + perms.ref ).length === 0) {
               $('#editContainer').append(typeToDiv(perms))
            }
            applyAccessValues(perms)
            $("#inputData").text('')
            parsePermissions()
         }
      }
   } catch (e) {

      var match;

      while ((match = typePatternExtract.exec(raw)) != null) {

         if (match.index === typePatternExtract.lastIndex) {
            typePatternExtract.lastIndex++;
         }

         var id = match[0]

         var perm = {
            ref  : id,
            type : 'type'
         }

         if ($('#instance_' + id ).length === 0) {
            $('#editContainer').append(typeToDiv(perm))
         }
      }


      while ((match = objectPatternExtract.exec(raw)) != null) {

         if (match.index === typePatternExtract.lastIndex) {
            typePatternExtract.lastIndex++;
         }

         var id = match[0]

         var perm = {
            ref  : id,
            type : 'object'
         }

         if ($('#instance_' + id ).length === 0) {
            $('#editContainer').append(typeToDiv(perm))
         }
      }

      var words = raw.split(' ')

      for (var i = 0; i < words.length; i++){
         var word = words[i]

         if (0 === word.indexOf( "Service_Enabler:")){
            word = word.replace("Service_Enabler:", "")
            var se = ses[word]
            var perm = {
               ref  : se.name,
               type : 'service_enabler'
            }

            if ($('#instance_' + se.name.replace(new RegExp(' ', 'g'), '_') ).length === 0) {
               $('#editContainer').append(typeToDiv(perm, se.name))
            }
         }
         else if ( undefined !== graph_api_mappings[word]){

            var id = graph_api_mappings[word]

            var perm = {
               ref  : id,
               type : 'type'
            }

            if ($('#instance_' + id ).length === 0) {
               $('#editContainer').append(typeToDiv(perm, word))
            }
         }
      }


      parsePermissions()
   }

})


$('#editContainer').on('click', 'input', function() {

   var element = $(this)

   var checked = element.prop('checked')

   if (checked){
      var name    = element.prop('name')
      var level   = name.split('_')[0]
      var action  = name.split('_')[1]

      var new_level = ('app' === level) ? 'cloudlet' : 'app'
      var new_name  = new_level + '_' + action

      var other_element = element.parents(".permInstance").find("input[name='" + new_name + "']")

      if (other_element.prop('checked')){
         other_element.prop('checked', false)
      }
   }

   parsePermissions()

});


$('#editContainer').on('click', 'span.removeFromPerms', function() {
   $(this).parents(".permInstance").remove();
   parsePermissions()
})


$('#editContainer').on('click', 'span.loadTypeDetails', function() {

   var element = $( this )
   var id      = element.parents(".permInstance").prop('id').replace('instance_', '')

   var typeURL = '/api/v1/types/' + id

   $.get( typeURL, function( data ) {

      $("#dialog-modal").html('<pre>' + JSON.stringify(data, undefined, 2) + '</pre>');
      $("#dialog-modal").dialog( { "title" : id + ' details' } );
      $("#dialog-modal").dialog("open");
   })

})


var retrieveTypes = function(){

   var permissions = JSON.parse($("#outputData").text())

   var type_ids = {}

   for ( var i = 0; i < permissions.length; i++){

      if ( "type" === permissions[i].type ){
         var id = permissions[i].ref
         type_ids[id] = id
      }
   }

   for ( var id in type_ids ){

      if ( undefined === types[id] ){
         var typeURL = '/api/v1/types/' + id

         $.get( typeURL, function( data ) {
            types[id] = data
         })
      }
   }

}


var parsePermissions = function(){

   var perms = []

   $("#editContainer .permInstance").each(function( index ) {

      var element = $( this )
      var id      = element.prop('id').replace('instance_', '')
      var type    = ( typePatternMatch.test(id ) ) ? 'type' : 'object'

      if (undefined !== ses[id.replace(new RegExp("_", 'g'), "-")]){

         var perm = {
            ref         : id.replace(new RegExp("_", 'g'), " "),
            type        : "service_enabler"
         }

         perms.push(perm)
      }
      else{
         element.find('input:checked').each(function() {
            var input = $(this)
            var name = input.prop('name')

            var aLevel = name.split('_')[0].toUpperCase()
            var aType = name.split('_')[1].toUpperCase()

            var perm = {
               ref         : id,
               type        : type,
               access_level: aLevel,
               access_type : aType
            }

            perms.push(perm)
         })
      }

      document.getElementById("outputData").innerHTML = JSON.stringify(perms, undefined, 2);
   })


   retrieveTypes()
}


$(function() {
   $( document ).tooltip();
   $("#dialog-modal").dialog(
      {
         width: 600,
         height: 400,
         autoOpen: false,
         buttons: {
            "Close": function() {
               $(this).dialog("close");
            }
         }
      })
});

