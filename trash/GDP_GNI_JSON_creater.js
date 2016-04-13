var fs        = require('fs')
    readLine  = require('readline')
    stream    = require('stream')

var inStream  = fs.createReadStream('WDI_Data.csv');
var outStream1 = fs.createWriteStream('GDP_GNI.json');
var outStream2 = fs.createWriteStream('GDP_GNI_percap.json');
var outStream3 = fs.createWriteStream('GDP_india.json');
var outStream4 = fs.createWriteStream('GDP_aggregate.json');
var rl        = readLine.createInterface(inStream,outStream1);
var GDP_GNI_array =[];
rl.on('line',function(line){
  dataCells = line.split(',')
  if(dataCells[0]=="Country Name"){
    headers = dataCells;
  }

  /* Problem statement 1(top 15 countries by GDP, for the year 2005)*/
  else if(dataCells[2] == "GDP (constant 2005 US$)" ||
          dataCells[2] == "GNI (constant 2005 US$)" ||
          dataCells[2] == "GDP per capita (constant 2005 US$)" ||
          dataCells[2] == "GNI per capita (constant 2005 US$)" ||
          (dataCells[2] =="GDP growth (annual %)" && dataCells[0] == "India")){
                GDP_GNI ={};
                GDP_GNI[headers[0]]  = dataCells[0];
                GDP_GNI[headers[2]]  = dataCells[2];
                for(i=3;i<headers.length-1;i++)
                GDP_GNI[headers[i]] = isNaN(parseFloat(dataCells[i]))?0:parseFloat(dataCells[i]);
                GDP_GNI_array.push(GDP_GNI);
  }
});

rl.on('close',function(line){

  /* top 15 countries by GDP and GDPpercap setting up required arrays*/
  for(var i=0;i<GDP_GNI_array.length-1;i++){
    if (continents[GDP_GNI_array[i][headers[0]]]) {
      switch(GDP_GNI_array[i][headers[2]]){
        case 'GDP (constant 2005 US$)':GDP[GDP_GNI_array[i][headers[0]]]=GDP_GNI_array[i]["2005"];
        case 'GNI (constant 2005 US$)':GNI[GDP_GNI_array[i][headers[0]]]=GDP_GNI_array[i]["2005"];
        case 'GDP per capita (constant 2005 US$)':GDPpercap[GDP_GNI_array[i][headers[0]]]=GDP_GNI_array[i]["2005"];
        case 'GNI per capita (constant 2005 US$)':GNIpercap[GDP_GNI_array[i][headers[0]]]=GDP_GNI_array[i]["2005"];
      }
    }
  }

  /* top 15 countries by GDP */
  var top15GDPArray=[];
  for (i in GDP){
      var top15GDP={};
      top15GDP[headers[0]]=i;
      top15GDP["GDP"]=GDP[i];
      top15GDP["GNI"]=GNI[i];
      top15GDPArray.push(top15GDP);
  }
  top15GDPArray.sort(function(a,b){
    return parseFloat(b.GDP) - parseFloat(a.GDP);
  });
  top15GDPArray = top15GDPArray.slice(0,15);
  outStream1.write(JSON.stringify(top15GDPArray));

  /* top 15 countries by GDPpercap */
  var top15GDPpercapArray=[];
  for (i in GDPpercap){
      var top15GDPpercap={};
      top15GDPpercap[headers[0]]=i;
      top15GDPpercap["GDPpercap"]=GDPpercap[i];
      top15GDPpercap["GNIpercap"]=GNIpercap[i];
      top15GDPpercapArray.push(top15GDPpercap);
  }
  top15GDPpercapArray.sort(function(a,b){
    return parseFloat(b.GDP) - parseFloat(a.GDP);
  });
  top15GDPpercapArray = top15GDPpercapArray.slice(0,15);
  outStream2.write(JSON.stringify(top15GDPpercapArray));

  /* GDP growth for India over the given time period */
  for (var i=0;i<GDP_GNI_array.length-1;i++)
  {
    if(GDP_GNI_array[i][headers[0]]=="India"){
      var GDPindia = GDP_GNI_array[i];
      break;
    }
  }
  outStream3.write(JSON.stringify(GDPindia));

  /* GDP per capita (constant 2005 US$)" by continent, over the time period 1960-2015 */
  var aggregatedGDPArray=[];
  var aggregatedGDP={};
  for(var i=0;i<GDP_GNI_array.length-1;i++)
  if(GDP_GNI_array[i][headers[2]] == "GDP per capita (constant 2005 US$)")
  for(var j=1960;j<2016;j++)
  if(aggregate[continents[GDP_GNI_array[i]["Country Name"]]]){
    if(aggregate[continents[GDP_GNI_array[i]["Country Name"]]][j+""]==undefined){
      aggregate[continents[GDP_GNI_array[i]["Country Name"]]][j+""]=0;
    }
    aggregate[continents[GDP_GNI_array[i]["Country Name"]]][j+""] += GDP_GNI_array[i][j+""];
  }

    for(var j=1960;j<2016;j++){
      aggregatedGDP={};
      aggregatedGDP["year"]=j;
      for(i in aggregate){
        aggregatedGDP[i]=aggregate[i][j];
      }
      aggregatedGDPArray.push(aggregatedGDP);
    }
    outStream4.write(JSON.stringify(aggregatedGDPArray));
});


