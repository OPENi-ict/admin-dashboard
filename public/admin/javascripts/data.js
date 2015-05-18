var selectedCloudlet = '';
var types            = {}


$('.column-left ul li a').click(function(){

   var id   = $(this).html()
   var auth = $("#session").val()

   selectedCloudlet = id

   $("#type_id_list").html("")
   $("#object_id_list").html("")

   $.ajax({
      url: '/admin/ajax/list_types?selected=' + selectedCloudlet,
      type: 'GET',
      data: {},
      headers: {
         "Content-Type"  : "application/json",
         "Authorization" : auth
      },
      dataType: 'json',
      success: function (data) {

         for ( var i = 0; i < data.length; i++){
            var id = data[i]
            $("#type_id_list").append('<li><a href="#" name="' + id + '"></a></li>' )
         }

         $("ul#type_id_list li a").click(list_objects_function)
         $('ul#type_id_list li a').each(load_real_name_function)
      },
      error: function (data) {
         console.log(data)
      }
   });
})


var list_objects_function = function() {

   var id = $(this).attr('name');
   var auth = $("#session").val();
   var cloud = $("#cloudlet").val();

   $("#object_id_list").html("");

   //console.log('/api/v1/objects/' + selectedCloudlet + '?type=' + id + "&id_only=true&limit=100")
   //api/v1/search?cloudlet=' + id + "&id_only=true&limit=100

   $.ajax({
      url     : '/api/v1/objects/' + selectedCloudlet + '?type=' + id + "&id_only=true&limit=100",
      type    : 'GET',
      data    : {},
      headers : {
         "Content-Type" : "application/json",
         "Authorization": auth
      },
      dataType: 'json',
      success : function (data) {

         for (var i = 0; i < data.result.length; i++) {
            var id = data.result[i]['@id'][1];
            $("#object_id_list").append('<li><a href="#">' + id + '</a></li>');
         }

         $("ul#object_id_list li a").click(display_object_function)
      },
      error   : function (data) {
         console.log(data)
      }
   });
}

var load_real_name_function = function() {
   var obj = $(this)
   var typeId = obj.attr('name')

   if (undefined !== types[typeId]){
      obj.html(types[typeId]['@reference'])
   }

   $.ajax({
      url     : '/api/v1/types/' + typeId,
      type    : 'GET',
      data    : {},
      headers : {
         "Content-Type": "application/json"
      },
      dataType: 'json',
      success : function (data) {
         types[typeId] = data
         obj.html(data['@reference'])
      },
      error   : function (data) {
         obj.html(typeId)
      }
   });
}


var display_object_function = function(){

   var id   = $(this).html()
   var auth = $("#session").val()

   $.ajax({
      url: '/api/v1/objects/' + selectedCloudlet + "/" +id ,
      type: 'GET',
      data: {},
      headers: {
         "Content-Type"  : "application/json",
         "Authorization" : auth
      },
      dataType: 'json',
      success: function (data) {
         $("#data_container").show()
         $("#data").html(     JSON.stringify(data["@data"], undefined, 2))
         delete data["@data"]
         $("#meta_data").html(JSON.stringify(data, undefined, 2))

      },
      error: function (data) {
         console.log(data)
      }
   });

}