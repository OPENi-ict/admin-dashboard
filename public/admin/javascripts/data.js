var selectedCloudlet = '';
var types            = {}


$( document ).ready(function(){
   list_cloudlets_function('/api/v1/cloudlets/all_dev?limit=15')
})

var list_cloudlets_function = function(url) {

   var auth = $("#session").val();

   $("#cloudlet_id_list").html("");
   $("#cloudlet_id_list_nav").html("");

   $.ajax({
      url     :  url,
      type    : 'GET',
      data    : {},
      headers : {
         "Content-Type" : "application/json",
         "Authorization": auth
      },
      dataType: 'json',
      success : function (data) {

         for (var i = 0; i < data.result.length; i++) {
            var id = data.result[i][1];
            $("#cloudlet_id_list").append('<li><a href="#">' + id + '</a></li>');
         }

         $("ul#cloudlet_id_list li a").click(cloudletClick)

         var nav_html = ""
         if (null !== data.meta.prev){
            nav_html += "<button type=\"button\" class=\"btn btn-default btn-sm \" href=\"#\" onclick='list_cloudlets_function(\"" + data.meta.prev + "\")'>prev</button>"
         }
         if (null !== data.meta.next){
            nav_html += "<button type=\"button\" class=\"btn btn-default btn-sm \" href=\"#\"  onclick='list_cloudlets_function(\"" + data.meta.next + "\")' style=\"float:right\">next</button>"
         }
         //console.log(data.meta.)
         $("#cloudlet_id_list_nav").html(nav_html);
      },
      error   : function (data) {
         console.log(data)
      }
   });

   return false;
}


var cloudletClick = function(){

   var id   = $(this).html()
   var auth = $("#session").val()

   selectedCloudlet = id

   $("#type_id_list").html("")
   $("#object_id_list").html("")
   $("#object_id_list_nav").html("")

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
         $("ul#type_id_list li a").click(list_objects_function_wrapper)
         $('ul#type_id_list li a').each(load_real_name_function)
      },
      error: function (data) {
         console.log(data)
      }
   });

   return false
}


var list_objects_function_wrapper = function() {
   var id = $(this).attr('name');
   var url = '/api/v1/objects/' + selectedCloudlet + '?type=' + id + "&id_only=true&limit=20"
   list_objects_function(url)

   return false
}

var list_objects_function = function(url) {

   var auth = $("#session").val();

   $("#object_id_list").html("");
   $("#object_id_list_nav").html("");

   $.ajax({
      url     :  url,
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

         var nav_html = ""
         if (null !== data.meta.prev){
            nav_html += "<button type=\"button\" class=\"btn btn-default btn-sm \" href=\"#\" onclick='list_objects_function(\"" + data.meta.prev + "\")'>prev</button>"
         }
         if (null !== data.meta.next){
            nav_html += "<button type=\"button\" class=\"btn btn-default btn-sm \" href=\"#\"  onclick='list_objects_function(\"" + data.meta.next + "\")' style=\"float:right\">next</button>"
         }
         //console.log(data.meta.)
         console.log(nav_html)
         $("#object_id_list_nav").html(nav_html);
      },
      error   : function (data) {
         console.log(data)
      }
   });

   return false;
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

   return false
}