var GDP={}, GNI={}, GDPpercap={}, GNIpercap={}, GDPgrowth={};

var aggregate = {
  'AFRICA':{},
  'ASIA':{},
  'AUSTRALIA':{},
  'EUROPE':{},
  'S_AMERICA':{},
  'N_AMERICA':{}
};

var continents = {
  /* AFRICA */
  'Algeria' : 'AFRICA',
  'Angola' : 'AFRICA',
  'Benin' : 'AFRICA',
  'Botswana' : 'AFRICA',
  'Burkina' : 'AFRICA',
  'Burundi' : 'AFRICA',
  'Cameroon' : 'AFRICA',
  'Cape Verde' : 'AFRICA',
  'Central African Republic' : 'AFRICA',
  'Chad' : 'AFRICA',
  'Comoros' : 'AFRICA',
  'Congo' : 'AFRICA',
  'Democratic Republic of' : 'AFRICA',
  'Djibouti' : 'AFRICA',
  'Egypt' : 'AFRICA',
  'Equatorial Guinea' : 'AFRICA',
  'Eritrea' : 'AFRICA',
  'Ethiopia' : 'AFRICA',
  'Gabon' : 'AFRICA',
  'Gambia' : 'AFRICA',
  'Ghana' : 'AFRICA',
  'Guinea' : 'AFRICA',
  'Guinea-Bissau' : 'AFRICA',
  'Ivory Coast' : 'AFRICA',
  'Kenya' : 'AFRICA',
  'Lesotho' : 'AFRICA',
  'Liberia' : 'AFRICA',
  'Libya' : 'AFRICA',
  'Madagascar' : 'AFRICA',
  'Malawi' : 'AFRICA',
  'Mali' : 'AFRICA',
  'Mauritania' : 'AFRICA',
  'Mauritius' : 'AFRICA',
  'Morocco' : 'AFRICA',
  'Mozambique' : 'AFRICA',
  'Namibia' : 'AFRICA',
  'Niger' : 'AFRICA',
  'Nigeria' : 'AFRICA',
  'Rwanda' : 'AFRICA',
  'Sao Tome and Principe' : 'AFRICA',
  'Senegal' : 'AFRICA',
  'Seychelles' : 'AFRICA',
  'Sierra Leone' : 'AFRICA',
  'Somalia' : 'AFRICA',
  'South Africa' : 'AFRICA',
  'South Sudan' : 'AFRICA',
  'Sudan' : 'AFRICA',
  'Swaziland' : 'AFRICA',
  'Tanzania' : 'AFRICA',
  'Togo' : 'AFRICA',
  'Tunisia' : 'AFRICA',
  'Uganda' : 'AFRICA',
  'Zambia' : 'AFRICA',
  'Zimbabwe' : 'AFRICA',

  /* ASIA */
  'Afghanistan' : 'ASIA',
  'Arab World' : 'ASIA',
  'Bahrain' : 'ASIA',
  'Bangladesh' : 'ASIA',
  'Bhutan' : 'ASIA',
  'Brunei' : 'ASIA',
  'Burma (Myanmar)' : 'ASIA',
  'Cambodia' : 'ASIA',
  'China' : 'ASIA',
  'East Timor' : 'ASIA',
  'India' : 'ASIA',
  'Indonesia' : 'ASIA',
  'Iran' : 'ASIA',
  'Iraq' : 'ASIA',
  'Israel' : 'ASIA',
  'Japan' : 'ASIA',
  'Jordan' : 'ASIA',
  'Kazakhstan' : 'ASIA',
  'North Korea' : 'ASIA',
  'South Korea' : 'ASIA',
  'Kuwait' : 'ASIA',
  'Kyrgyzstan' : 'ASIA',
  'Laos' : 'ASIA',
  'Lebanon' : 'ASIA',
  'Malaysia' : 'ASIA',
  'Maldives' : 'ASIA',
  'Mongolia' : 'ASIA',
  'Nepal' : 'ASIA',
  'Oman' : 'ASIA',
  'Pakistan' : 'ASIA',
  'Philippines' : 'ASIA',
  'Qatar' : 'ASIA',
  'Russian Federation' : 'ASIA',
  'Saudi Arabia' : 'ASIA',
  'Singapore' : 'ASIA',
  'Sri Lanka' : 'ASIA',
  'Syria' : 'ASIA',
  'Tajikistan' : 'ASIA',
  'Thailand' : 'ASIA',
  'Turkey' : 'ASIA',
  'Turkmenistan' : 'ASIA',
  'United Arab Emirates' : 'ASIA',
  'Uzbekistan' : 'ASIA',
  'Vietnam' : 'ASIA',
  'Yemen' : 'ASIA',

  /* EUROPE */
  'Albania' : 'EUROPE',
  'Andorra' : 'EUROPE',
  'Armenia' : 'EUROPE',
  'Austria' : 'EUROPE',
  'Azerbaijan' : 'EUROPE',
  'Belarus' : 'EUROPE',
  'Belgium' : 'EUROPE',
  'Bosnia and Herzegovina' : 'EUROPE',
  'Bulgaria' : 'EUROPE',
  'Croatia' : 'EUROPE',
  'Cyprus' : 'EUROPE',
  'Czech Republic' : 'EUROPE',
  'Denmark' : 'EUROPE',
  'Estonia' : 'EUROPE',
  'Finland' : 'EUROPE',
  'France' : 'EUROPE',
  'Georgia' : 'EUROPE',
  'Germany' : 'EUROPE',
  'Greece' : 'EUROPE',
  'Hungary' : 'EUROPE',
  'Iceland' : 'EUROPE',
  'Ireland' : 'EUROPE',
  'Italy' : 'EUROPE',
  'Latvia' : 'EUROPE',
  'Liechtenstein' : 'EUROPE',
  'Lithuania' : 'EUROPE',
  'Luxembourg' : 'EUROPE',
  'Macedonia' : 'EUROPE',
  'Malta' : 'EUROPE',
  'Moldova' : 'EUROPE',
  'Monaco' : 'EUROPE',
  'Montenegro' : 'EUROPE',
  'Netherlands' : 'EUROPE',
  'Norway' : 'EUROPE',
  'Poland' : 'EUROPE',
  'Portugal' : 'EUROPE',
  'Romania' : 'EUROPE',
  'San Marino' : 'EUROPE',
  'Serbia' : 'EUROPE',
  'Slovakia' : 'EUROPE',
  'Slovenia' : 'EUROPE',
  'Spain' : 'EUROPE',
  'Sweden' : 'EUROPE',
  'Switzerland' : 'EUROPE',
  'Ukraine' : 'EUROPE',
  'United Kingdom' : 'EUROPE',
  'Vatican City' : 'EUROPE',

  /* N_AMERICA */
  'Caribbean small states' : 'N_AMERICA',
  'Latin America & Caribbean (all income levels)' : 'N_AMERICA',
  'Latin America & Caribbean (developing only)' : 'N_AMERICA',
  'Antigua and Barbuda' : 'N_AMERICA',
  'Bahamas' : 'N_AMERICA',
  'Barbados' : 'N_AMERICA',
  'Belize' : 'N_AMERICA',
  'Canada' : 'N_AMERICA',
  'Costa Rica' : 'N_AMERICA',
  'Cuba' : 'N_AMERICA',
  'Dominica' : 'N_AMERICA',
  'Dominican Republic' : 'N_AMERICA',
  'El Salvador' : 'N_AMERICA',
  'Grenada' : 'N_AMERICA',
  'Guatemala' : 'N_AMERICA',
  'Haiti' : 'N_AMERICA',
  'Honduras' : 'N_AMERICA',
  'Jamaica' : 'N_AMERICA',
  'Mexico' : 'N_AMERICA',
  'Nicaragua' : 'N_AMERICA',
  'Panama' : 'N_AMERICA',
  'Saint Kitts and Nevis' : 'N_AMERICA',
  'Saint Lucia' : 'N_AMERICA',
  'Saint Vincent and the Grenadines' : 'N_AMERICA',
  'Trinidad and Tobago' : 'N_AMERICA',
  'United States' : 'N_AMERICA',

  /* AUSTRALIA */
  'Australia' : 'AUSTRALIA',
  'Fiji' : 'AUSTRALIA',
  'Kiribati' : 'AUSTRALIA',
  'Marshall Islands' : 'AUSTRALIA',
  'Micronesia' : 'AUSTRALIA',
  'Nauru' : 'AUSTRALIA',
  'New Zealand' : 'AUSTRALIA',
  'Palau' : 'AUSTRALIA',
  'Papua New Guinea' : 'AUSTRALIA',
  'Samoa' : 'AUSTRALIA',
  'Solomon Islands' : 'AUSTRALIA',
  'Tonga' : 'AUSTRALIA',
  'Tuvalu' : 'AUSTRALIA',
  'Vanuatu' : 'AUSTRALIA',

  /* S_AMERICA */
  'Argentina' : 'S_AMERICA',
  'Bolivia' : 'S_AMERICA',
  'Brazil' : 'S_AMERICA',
  'Chile' : 'S_AMERICA',
  'Colombia' : 'S_AMERICA',
  'Ecuador' : 'S_AMERICA',
  'Guyana' : 'S_AMERICA',
  'Paraguay' : 'S_AMERICA',
  'Peru' : 'S_AMERICA',
  'Suriname' : 'S_AMERICA',
  'Uruguay' : 'S_AMERICA',
  'Venezuela' : 'S_AMERICA'
};





//console.log(GDP);
/*for(var i=0;i<GDP_GNI_array.length-1;i++){
  if(GDP_GNI_array[i]["Indicator Name"] =="GDP (constant 2005 US$)")
  {
    if(top15GDP[GDP_GNI_array[i]["Country Name"]]["GDP (constant 2005 US$)"]==undefined){
      top15GDP[GDP_GNI_array[i]["Country Name"]]={"GDP (constant 2005 US$)":0};
    }
    top15GDP[GDP_GNI_array[i]["Country Name"]]["GDP (constant 2005 US$)"]
    += GDP_GNI_array[i]["2005"];
  }
  if(GDP_GNI_array[i]["Indicator Name"] == "GNI (constant 2005 US$)")
  {
    if(top15GDP[GDP_GNI_array[i]["Country Name"]]==undefined){
      top15GDP[GDP_GNI_array[i]["Country Name"]]={"GNI (constant 2005 US$)":0};
    }
    top15GDP[GDP_GNI_array[i]["Country Name"]]["GNI (constant 2005 US$)"]
    += GDP_GNI_array[i]["2005"];
  }
}*/
//console.log(top15GDP);
