var DataFrame = dfjs.DataFrame;

function main(df){
    var grouped = df.groupBy('date').aggregate(group => group.stat.mean('male_duration', 'female_duration')).rename('aggregation', 'groupMean');
}

//var df = DataFrame.fromCSV('data/global.csv').then(df => main(df)

//Scroll smooth

const ancre = document.querySelector('.ancre');
const section = document.querySelector('#graph')

ancre.addEventListener('click',()=>{
    section.scrollIntoView({ block: 'end',  behavior: 'smooth' })
})

// Variables

const dot1 = document.querySelector('.dot-1');
const year2010 = document.querySelector('.year2010');

const dot2 = document.querySelector('.dot-2');
const year2011 = document.querySelector('.year2011');

const dot3 = document.querySelector('.dot-3');
const year2012 = document.querySelector('.year2012');

const dot4 = document.querySelector('.dot-4');
const year2013 = document.querySelector('.year2013');

const dot5 = document.querySelector('.dot-5');
const year2014 = document.querySelector('.year2014');

const dot6 = document.querySelector('.dot-6');
const year2015 = document.querySelector('.year2015');

const dot7 = document.querySelector('.dot-7');
const year2016 = document.querySelector('.year2016');

const dot8 = document.querySelector('.dot-8');
const year2017 = document.querySelector('.year2017');

const dot9 = document.querySelector('.dot-9');
const year2018 = document.querySelector('.year2018');

const dot10 = document.querySelector('.dot-10');
const year2019 = document.querySelector('.year2019');

const dots = [[dot1,year2010, '2010'],[dot2,year2011, '2011'],[dot3,year2012, '2012'],[dot4,year2013, '2013'],[dot5,year2014, '2014'],[dot6,year2015, '2015'],[dot7,year2016, '2016'],[dot8,year2017, '2017'],[dot9,year2018, '2018'],[dot10,year2019, '2019']];

function changeDate(){
    dots.forEach(element => {
        element[0].addEventListener('click',()=>{

            //remove others active
            dots.forEach(element=>{
                element[0].classList.remove("active");
                element[1].classList.remove("p-active");
            })
            //put new class
            element[0].className = element[0].className.replace(" active", "");
            element[1].className = element[1].className.replace(" p-active", "");
            element[0].className += " active";
            element[1].className+=" p-active";
            changeYear(element[2]);
        })
    });
}
changeDate();
dot1.className = dot1.className.replace(" active", "");
year2010.className = year2010.className.replace(" p-active", "");
dot1.className += " active";
year2010.className+=" p-active";
