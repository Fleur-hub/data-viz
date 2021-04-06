let tablesYear;
let tablesMonth;
let table;
let yearCount = 0;
let channel = -1;
let space_between_chart = 50;
let rect_width = 35;

function preload(){
    table = loadTable('data/year/global_year.csv', 'csv', 'header');
    /*tablesMonth = [];
    tablesYear = [];
    files.forEach(function(item,index){
        tablesMonth.push(loadTable(item, 'csv', 'header'));
    });

    console.log(tablesMonth.length);
    */
}

function setup() {
    let canvas = createCanvas(screen.width , 400);
    canvas.parent('sketch');
    noStroke();
}

function drawGlobal(){
	var y = 100;
	let x = (screen.width)/2 - ((table.getRowCount()/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
	var i = 0;
	for(; i < table.getRowCount(); ++i){
		fill("#FFD95C");
		rect(x + space_between_chart*i, y + 15, rect_width, (table.getRow(i).get('male_duration'))/10 - 50);
		fill("#25696B");
		rect(x + space_between_chart*i, y, rect_width, -(table.getRow(i).get('female_duration'))/10 + 50);
	}

	legends(x, 300);
	sideLegends(x, y, space_between_chart*i);
}

function drawChart(table, year){
    var y = 100;
    const month = 12;
	let x = (screen.width)/2 - ((month/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
    var i = 0;
    for(; i < 12; ++i){
    	console.log("here");
        fill("#FFD95C");
        rect(x + space_between_chart*i, y + 15, rect_width, (table.getRow(i + (year * 12)).get('male_duration'))/10 - 50);
        fill("#25696B");
        rect(x + space_between_chart*i, y, rect_width, -(table.getRow(i + (year * 12)).get('female_duration'))/10 + 50);
    }

    legends(x, 300);
    sideLegends(x, y, space_between_chart*i);
}

function drawDotGraph(table, year){
    var y = 100;
    const month = 12;
	let x = (screen.width)/2 - ((month/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
    var i = 0;
    for(; i < 12; ++i){
    	console.log("here");
        fill("#FFD95C");
        rect(x + space_between_chart*i, y + 15, rect_width, (table.getRow(i + (year * 12)).get('male_duration'))/10 - 50);
        fill("#25696B");
        rect(x + space_between_chart*i, y, rect_width, -(table.getRow(i + (year * 12)).get('female_duration'))/10 + 50);
    }

    legends(x, 300);
    sideLegends(x, y, space_between_chart*i);
}

function sideLegends(x, y, size, dateFirst, dateLast){
    fill("#313033")
    var txtY = y + 15;
    textSize(18);
    text('2010', x - 60, txtY);
    text('2019', x + size + 5, txtY);
}

function legends(x, y){
    fill("#25696B");
    square(x, y, 20);
    fill("#FFD95C");
    square(x, y + 30, 20);
    fill("#313033")
    textSize(15);
    text('Femmes', x + 30, y + 15);
    text('Hommes', x + 30, y + 45);
}

function changeChannel(newChannel){
	channel = newChannel;
	table = loadTable('data/month/'.concat(newChannel).concat(".csv"), 'csv', 'header', loop);

}

function draw() {
	background("#FDFBF5");
	if(channel == -1){
		console.log("glob")
		drawGlobal();
	}
	else{
		console.log(channel);
		drawChart(table, 0);
	}
    noLoop();
}

