$(document).ready(function() {



function fqAA () {
	$("#fqAA").html(Math.round($("#fqA").val()*$("#fqA").val()*1000000000000)/1000000000000);
}

function fqBB () {
	$("#fqBB").html(Math.round($("#fqB").val()*$("#fqB").val()*1000000000000)/1000000000000);
}

function fqAB () {
	$("#fqAB").html(Math.round(2*$("#fqA").val()*$("#fqB").val()*1000000000000)/1000000000000);
}

$("#populations").selectmenu({
	change: function (event, ui) {
		var pop = ui.item.value
		if (pop==="cauc") {
			$("#fqA").val(0.979714)
			$("#fqB").val(Math.round((1-$("#fqA").val())*10000000)/10000000);
		}
		else if (pop==="arab") {
			$("#fqA").val(0.984621)
			$("#fqB").val(Math.round((1-$("#fqA").val())*10000000)/10000000);
		}
		else if (pop==="asia") {
			$("#fqA").val(0.994413)
			$("#fqB").val(Math.round((1-$("#fqA").val())*10000000)/10000000);
		}
		else if (pop==="hisp") {
			$("#fqA").val(0.989012)
			$("#fqB").val(Math.round((1-$("#fqA").val())*10000000)/10000000);
		}
		else if (pop==="noir") {
			$("#fqA").val(0.992807)
			$("#fqB").val(Math.round((1-$("#fqA").val())*10000000)/10000000);
		} 
		fqAA();
		fqAB();
		fqBB();
	}
});

$("#fqA").change(function () {
	var max = parseInt($("#fqA").attr('max'));
	var min = parseInt($("#fqA").attr('min'));
	if ($("#fqA").val() > max) {
		$("#fqA").val(max);
	}
	else if ($("#fqA").val()<min) {
		$("#fqA").val(min);
	};
	$("#fqB").val(Math.round((1-$("#fqA").val())*10000000)/10000000);
});

$("#fqB").change(function () {
	var max = parseInt($("#fqB").attr('max'));
	var min = parseInt($("#fqB").attr('min'));
	if ($("#fqB").val() > max) {
		$("#fqB").val(max);
	}
	else if ($("#fqB").val()<min) {
		$("#fqB").val(min);
	};
	$("#fqA").val(Math.round((1-$("#fqB").val())*10000000)/10000000);
});

$("#fqA").change(fqAA);
$("#fqA").change(fqAB);
$("#fqA").change(fqBB);
$("#fqB").change(fqAA);
$("#fqB").change(fqAB);
$("#fqB").change(fqBB);
			
fqAA();
fqBB();
fqAB();

$(document).ready(function(){
	$("#sticker").sticky({topSpacing:0});
});

});