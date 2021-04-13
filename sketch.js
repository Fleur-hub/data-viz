let tablesYear;
let tablesMonth;
let table;
let glob_table;
let frameRateVal = 40;
let year = '2010';
let channel = -1;
let anim_count = 1;
let anim_speed = frameRateVal * 2;
let anim_delay_spent = 0;
let anim_delay_before_start = Math.floor(frameRateVal * 2.5);
let endAnim_count = 0;
let endAnim_speed = frameRateVal * 2;
let endAnim_delay_spent = 0;
let endAnim_delay_before_start = Math.floor(frameRateVal);
let anim_Vectors = [];
let fMergeCircle;
let mMergeCircle;
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
    glob_table = loadTable('data/year/global_year.csv', 'csv', 'header');
}

function setup() {
	let glob = function(p){
		p.preload = function(){
		}
		p.setup = function(){
			p.createCanvas(screen.width, 400);
			p.background("#FDFBF5");
			p.noStroke();
			drawGlobal(p, glob_table);
		}
	};
	new p5(glob, 'GLOBAL_GRAPH');
    let canvas = createCanvas(screen.width , 400);
    canvas.parent('sketch');
    frameRate(frameRateVal);
    noStroke();
    changeChannel('TF1');
}

function drawGlobal(p){
	let y = 100;
	let x = (screen.width)/2 - ((glob_table.getRowCount()/2) * (space_between_chart) - (space_between_chart - rect_width)/2);
	let i = 0;
	for(; i < glob_table.getRowCount(); ++i){
		p.fill(male_color);
		p.rect(x + space_between_chart*i, y + 15, rect_width, (glob_table.getRow(i).get('male_duration'))/10 - 50);
		p.fill(female_color);
		p.rect(x + space_between_chart*i, y, rect_width, -(glob_table.getRow(i).get('female_duration'))/10 + 50);
	}

	legends(x, 300, p);
	sideLegends(x, y, space_between_chart*i, p);
}



function sideLegends(x, y, size, p, dateFirst, dateLast){
    p.fill("#313033")
    let txtY = y + 15;
    p.textSize(20);
	p.textFont("brandon-grotesque");
	p.textStyle(BOLD);
    p.text('2010', x - 60, txtY);
    p.text('2019', x + size + 5, txtY);
}

function legends(x, y, p){
	p.fill(female_color);
    p.square(x, y, 20);
	p.fill(male_color);
	p.square(x, y + 30, 20);
	p.fill("#313033");
	p.textSize(16);
	p.textFont("brandon-grotesque");
	p.text('Femmes', x + 30, y + 15);
	p.text('Hommes', x + 30, y + 45);
}

function changeYear(newYear){
	year = newYear;
	background("#FDFBF5");
	reset();
	loop();
}

async function changeChannel(newChannel){
	channel = newChannel;
	table = loadTable('data/month/'.concat(newChannel).concat(".csv"), 'csv', 'header', ()=>{background("#FDFBF5");reset();loop();});
}

Number.prototype.mod = function(n) {
	var m = (( this % n) + n) % n;
	return m < 0 ? m + Math.abs(n) : m;
};

let channelsIndex = 0

const channels = ['TF1','France 2','France 3', 'Canal+', 'Canal+ Sport','France 5','M6','ARTE','D8C8','W9','Monte Carlo TMC','NRJ 12','LCPPublic Sénat', 'BFM TV', 'I-TéléCNews', 'France O', "L\'Equipe 21",'Chérie 25','LCI','Animaux','Chasse et pêche', 'La chaîne Météo', 'Comédie+','Euronews','Eurosport France','France 24','Histoire','Paris Première','Planète+','Téva','Toute l\'Histoire','TV5 Monde','TV Breizh','Voyage'];

const arrowPrev = document.querySelector('.arrow-prev');
const arrowNext = document.querySelector('.arrow-next');

