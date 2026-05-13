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

    var data = {"OkPercent": 97.55509710182301, "KoPercent": 2.444902898176985};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8401802332055422, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9442958646016286, 500, 1500, "03 - Escolher voo"], "isController": false}, {"data": [0.9462740384615385, 500, 1500, "04 - Confirmar compra"], "isController": false}, {"data": [0.946195738591191, 500, 1500, "02 - Buscar voos"], "isController": false}, {"data": [0.4242412266835283, 500, 1500, "TC - Compra de passagem com sucesso"], "isController": true}, {"data": [0.9431971172883503, 500, 1500, "01 - Acessar home"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100822, 2465, 2.444902898176985, 982.9783380611442, 0, 85496, 271.0, 636.0, 21026.95, 21051.0, 165.22589875239058, 983.8544447058539, 50.19821270691749], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 - Escolher voo", 25052, 577, 2.303209324604822, 928.4402842088465, 156, 21069, 276.0, 440.0, 998.6000000000058, 21042.0, 41.15838882289834, 266.3937975137101, 13.431299780423972], "isController": false}, {"data": ["04 - Confirmar compra", 24960, 557, 2.2315705128205128, 905.6226762820517, 143, 21069, 276.0, 437.0, 880.6500000000051, 21042.0, 40.99424175434332, 228.70013328312388, 18.474867622761003], "isController": false}, {"data": ["02 - Buscar voos", 25156, 587, 2.333439338527588, 925.8480283033869, 150, 21070, 276.0, 433.0, 986.9500000000007, 21043.0, 41.281573281520764, 293.20709576271463, 11.616551449761724], "isController": false}, {"data": ["TC - Compra de passagem com sucesso", 25304, 1464, 5.785646538096744, 3723.336784698083, 0, 85496, 1162.0, 4312.800000000003, 23050.95, 60470.67000000006, 41.45342551030438, 976.6225748639257, 49.91738526342519], "isController": true}, {"data": ["01 - Acessar home", 25254, 633, 2.5065336184366833, 960.2476439375926, 149, 21066, 268.0, 434.0, 1421.800000000003, 21043.0, 41.40692378069775, 190.33041212680234, 6.5055703986568245], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 0.04056795131845842, 9.918470175160183E-4], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 111, 4.503042596348885, 0.11009501894427803], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 2344, 95.09127789046653, 2.324889409057547], "isController": false}, {"data": ["429/Too Many Requests", 9, 0.36511156186612576, 0.008926623157644165], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100822, 2465, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 2344, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 111, "429/Too Many Requests", 9, "502/Bad Gateway", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03 - Escolher voo", 25052, 577, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 574, "429/Too Many Requests", 2, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["04 - Confirmar compra", 24960, 557, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 556, "429/Too Many Requests", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["02 - Buscar voos", 25156, 587, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 584, "429/Too Many Requests", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["TC - Compra de passagem com sucesso", 400, 111, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 111, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01 - Acessar home", 25254, 633, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/142.251.132.243] failed: Connection timed out: connect", 630, "429/Too Many Requests", 3, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
