$(document).ready(function() {

var view = $("#tslshow");
var move = "100px";$("#tslshow");
var sliderLimit = -750
var totalItems = 0;
var width = 750;
$("#rightArrow").click(function(){
    var currentPosition = parseInt(view.css("left"));
    if(Math.abs(currentPosition) + 750 >= width){
      return;
    }
    if (currentPosition >= sliderLimit) view.stop(false,true).animate({left:"-="+move},{ duration: 400})

});
$("#leftArrow").click(function(event){
    var currentPosition = parseInt(view.css("left"));
    if (currentPosition < 0) view.stop(false,true).animate({left:"+="+move},{ duration: 400})

});
$('.picture').draggable({ revert: "invalid"});

$('input').change(function(e) {
        var file = e.originalEvent.srcElement.files[0];
        var img = document.createElement("img");
        img.className = "picture";
        var reader = new FileReader();
        reader.onloadend = function() {
             img.src = reader.result;
        }
        reader.readAsDataURL(file);
  			$("#tslshow").children('.picture').last().after(img);
        width += 150;
        $("#tslshow").css({width:width});
        $('.picture').draggable({ revert: "invalid"
        });
        $( "#rightArrow" ).trigger( "click" );
});
$('#canvas').droppable({
    accept: function(d) {
       	return !d.hasClass("nonDroppable");
    },
    tolerance: "pointer",
    drop: function (event, ui) {
        totalItems++;
        if(!!ui.draggable.children('canvas').length){
        	return;
        }
        var img = ui.draggable;

        var newCanvas = $('<canvas>');
        newCanvas.addClass("canvasChild");
        newCanvas.addClass("nonDroppable");
        newCanvas.addClass("docbox");
        newCanvas.css('background-image', 'url(' + $(img).attr('src') + ')');
        $("#canvas").append(newCanvas);
				//newCanvas.resizable({handles: "all"});
        //newCanvas.closest('div').draggable({containment: "parent"});
        $(newCanvas).freetrans();
       	$(img).css({display:"none"});
        return false;
    }
});
// $( '#canvas' ).on( 'click', ".ft-controls", function (e){
//
// $(".ft-controls").addClass("hideControls");
// $(this).removeClass("hideControls");
// });

$(document).click(function(event) {
 $(".ft-controls").addClass("hideControls");
 if($(event.target).attr('class') && $(event.target).parent().attr('class') == "ft-container"){
   	$(event.target).parent().children(".hideControls").removeClass("hideControls");
    $(event.target).parent().children("canvas").addClass("showControls");
 }
});


$(document).keyup(function(e){
    if(e.keyCode == 46) {
        $('.showControls').parent().remove();
    }
});

});
