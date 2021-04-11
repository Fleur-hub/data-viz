let tablesYear;
let tablesMonth;
let table;
let glob_table;
let yearCount = 0;
let channel = -1;
let anim_count = 1;
let anim_speed = 100;
let anim_delay_spent = 0;
let anim_delay_before_start = 80;
let endAnim_count = 0;
let endAnim_speed = 100;
let endAnim_delay_spent = 0;
let endAnim_delay_before_start = 80;
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
    frameRate(40);
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
    p.textSize(18);
    p.text('2010', x - 60, txtY);
    p.text('2019', x + size + 5, txtY);
}

function legends(x, y, p){
	p.fill(female_color);
    p.square(x, y, 20);
	p.fill(male_color);
	p.square(x, y + 30, 20);
	p.fill("#313033")
	p.textSize(15);
	p.text('Femmes', x + 30, y + 15);
	p.text('Hommes', x + 30, y + 45);
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
	vectors.push([mSumCircle, new Vector(0, 0, 1)]);
	vectors.push([fSumCircle, new Vector(0, 0, 1)]);
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
	for(let i = 0; i < anim_Vectors.length; ++i){
		circ = anim_Vectors[i][0];
		vec = anim_Vectors[i][1];
		//console.log(circ);
		r = circ.r;
		circ.point.applyVector(vec);
		if(circ.g.startsWith('m'))
			fill(male_color);
		else{
			fill(female_color);
		}
		if(circ.g.endsWith('s')){
			r = (r* (anim_count/anim_speed)) / 2;
		}
		else{
			r = r / getBaseLog(5,anim_count + 5);
		}
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

async function draw() {
	if(anim_Vectors.length == 0){
		let circles = drawMonthGraph(table, 1);
		computeAnimVectors(circles);
	}
	if(anim_delay_spent < anim_delay_before_start){
		anim_delay_spent += 1;
		return;
	}
	if(anim_count < anim_speed) {
		anim_count += 1;
		background("#FDFBF5");
		animateCircles();
	}
	else{
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
		if(endAnim_count == endAnim_speed){
			reset();
			noLoop();
		}
	}
}