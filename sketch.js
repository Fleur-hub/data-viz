let tablesYear;
let tablesMonth;
let table;
let yearCount = 0;
let channel = -1;
let anim_count = 0;
let anim_speed = 100;
let anim_Vectors = []
let space_between_chart = 50;
let rect_width = 35;
let male_color = "#25696B";
let female_color = "#ffd95c";

class Constraint{
	constructor(xStart, xEnd, yStart, yEnd, reductionRatio) {
		this.xStart = xStart;
		this.xEnd = xEnd;
		this.yStart = yStart;
		this.yEnd = yEnd;
		this.reductionRatio = reductionRatio;
	}
}

class MyCircle{
	constructor(x, y, r, g) {
		this.point = new Point(x, y);
		this.x = x;
		this.y = y;
		this.r = r;
		this.g = g;
	}
}

class Vector{
	constructor(dx, dy, magnitude) {
		this.dx = dx;
		this.dy = dy;
		this.magnitude = magnitude;
	}

	static vectorOf(a, b){
		return new Vector(b.x - a.x, b.y - a.y, 1/anim_speed);
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	applyVector(vec){
		this.x = this.x + vec.dx * vec.magnitude;
		this.y = this.y + vec.dy * vec.magnitude;
	}

	distance(b) {
		const dx = this.x - b.x;
		const dy = this.y - b.y;
		return Math.hypot(dx, dy);
	}
}

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
    frameRate(25);
    noStroke();
}

function drawGlobal(){
	let y = 100;
	let x = (screen.width)/2 - ((table.getRowCount()/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
	let i = 0;
	for(; i < table.getRowCount(); ++i){
		fill(male_color);
		rect(x + space_between_chart*i, y + 15, rect_width, (table.getRow(i).get('male_duration'))/10 - 50);
		fill(female_color);
		rect(x + space_between_chart*i, y, rect_width, -(table.getRow(i).get('female_duration'))/10 + 50);
	}

	legends(x, 300);
	sideLegends(x, y, space_between_chart*i);
}

function drawChart(table, year){
    let y = 100;
    const month = 12;
	let x = (screen.width)/2 - ((month/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
    let i = 0;
    for(; i < 12; ++i){
    	fill(male_color);
        rect(x + space_between_chart*i, y + 15, rect_width, (table.getRow(i + (year * 12)).get('male_duration'))/10 - 50);
        fill(female_color);
        rect(x + space_between_chart*i, y, rect_width, -(table.getRow(i + (year * 12)).get('female_duration'))/10 + 50);
    }

    legends(x, 300);
    sideLegends(x, y, space_between_chart*i);
}

function drawDotGraph(table, year){
    let y = 100;
    const month = 12;
	let x = (screen.width)/2 - ((month/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
    let i = 0;
    for(; i < 12; ++i){
    	fill(male_color);
        rect(x + space_between_chart*i, y + 15, rect_width, (table.getRow(i + (year * 12)).get('male_duration'))/10 - 50);
        fill(female_color);
        rect(x + space_between_chart*i, y, rect_width, -(table.getRow(i + (year * 12)).get('female_duration'))/10 + 50);
    }

    legends(x, 300);
    sideLegends(x, y, space_between_chart*i);
}

function sideLegends(x, y, size, dateFirst, dateLast){
    fill("#313033")
    let txtY = y + 15;
    textSize(18);
    text('2010', x - 60, txtY);
    text('2019', x + size + 5, txtY);
}

function legends(x, y){
	fill(female_color);
    square(x, y, 20);
	fill(male_color);
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

function listDurationOfYear(table, year){
    let duration = [[],[]];
    for(let i = year * 12; i < ((year + 1) * 12); ++i){
        duration[0].push(table.getRow(i).get('male_duration'));
        duration[1].push(table.getRow(i).get('female_duration'));
    }
    return duration;
}

function generateCircleCoordinate(circles, durationLst, gender, constraint){
	let myCircle = {};
	for(let i = 0; i < durationLst.length; ++i){
		let overlapping = true;
		while(overlapping){
			myCircle = new MyCircle(random(constraint.xStart, constraint.xEnd),
					random(constraint.yStart, constraint.yEnd),
					durationLst[i] * constraint.reductionRatio,
					gender);

			overlapping = false;

			// check that it is not overlapping with any existing circle
			// another brute force approach
			for (let i = 0; i < circles.length; i++) {
				let existing = circles[i];
				let d = dist(myCircle.x, myCircle.y, existing.x, existing.y)
				if (d < myCircle.r + existing.r) {
					// They are overlapping
					overlapping = true;
					// do not add to array
					break;
				}
			}
		}
		circles.push(myCircle);
	}

	return circles;
}

function drawMonthGraph(table, year) {
    //let canvasMonth = createCanvas(screenWidth, 400);
    //canvasMonth.position(windowWidth, 500);
	let durationLst = listDurationOfYear(table, year);
	let constraint = new Constraint(300, screen.width - 60, 60, 340, 1/50);
    // populate circles array
    // brute force method continues until # of circles target is reached
	let circles = generateCircleCoordinate([], durationLst[0], 'm', constraint);
	circles = generateCircleCoordinate(circles, durationLst[1], 'f', constraint);
    // circles array is complete
    // draw canvas once
    for (let i = 0; i < circles.length; i++) {
	    fill(male_color);
	    if(circles[i].g == 'f') {
		    fill(female_color);
	    }
	    ellipse(circles[i].x, circles[i].y, circles[i].r*2, circles[i].r*2);
    }
    return circles;
}

function computeAnimVectors(circles){
	let vectors = [];
	let fMerge = new Point(350, 200);
	let mMerge = new Point(750, 200);
	for(let i = 0; i < circles.length; ++i){
		if(circles[i].g == 'f'){
			vectors.push([circles[i], Vector.vectorOf(circles[i].point, fMerge)]);
		}
		else{
			vectors.push([circles[i], Vector.vectorOf(circles[i].point, mMerge)]);
		}
	}
	anim_Vectors = vectors;
	return vectors;
}

function animateCircles(){
	let circ;
	let vec;
	for(let i = 0; i < anim_Vectors.length; ++i){
		circ = anim_Vectors[i][0];
		vec = anim_Vectors[i][1];
		circ.point.applyVector(vec);
		fill(male_color);
		if(circ.g == 'f'){
			fill(female_color);
		}
		circle(circ.point.x, circ.point.y, circ.r);
	}
}

function reset(){
	anim_Vectors = [];
	anim_count = 0;
}

function draw() {
	background("#FDFBF5");
	if(channel == -1){
		drawGlobal();
		noLoop();
		return;
	}
	if(anim_Vectors.length == 0){
		let circles = drawMonthGraph(table, 1);
		computeAnimVectors(circles);
	}
	animateCircles();
	anim_count += 1;
	if(anim_count == 100) {
		reset();
		noLoop();
	}
}