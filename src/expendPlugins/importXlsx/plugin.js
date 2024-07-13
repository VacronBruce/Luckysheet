
import locale from '../../locale/locale';
import { modelHTML } from "../../controllers/constant";
import { arrayRemoveItem, replaceHtml } from '../../utils/util';
import Store from '../../store';
import {transformExcelToLucky, transformExcelToLuckyByUrl} from 'luckyexcel';

// Initialize the export xlsx api
function importXlsx(options, config, isDemo) {
    arrayRemoveItem(Store.asyncLoad,'importXlsx')
}

function importXlsxUrl(url, name) {
    luckysheet.showLoadingProgress();
    transformExcelToLuckyByUrl(url, name, function(exportJson, luckysheetfile){							
        if(exportJson.sheets==null || exportJson.sheets.length==0){
                alert("Failed to read the content of the excel file, currently does not support xls files!");
                return;
        }
        console.warn(exportJson, luckysheetfile);
        luckysheet.destroy();
        luckysheet.create({
                container: 'luckysheet',
                showinfobar:false,
                data:exportJson.sheets,
                title:exportJson.info.name,
                plugins:[
                    { name: 'chart' }, 
                    { name: 'exportXlsx', config: { url: 'http://localhost:3002/luckyToXlsx' } }, 
                    { name: 'print', config: {license: ''} },
                    { name: 'importXlsx'}
                ]
        });
        luckysheet.hideLoadingProgress();
    });
}
function importXlsxFile(file) {
    luckysheet.showLoadingProgress();
    transformExcelToLucky(file, function(exportJson, luckysheetfile){							
        if(exportJson.sheets==null || exportJson.sheets.length==0){
                alert("Failed to read the content of the excel file, currently does not support xls files!");
                return;
        }
        console.warn(exportJson, luckysheetfile);
        luckysheet.destroy();
        luckysheet.create({
                container: 'luckysheet',
                showinfobar:false,
                data:exportJson.sheets,
                title:exportJson.info.name,
                plugins:[
                    { name: 'chart' }, 
                    { name: 'exportXlsx', config: { url: 'http://localhost:3002/luckyToXlsx' } }, 
                    { name: 'print', config: {license: ''} },
                    { name: 'importXlsx'}
                ]
        });
        luckysheet.hideLoadingProgress();
    });
}

function createImportDialog() {
    $("#luckysheet-modal-dialog-mask").hide();
    var xlsxContainer = $("#luckysheet-import-xlsx");
    if (xlsxContainer.length === 0) {
        console.warn(`Empty import xlsx dialog, create`);
        const _locale = locale();
        const locale_importXlsx = _locale.importXlsx;
        const locale_button = _locale.button;

        let content = `
        <div class="luckysheet-import-xlsx-content" style="padding: 10px 10px 10px 0;">
            <input class="luckysheet-import-xlsx-input" style="font-size:16px;" type="file" id="Luckyexcel-demo-file" name="Luckyexcel-demo-file"/>
            <select class="luckysheet-import-xlsx-select" style="height: 27px;top: -2px;position: relative;" id="Luckyexcel-select-demo">
                <option value="">select a demo</option> 
                <option value="https://minio.cnbabylon.com/public/luckysheet/money-manager-2.xlsx">Money Manager.xlsx</option> 
                <option value="https://minio.cnbabylon.com/public/luckysheet/Activity%20costs%20tracker.xlsx">Activity costs tracker.xlsx</option>
                <option value="https://minio.cnbabylon.com/public/luckysheet/House%20cleaning%20checklist.xlsx">House cleaning checklist.xlsx</option>
                <option value="https://minio.cnbabylon.com/public/luckysheet/Student%20assignment%20planner.xlsx">Student assignment planner.xlsx</option>
                <option value="https://minio.cnbabylon.com/public/luckysheet/Credit%20card%20tracker.xlsx">Credit card tracker.xlsx</option>
                <option value="https://minio.cnbabylon.com/public/luckysheet/Blue%20timesheet.xlsx">Blue timesheet.xlsx</option>
                <option value="https://minio.cnbabylon.com/public/luckysheet/Student%20calendar%20%28Mon%29.xlsx">Student calendar (Mon).xlsx</option>
                <option value="https://minio.cnbabylon.com/public/luckysheet/Blue%20mileage%20and%20expense%20report.xlsx">Blue mileage and expense report.xlsx</option> 
	        </select>
        </div>`;

        $("body").append(
            replaceHtml(modelHTML, {
                id: "luckysheet-import-xlsx",
                addclass: "luckysheet-import-xlsx",
                title: locale_importXlsx.title,
                content: content,
                botton: `<button class="btn btn-default luckysheet-model-close-btn">${locale_button.close}</button>`,
                style: "z-index:991",
                close: locale_button.close,
            }),
        );


        // init event
        $("#luckysheet-import-xlsx").find(".luckysheet-modal-dialog-content").find('.luckysheet-import-xlsx-select').change((evt) => {
            console.warn(`We did got select change evt ${evt.target.value}`);
            if (evt.target.value.includes('xlsx')) {
                importXlsxUrl(evt.target.value);
            } 
            $("#luckysheet-import-xlsx").hide();
        })

        $("#luckysheet-import-xlsx").find(".luckysheet-modal-dialog-content").find('.luckysheet-import-xlsx-input').change((evt) => {
            console.warn(`We did got select change evt ${evt.target.value}`);
            if (evt.target.value.includes('xlsx')) {
                var files = evt.target.files;
                if(files==null || files.length==0){
                    alert("No files wait for import");
                    return;
                }

                let name = files[0].name;
                let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
                if(suffix!="xlsx"){
                    alert("Currently only supports the import of xlsx files");
                    return;
                }

                console.warn(`${evt.target.value}`);
                importXlsxFile(files[0]);
            } 
            $("#luckysheet-import-xlsx").hide();
        })
    } else {
        console.warn(`Already have importXlsx dialog`);
    }

    // Css
    let $t = $("#luckysheet-import-xlsx").find(".luckysheet-modal-dialog-content").css("min-width", 350).end(),
        myh = $t.outerHeight(),
        myw = $t.outerWidth();
    let winw = $(window).width(),
        winh = $(window).height();
    let scrollLeft = $(document).scrollLeft(),
        scrollTop = $(document).scrollTop();
    $("#luckysheet-import-xlsx")
        .css({ left: (winw + scrollLeft - myw) / 2, top: (winh + scrollTop - myh) / 3 })
        .show();
}

export {  importXlsx, importXlsxUrl, importXlsxFile, createImportDialog}
