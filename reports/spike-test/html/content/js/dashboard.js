/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.52380221130221, "KoPercent": 2.476197788697789};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8078382476313622, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9209947098119473, 500, 1500, "03 - Escolher voo"], "isController": false}, {"data": [0.9189173480063548, 500, 1500, "04 - Confirmar compra"], "isController": false}, {"data": [0.9181286549707602, 500, 1500, "02 - Buscar voos"], "isController": false}, {"data": [0.36730438109814423, 500, 1500, "TC - Compra de passagem com sucesso"], "isController": true}, {"data": [0.9170370938074801, 500, 1500, "01 - Acessar home"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 104192, 2580, 2.476197788697789, 1038.6024646805827, 0, 85359, 353.0, 4568.100000000028, 21031.0, 21053.0, 170.42324476750653, 1014.8174796809471, 51.77706830650979], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 - Escolher voo", 25897, 606, 2.34003938680156, 959.123257520178, 213, 24894, 296.0, 612.0, 2591.30000000001, 21043.0, 42.42155198962107, 274.5309362038633, 13.837142671687952], "isController": false}, {"data": ["04 - Confirmar compra", 25807, 581, 2.251327159297865, 943.5073429689618, 218, 23277, 295.0, 614.0, 2618.850000000002, 21044.0, 42.48863161152875, 237.01258664691812, 19.14672568185635], "isController": false}, {"data": ["02 - Buscar voos", 25992, 609, 2.3430286241920593, 977.8068636503484, 144, 24319, 298.0, 620.0, 3107.8000000000175, 21044.0, 42.756751065957786, 303.67807130371324, 12.0304350841169], "isController": false}, {"data": ["TC - Compra de passagem com sucesso", 26135, 1474, 5.639946431987756, 3906.914138128951, 0, 85359, 1297.0, 8412.800000000003, 23995.200000000084, 63530.93000000001, 42.73182854947229, 1007.3419351669991, 51.48451615012957], "isController": true}, {"data": ["01 - Acessar home", 26096, 665, 2.5482832618025753, 1025.7538320049086, 212, 21065, 290.0, 655.9000000000015, 3640.4000000000233, 21043.99, 42.93637696348861, 197.33650247600707, 6.742952588547228], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 115, 4.457364341085271, 0.11037315724815724], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 2450, 94.96124031007751, 2.3514281326781328], "isController": false}, {"data": ["429", 4, 0.15503875968992248, 0.003839066339066339], "isController": false}, {"data": ["429/Too Many Requests", 11, 0.4263565891472868, 0.010557432432432432], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 104192, 2580, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 2450, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 115, "429/Too Many Requests", 11, "429", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03 - Escolher voo", 25897, 606, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 605, "429/Too Many Requests", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["04 - Confirmar compra", 25807, 581, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 577, "429/Too Many Requests", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["02 - Buscar voos", 25992, 609, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 606, "429/Too Many Requests", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["TC - Compra de passagem com sucesso", 400, 119, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 115, "429", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["01 - Acessar home", 26096, 665, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 662, "429/Too Many Requests", 3, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
