var DataFrame = dfjs.DataFrame;

function main(df){
    var grouped = df.groupBy('date').aggregate(group => group.stat.mean('male_duration', 'female_duration')).rename('aggregation', 'groupMean');
    console.log(grouped);
}

//var df = DataFrame.fromCSV('data/global.csv').then(df => main(df)