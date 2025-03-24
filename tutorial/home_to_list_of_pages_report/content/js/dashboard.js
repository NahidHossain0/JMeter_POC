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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9605263157894737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "cats_icon.gif"], "isController": false}, {"data": [1.0, 500, 1500, "separator.gif"], "isController": false}, {"data": [1.0, 500, 1500, "jpetstore.css"], "isController": false}, {"data": [1.0, 500, 1500, "cart.gif"], "isController": false}, {"data": [1.0, 500, 1500, "sm_fish.gif"], "isController": false}, {"data": [1.0, 500, 1500, "reptiles_icon.gif"], "isController": false}, {"data": [1.0, 500, 1500, "splash.gif"], "isController": false}, {"data": [0.5, 500, 1500, "Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "sm_dogs.gif"], "isController": false}, {"data": [1.0, 500, 1500, "sm_cats.gif"], "isController": false}, {"data": [0.5, 500, 1500, "Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "fish_icon.gif"], "isController": false}, {"data": [1.0, 500, 1500, "banner_fish.gif"], "isController": false}, {"data": [1.0, 500, 1500, "sm_birds.gif"], "isController": false}, {"data": [1.0, 500, 1500, "dogs_icon.gif"], "isController": false}, {"data": [1.0, 500, 1500, "sm_reptiles.gif"], "isController": false}, {"data": [1.0, 500, 1500, "logo-topbar.svg"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38, 0, 0.0, 187.3684210526316, 116, 859, 117.0, 295.0000000000009, 858.05, 859.0, 13.333333333333334, 54.578878837719294, 1.8876781798245614], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["cats_icon.gif", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 5.859375, 1.2019230769230769], "isController": false}, {"data": ["separator.gif", 3, 0, 0.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 24.0, 7.921875, 3.375], "isController": false}, {"data": ["jpetstore.css", 3, 0, 0.0, 117.66666666666667, 117, 118, 118.0, 118.0, 118.0, 118.0, 25.210084033613445, 154.31328781512605, 3.471310399159664], "isController": false}, {"data": ["cart.gif", 3, 0, 0.0, 117.33333333333333, 116, 119, 117.0, 119.0, 119.0, 119.0, 24.390243902439025, 46.5891768292683, 3.31078506097561], "isController": false}, {"data": ["sm_fish.gif", 3, 0, 0.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 24.0, 13.2421875, 3.328125], "isController": false}, {"data": ["reptiles_icon.gif", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 6.331104343220339, 1.2000132415254239], "isController": false}, {"data": ["splash.gif", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 152.54073900214593, 0.5909670064377682], "isController": false}, {"data": ["Catalog.action?viewCategory=&categoryId=FISH", 2, 0, 0.0, 858.5, 858, 859, 858.5, 859.0, 859.0, 859.0, 2.328288707799767, 10.925221915017463, 0.400174621653085], "isController": false}, {"data": ["sm_dogs.gif", 3, 0, 0.0, 116.33333333333333, 116, 117, 116.0, 117.0, 117.0, 117.0, 24.0, 14.0625, 3.328125], "isController": false}, {"data": ["sm_cats.gif", 3, 0, 0.0, 116.66666666666667, 116, 117, 117.0, 117.0, 117.0, 117.0, 23.809523809523807, 13.55561755952381, 3.3017113095238093], "isController": false}, {"data": ["Catalog.action", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 6.484466588511137, 0.1671490328253224], "isController": false}, {"data": ["fish_icon.gif", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 6.118122329059829, 1.2019230769230769], "isController": false}, {"data": ["banner_fish.gif", 3, 0, 0.0, 116.66666666666667, 116, 117, 117.0, 117.0, 117.0, 117.0, 3.1746031746031744, 20.91703869047619, 0.45262896825396826], "isController": false}, {"data": ["sm_birds.gif", 3, 0, 0.0, 116.66666666666667, 116, 117, 117.0, 117.0, 117.0, 117.0, 12.76595744680851, 6.794381648936171, 1.782746010638298], "isController": false}, {"data": ["dogs_icon.gif", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 6.360176282051282, 1.2019230769230769], "isController": false}, {"data": ["sm_reptiles.gif", 3, 0, 0.0, 116.33333333333333, 116, 117, 116.0, 117.0, 117.0, 117.0, 24.0, 16.21875, 3.421875], "isController": false}, {"data": ["logo-topbar.svg", 3, 0, 0.0, 231.0, 229, 232, 232.0, 232.0, 232.0, 232.0, 12.82051282051282, 207.70733173076923, 1.8279246794871793], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
