(function($){
	
	//Déclaration des variables
	var numberOfAlleles=$("#amount").html(),alleleProportions=[],alleleLabels=["p","q","r","s","t"],continueCalculation=1,alleleCombinations=[],alleleCombinationLabels=[],alleleCombinationsName=[],alleleCharL=[],totalCombinations,dataKeys=[],dataSet=[],proportionTotal,chartData="alleles",firstRun=1,showOptions=0;
	
	//Largeur et hauteur du graphique
	var chartWidth=490,chartHeight=150,barWidth;
	
	/*.append(svg) rajoute un élément svg
	.attr change sa largeur et sa hauteur
	En gros cette ligne permet de créer les dimensions de la charte */
	var svg=d3.select("#chart")
		.append("svg")
		.attr("width",chartWidth)
		.attr("height",chartHeight),
		x=d3.scale.linear().range([0,chartWidth-20]),
		y=d3.scale.linear().range([chartHeight-20,0]),
		z=d3.scale.category10();
	
	//Une fonction, je sais pas encore ce qu'elle fait, peut être tronquage
	function roundNumb(numberToRound,fixedDigits){
		var i,changeToFixed,valueToReturn=numberToRound;
		for(i=0;i<=fixedDigits;i+=1){
			changeToFixed=Math.round(valueToReturn*Math.pow(10,fixedDigits-i))/Math.pow(10,fixedDigits-i);
			if(changeToFixed-valueToReturn!=0)return valueToReturn;
			valueToReturn=changeToFixed
		}
		return valueToReturn
	}

	/*Je pense que cette fonction permet d'attribuer à alleleProportions une certaine valeur,
	ici égale à numberOfAlleles (elle-même attribuée par un bouton)*/
	function recalculateAlleleArray(){
		if(alleleProportions.length>numberOfAlleles)alleleProportions.length=numberOfAlleles;
		else while(alleleProportions.length!=numberOfAlleles)alleleProportions.push(0)
	}

	// Le slider qui permet de choisir le nombre d'allèles différents
	function makeNumberOfAlleleSlider(){
		$("#slider").slider({
			min:1,max:5,step:1,value:numberOfAlleles,slide:function(event,ui){
				$("#amount").html(ui.value)
			},change:function(event,ui){ //Je pense que ça ça sert à changer le nombre affiché d'allèles
				$("#amount").html(ui.value);
				numberOfAlleles=ui.value;
				recalculateAlleleArray();
				proportionTotal=sumArray(alleleProportions);
				fixAlleleProportions();
				adjustAllels()
			}
		})
	}
	function sumArray(array){
		var i,total=0;
		for(i=0;i<array.length;i+=1)total+=+array[i];
		if(!isNaN){
			total=total.toFixed(4);
			total=roundNumb(total,4)
		}
		return total
	}
	function determineAlleleCombinations(){
		var i,j,varToPush;
		alleleCombinations=[];
		alleleCombinationLabels=[];
		alleleCombinationsName=[];
		alleleCharL=[];
		totalCombinations=0;
		for(i=0;i<alleleProportions.length;i+=1)
			for(j=i;j<alleleProportions.length;j+=1)
				if(i==j){
					alleleCombinationLabels.push(alleleLabels[j]+"<sup>2</sup>");
					alleleCharL.push(alleleLabels[j]+'<tspan baseline-shift = "super">2</tspan>');
					alleleCombinationsName.push(alleleLabels[j]+"2");
					varToPush=alleleProportions[i]*alleleProportions[j];
					varToPush=varToPush.toFixed(3);
					varToPush=roundNumb(varToPush,3);
					alleleCombinations.push(varToPush)
				}
				else{
					varToPush=2*alleleProportions[i]*alleleProportions[j];
					varToPush=varToPush.toFixed(3);
					varToPush=roundNumb(varToPush,3);
					alleleCombinationLabels.push("2"+alleleLabels[i]+alleleLabels[j]);
					alleleCharL.push("2"+alleleLabels[i]+alleleLabels[j]);
					alleleCombinationsName.push(alleleLabels[i]+alleleLabels[j]+"2");
					alleleCombinations.push(varToPush)
				}
		for(i=0;i<alleleCombinations.length;i+=1)
			totalCombinations+=+alleleCombinations[i];
			totalCombinations=totalCombinations.toFixed(0)
	}
	function fixAlleleProportions(){
		var i=1,numbOfAllelePositions=alleleProportions.length;
		while(proportionTotal!=1){
			if(proportionTotal>1){
				if(+alleleProportions[alleleProportions.length-i]<=0)i+=1;
				tempVar=+alleleProportions[alleleProportions.length-i];
				tempVar-=0.001
			}
			else{
				if(+alleleProportions[alleleProportions.length-i]>=1)i+=1;
				tempVar=+alleleProportions[alleleProportions.length-i];
				tempVar+=0.001
			}
			tempVar=tempVar.toFixed(3);
			tempVar=roundNumb(tempVar,3);
			if(tempVar>=0)alleleProportions[alleleProportions.length-i]=tempVar;
			proportionTotal=sumArray(alleleProportions);
			proportionTotal=proportionTotal.toFixed(4);
			proportionTotal=roundNumb(proportionTotal,4)
		}
	}
	function checkAlleleProportions(){
		var i,proportionTotal=sumArray(alleleProportions),tempVar;
		proportionTotal=proportionTotal.toFixed(4);
		proportionTotal=roundNumb(proportionTotal,4);
		if(proportionTotal!=1)continueCalculation=0;
		else continueCalculation=1;
		errorAlert();
		return proportionTotal
	}
	function makeProportionsEven(){
		var proportionValues=[[0],[1],[0.5,0.5],[0.334,0.333,0.333],[0.25,0.25,0.25,0.25],[0.2,0.2,0.2,0.2,0.2]];
		alleleProportions=proportionValues[numberOfAlleles]
	}
	function drawDataEntryDiv(){
		var i;
		$("#dataEntryDiv").html("Allele Frequencies: <br />");
		for(i=0;i<alleleProportions.length;i+=1)$("#dataEntryDiv").append(alleleLabels[i]+' = <input class="alleleInput"type="text" name="allele_'+alleleLabels[i]+'" value="'+alleleProportions[i]+'" size="4" maxlength="5" /><br />')
	}
	function drawAlleleDiv(){
		$("#alleleFormulaDiv").html("");
		for(i=0;i<alleleProportions.length;i+=1){
			$("#alleleFormulaDiv").append(alleleProportions[i]);
			if(i<alleleProportions.length-1)$("#alleleFormulaDiv").append(" + ");
			else $("#alleleFormulaDiv").append(" = "+proportionTotal)
		}
	}
	function drawAleleFormulaDiv(){
		$("#equationOneDiv").html("");
		for(i=0;i<alleleProportions.length;i+=1){
			$("#equationOneDiv").append(alleleLabels[i]);
			if(i<alleleProportions.length-1)$("#equationOneDiv").append(" + ");
			else $("#equationOneDiv").append(" = "+proportionTotal)
		}
	}
	function drawGenotypeDiv(){
		$("#genotypeFormulaDiv").html("");
		for(i=0;i<alleleCombinations.length;i+=1){
			$("#genotypeFormulaDiv").append('<input class="genotypeInput"type="text" name="_'+alleleCombinationLabels[i]+'" value="'+alleleCombinations[i]+'" size="4" maxlength="5" />');
			if(i<alleleCombinations.length-1)$("#genotypeFormulaDiv").append(" + ");
			else $("#genotypeFormulaDiv").append(" = "+totalCombinations)
		}
	}
	function generateChartData(){
		var i,activeData,activeLabels,returnData=[];
		if(chartData=="alleles"){
			activeData=alleleProportions;
			activeLabels=alleleLabels
		}
		else{
			activeData=alleleCombinations;
			activeLabels=alleleCombinationsName
		}
		for(i=0;i<activeData.length;i+=1)returnData.push({label:activeLabels[i],value:activeData[i]});
		return returnData
	}
	function updateChart(){
		var dataSet=generateChartData();
		var i,maxVal=0;
		for(i=0;i<dataSet.length;i+=1)if(dataSet[i].value>maxVal)maxVal=dataSet[i].value;
		var column=svg.selectAll("rect").data(dataSet,function(d){return d.label});
		var columnLabel=svg.selectAll("text").data(dataSet,function(d){return d.label});
		column.attr("class","update").attr("class",function(d){return d.label}).transition().duration(250).attr("x",function(d,i){return i*32}).attr("y",function(d){return chartHeight-(0.1+(chartHeight-40)*(d.value/maxVal))}).attr("height",function(d){return 0.1+(chartHeight-40)*(d.value/maxVal)});
		columnLabel.attr("class","updateL").transition().duration(250).attr("x",function(d,i){return 16+i*32}).attr("y",function(d){return chartHeight-(13+(chartHeight-40)*(d.value/maxVal))}).text(function(d){return d.value});
		column.enter().append("rect").attr("class","enter").attr("class",function(d){return d.label}).attr("x",function(d,i){return i*32}).attr("y",function(d){return chartHeight-(0.1+(chartHeight-40)*(d.value/maxVal))}).attr("width",30).attr("height",function(d){return 0.1+(chartHeight-40)*(d.value/maxVal)}).style("fill",function(d,i){var j,colorPos;for(j=0;j<dataKeys.length;j+=1)if(dataKeys[j]==d.label){colorPos=j;break}return z(colorPos)}).style("fill-opacity",1E-6).transition().duration(250).style("fill-opacity",1);
		columnLabel.enter().append("text").attr("class","enterL").attr("x",function(d,i){return 16+i*32}).attr("y",function(d){return chartHeight-(13+(chartHeight-40)*(d.value/maxVal))}).attr("dy",".35em").style("fill-opacity",1E-6).style("text-anchor","middle").style("font-size","10px").text(function(d){return d.value}).transition().duration(250).style("fill-opacity",1);
		column.exit().attr("class","exit").transition().duration(250).style("fill-opacity",1E-6).remove();
		columnLabel.exit().attr("class","exit").transition().duration(250).style("fill-opacity",1E-6).remove();
		insertColumnLabels()
	}
	function insertColumnLabels(){
		var i,divContent="",activeArray,loopLength;
		if(chartData=="alleles"){
			activeArray=alleleLabels;
			loopLength=dataSet.length
		}
		else{
			activeArray=alleleCombinationLabels;
			loopLength=activeArray.length
		}
		for(i=0;i<loopLength;i+=1){
			divContent+='<div style="float: left; width: 32px; text-align: center;">';
			divContent+=activeArray[i];divContent+="</div>"
		}
		$("#chartCategoryLabels").html(divContent)
	}
	function setColumWidths(){
	}
	function setYValues(){
	}
	function adjustAllels(){
		var i,evenSplit=1/numberOfAlleles;
		evenSplit=evenSplit.toFixed(3);
		evenSplit=roundNumb(evenSplit,3);
		if(firstRun==1){
			alleleProportions=[];
			for(i=0;i<numberOfAlleles;i+=1)alleleProportions.push(evenSplit);
			firstRun=0
		}
		proportionTotal=checkAlleleProportions();
		determineAlleleCombinations();
		drawDataEntryDiv();
		assignListeners();
		drawAlleleDiv();
		drawAleleFormulaDiv();
		drawGenotypeDiv();
		$("#equationTwoDiv").html("");
		for(i=0;i<alleleCombinationLabels.length;i+=1){
			$("#equationTwoDiv").append(alleleCombinationLabels[i]);
			if(i<alleleCombinationLabels.length-1)$("#equationTwoDiv").append(" + ");
			else $("#equationTwoDiv").append(" = "+totalCombinations)
		}
		dataSet=generateChartData();
		updateChart();
		var stopPoint=0
	}
	function errorAlert(){
		if(continueCalculation==0)$("#errorDiv").slideDown(500);
		else $("#errorDiv").slideUp(500)
	}
	function updateAlleles(){
		var i,tempVar=0;
		alleleProportions=[];
		$("input.alleleInput[type=text]").each(function(){var textValue=$(this).val();alleleProportions.push(textValue)});
		for(i=0;i<alleleProportions.length;i+=1){
			if(isNaN(+alleleProportions[i]))alleleProportions[i]=0;
			if(+alleleProportions[i]<0)alleleProportions[i]=0;
			if(+alleleProportions[i]>1)alleleProportions[i]=1;
			tempVar=+alleleProportions[i];
			tempVar=tempVar.toFixed(3);
			tempVar=roundNumb(tempVar,3);
			alleleProportions[i]=tempVar
		}
		proportionTotal=sumArray(alleleProportions);
		fixAlleleProportions();
		adjustAllels()
	}
	function makeDataKeys(){
		var i,j,varToPush;
		for(i=0;i<alleleLabels.length;i+=1)dataKeys.push(alleleLabels[i]);
		for(i=0;i<alleleLabels.length;i+=1)for(j=i;j<alleleLabels.length;j+=1)if(i==j)dataKeys.push(alleleLabels[j]+"2");else dataKeys.push(alleleLabels[i]+alleleLabels[j]+"2")
	}
	$("document").ready(function(){makeDataKeys();makeNumberOfAlleleSlider();adjustAllels();firstRun==0});
	function assignListeners(){
		$("input.alleleInput[type=text]").on("blur",function(){updateAlleles();adjustAllels()});
		$("input.genotypeInput[type=text]").on("blur",function(){updateAlleles()})
	}
	$("#evenButton").on("click",function(){makeProportionsEven();adjustAllels();fixAlleleProportions();updateAlleles()});
	$("#chartAlleles").on("click",function(){if(chartData=="alleles");else{chartData="alleles";$("#chartGenotypes").css({"background-color":"#dedede"});$("#chartAlleles").css({"background-color":"#9fe2bf"})}updateAlleles()});
	$("#chartGenotypes").on("click",function(){if(chartData=="genotype");else{chartData="genotype";$("#chartGenotypes").css({"background-color":"#9fe2bf"});$("#chartAlleles").css({"background-color":"#dedede"})}updateAlleles()});
	$("#optionButton").on("click",function(){if(showOptions==0){showOptions=1;$("#optionsDiv").slideDown(250)}else{showOptions=0;$("#optionsDiv").slideUp(250)}});
	$("input:radio[name=inputType]").on("change",function(){adjustAllels();fixAlleleProportions();adjustAllels();updateAlleles()})
})(jQuery);