function changeIndex(operator){
	channelsIndex += operator;
	channelsIndex = channelsIndex.mod(channels.length);
	changeChannel(channels[channelsIndex]);
}

arrowPrev.addEventListener('click',()=>changeIndex(-1));
arrowNext.addEventListener('click',()=>changeIndex(1));


function listDurationOfYear(table, year){
    let duration = [[],[]];
    let rows = table.matchRows(year.concat('.*'), 'date');
    for(let i = 0; i < rows.length; ++i){
        duration[0].push(rows[i].get('male_duration'));
        duration[1].push(rows[i].get('female_duration'));
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
				if (d < myCircle.r + existing.r + 20) {
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
	let constraint = new Constraint(300, screen.width - 100, 60, 340, 1/50);
    // populate circles array
    // brute force method continues until # of circles target is reached
	let circles = generateCircleCoordinate([], durationLst[0], 'm', constraint);
	circles = generateCircleCoordinate(circles, durationLst[1], 'f', constraint);
    // circles array is complete
    // draw canvas once
	let color;
    for (let i = 0; i < circles.length; i++) {
	    color = male_color
	    if(circles[i].g == 'f') {
		    color = female_color;
	    }
	    fill(255, 255, 255);
	    stroke(color);
	    circle(circles[i].x, circles[i].y, circles[i].r*2 + 10);
	    fill(color);
	    circle(circles[i].x, circles[i].y, circles[i].r*2);

    }
    return circles;
}

function computeAnimVectors(circles){
	let vectors = [];
	let fMerge = new Point(2*screen.width/5, 200);
	let mMerge = new Point(2*screen.width/3, 200);
	let mSumCircle = new MyCircle(mMerge.x, mMerge.y, 0, 'ms');
	let fSumCircle = new MyCircle(fMerge.x, fMerge.y, 0, 'fs');
	for(let i = 0; i < circles.length; ++i){
		if(circles[i].g == 'f'){
			vectors.push([circles[i], Vector.vectorOf(circles[i].point, fMerge)]);
			fSumCircle.r +=  circles[i].r;
		}
		else{
			vectors.push([circles[i], Vector.vectorOf(circles[i].point, mMerge)]);
			mSumCircle.r += circles[i].r;
		}
	}
	if(year == 9){
		mSumCircle.r = mSumCircle.r * 4
		fSumCircle.r = fSumCircle.r * 4
	}
	vectors.push([mSumCircle, new Vector(0, 0, 1)]);
	vectors.push([fSumCircle, new Vector(0, 0, 1)]);
	fMergeCircle = fSumCircle;
	mMergeCircle = mSumCircle;
	fMergeCircle.r = fMergeCircle.r / 2;
	mMergeCircle.r = mMergeCircle.r / 2;
	anim_Vectors = vectors;
	return vectors;
}

function getBaseLog(x, y) {
	return Math.log(y) / Math.log(x);
}

function animateCircles(){
	let circ;
	let vec;
	let r;
	let over_r;
	let color;
	for(let i = anim_Vectors.length - 1; i >= 0; --i){
		circ = anim_Vectors[i][0];
		vec = anim_Vectors[i][1];
		//console.log(circ);
		r = circ.r;
		circ.point.applyVector(vec);
		if(circ.g.startsWith('m'))
			color = male_color;
		else{
			color = female_color;
		}
		if(circ.g.endsWith('s')){
			over_r = r;
			r = r* (anim_count/anim_speed);
		}
		else{
			r = 2 * r / getBaseLog(5,anim_count + 5);
			over_r = r;
		}
		fill(255, 255, 255);
		stroke(color);
		circle(circ.point.x, circ.point.y, over_r + 10);
		noStroke();
		fill(color);
		circle(circ.point.x, circ.point.y, r);
	}
}

function computeEndAnimVec(){
	let center = new Point(screen.width/2, 200);
	for(let i = 0; i < anim_Vectors.length; ++i){
		anim_Vectors[i][1] = Vector.vectorOf(anim_Vectors[i][0].point, center);
	}
}

function reset(){
	endAnim_count = 0;
	endAnim_delay_spent = 0;
	anim_delay_spent = 0;
	anim_Vectors = [];
	anim_count = 1;
}

function mouseOverLegends(){
	let txtSize = 35;
	textSize(txtSize);
	textFont("brandon-grotesque");
	textStyle(BOLD);
	let space = 50;
	if(dist(mouseX, mouseY, fMergeCircle.point.x, fMergeCircle.point.y) < fMergeCircle.r/2 ) {
		fill("#424044");
		let percentageOfSpeak = 100 * fMergeCircle.r / (fMergeCircle.r + mMergeCircle.r);
		strokeWeight(1);
		stroke("#424044");
		line(mMergeCircle.point.x, mMergeCircle.point.y, mMergeCircle.point.x + mMergeCircle.r / 2 + space, mMergeCircle.point.y);
		noStroke();
		text(percentageOfSpeak.toFixed(2).toString() + " %", mMergeCircle.point.x + mMergeCircle.r / 2 + space + 20, mMergeCircle.point.y + txtSize/3);
		return;
	}
	if(dist(mouseX, mouseY, mMergeCircle.point.x, mMergeCircle.point.y) < mMergeCircle.r/2) {
		fill("#424044");
		percentageOfSpeak = 100 * mMergeCircle.r / (fMergeCircle.r + mMergeCircle.r);
		strokeWeight(1);
		stroke("#424044");
		line(mMergeCircle.point.x, mMergeCircle.point.y - mMergeCircle.r / 2 + 5, mMergeCircle.point.x + mMergeCircle.r / 3 + space * 2, mMergeCircle.point.y - mMergeCircle.r / 2 + 5);
		noStroke();
		text(percentageOfSpeak.toFixed(2).toString() + " %", mMergeCircle.point.x + mMergeCircle.r / 3 + space * 2 + 20, mMergeCircle.point.y - mMergeCircle.r / 2 + 5 + txtSize/3);
	}
}

async function draw() {
	if(anim_Vectors.length == 0){
		let circles = drawMonthGraph(table, year);
		if(circles.length == 0){
			let txtSize = 35;
			noStroke();
			textAlign(CENTER);
			textSize(txtSize);
			textFont("brandon-grotesque");
			textStyle(BOLD);
			fill("#424044");
			text("Pas de données", screen.width/2, 200);
			noLoop();
			textAlign(LEFT);
			return;
		}
		computeAnimVectors(circles);
	}
	if(anim_delay_spent < anim_delay_before_start){
		anim_delay_spent += 1;
		return;
	}
	if(anim_count < anim_speed) {
		anim_count += 1;
		if(anim_count + 1 == anim_speed){
			anim_Vectors = [anim_Vectors[anim_Vectors.length - 1], anim_Vectors[anim_Vectors.length-2]];
		}
		background("#FDFBF5");
		animateCircles();
	}
	else if(endAnim_count != endAnim_speed){
		if(endAnim_delay_spent == 0){
			computeEndAnimVec();
		}
		if(endAnim_delay_spent < endAnim_delay_before_start){
			endAnim_delay_spent += 1;
			return;
		}
		background("#FDFBF5");
		animateCircles();
		endAnim_count += 1;
		return;
	}
	else {
		background("#FDFBF5");

		fill(255, 255, 255);
		stroke(male_color);
		circle(mMergeCircle.point.x, mMergeCircle.point.y, mMergeCircle.r+ 10);

		noStroke();
		fill(male_color);
		circle(mMergeCircle.point.x, mMergeCircle.point.y, mMergeCircle.r);

		fill(255, 255, 255);
		stroke(female_color);
		circle(fMergeCircle.point.x, fMergeCircle.point.y, fMergeCircle.r + 10);

		noStroke();
		fill(female_color);
		circle(fMergeCircle.point.x, fMergeCircle.point.y, fMergeCircle.r);

		mouseOverLegends();
	}
}