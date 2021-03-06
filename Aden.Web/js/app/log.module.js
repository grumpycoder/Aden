
var uriPerf = "/api/log/performance";
var uriError = "/api/log/error";

var $gridErrorLog = $('#gridErrorLog').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
        key: 'id',
        loadUrl: uriError
    }),
    remoteOperations: true,
    allowColumnResizing: true,
    allowColumnReordering: true,
    showBorders: true,
    wordWrapEnabled: false,
    'export': {
        enabled: true,
        fileName: "Log",
        allowExportSelectedData: false,
        icon: 'fa fa-trash'
    },
    stateStoring: {
        enabled: true,
        type: "localStorage",
        storageKey: "gridLogFilterStorage"
    },
    filterRow: { visible: true },
    headerFilter: { visible: true },
    groupPanel: { visible: true },
    scrolling: { mode: "virtual", rowRenderingMode: "virtual" },
    paging: { pageSize: 20 },
    height: 650,
    columnChooser: { enabled: true },
    columnResizingMode: "nextColumn",
    columnMinWidth: 50,
    columnAutoWidth: true,
    columns: [
        { dataField: 'hostname', caption: 'Host' },
        { dataField: 'layer', caption: 'Layer' },
        { dataField: 'location', caption: 'Location' },
        { dataField: 'userName', caption: 'User' },
        { dataField: 'message', caption: 'Message', width: 200, wordWrapEnabled: false },
        { dataField: 'elapsedMilliseconds', caption: 'Elapsed Milliseconds', visible: false },
        { dataField: 'correlationId', caption: 'Session' },
        { dataField: 'timestamp', caption: 'Time Stamp', dataType: 'datetime' }
    ],
    onToolbarPreparing: function (e) {
        var dataGrid = e.component;

        e.toolbarOptions.items.unshift(
            {
                location: "after",
                widget: "dxButton",
                options: {
                    text: "Collapse All",
                    width: 136,
                    onClick: function (e) {
                        var expanding = e.component.option("text") === "Expand All";
                        dataGrid.option("grouping.autoExpandAll", expanding);
                        e.component.option("text", expanding ? "Collapse All" : "Expand All");
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",
                options: {
                    text: "Toggle Wrap",
                    width: 160,
                    onClick: function (e) {
                        dataGrid.option("wordWrapEnabled", !dataGrid.option("wordWrapEnabled"));
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",

                options: {
                    icon: "refresh",
                    hint: 'Refresh',
                    onClick: function () {
                        dataGrid.refresh();
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "clearformat",
                    hint: 'Clear filters',
                    onClick: function () {
                        dataGrid.clearFilter();
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "clearsquare",
                    hint: 'Reset grid to default',
                    onClick: function () {
                        dataGrid.state({});
                    }
                }
            }

        );
    }
}).dxDataGrid("instance");


var $gridPerfLog = $('#gridPerfLog').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
        key: 'id',
        loadUrl: uriPerf
    }),
    remoteOperations: true,
    allowColumnResizing: true,
    allowColumnReordering: true,
    showBorders: true,
    wordWrapEnabled: false,
    'export': {
        enabled: true,
        fileName: "Log",
        allowExportSelectedData: false,
        icon: 'fa fa-trash'
    },
    stateStoring: {
        enabled: true,
        type: "localStorage",
        storageKey: "gridLogFilterStorage"
    },
    filterRow: { visible: true },
    headerFilter: { visible: true },
    groupPanel: { visible: true },
    scrolling: { mode: "virtual", rowRenderingMode: "virtual" },
    paging: { pageSize: 20 },
    height: 650,
    columnChooser: { enabled: true },
    columnResizingMode: "nextColumn",
    columnMinWidth: 50,
    columnAutoWidth: true,
    columns: [
        { dataField: 'hostname', caption: 'Host' },
        { dataField: 'layer', caption: 'Layer' },
        { dataField: 'location', caption: 'Location' },
        { dataField: 'userName', caption: 'User' },
        { dataField: 'message', caption: 'Message', width: 200, wordWrapEnabled: false },
        { dataField: 'elapsedMilliseconds', caption: 'Elapsed Milliseconds', visible: false },
        { dataField: 'correlationId', caption: 'Session' },
        { dataField: 'timestamp', caption: 'Time Stamp', dataType: 'datetime' }
    ],
    onToolbarPreparing: function (e) {
        var dataGrid = e.component;

        e.toolbarOptions.items.unshift(
            {
                location: "after",
                widget: "dxButton",
                options: {
                    text: "Collapse All",
                    width: 136,
                    onClick: function (e) {
                        var expanding = e.component.option("text") === "Expand All";
                        dataGrid.option("grouping.autoExpandAll", expanding);
                        e.component.option("text", expanding ? "Collapse All" : "Expand All");
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",
                options: {
                    text: "Toggle Wrap",
                    width: 160,
                    onClick: function (e) {
                        dataGrid.option("wordWrapEnabled", !dataGrid.option("wordWrapEnabled"));
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",

                options: {
                    icon: "refresh",
                    hint: 'Refresh',
                    onClick: function () {
                        dataGrid.refresh();
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "clearformat",
                    hint: 'Clear filters',
                    onClick: function () {
                        dataGrid.clearFilter();
                    }
                }
            },
            {
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "clearsquare",
                    hint: 'Reset grid to default',
                    onClick: function () {
                        dataGrid.state({});
                    }
                }
            }

        );
    }
}).dxDataGrid("instance");