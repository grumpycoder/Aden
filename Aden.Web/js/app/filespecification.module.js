﻿
(function () {
    var uri = "/api/filespecification";

    var $grid = $('#grid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: uri,
            updateUrl: uri,
        }),
        remoteOperations: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        showBorders: true,
        wordWrapEnabled: true,
        'export': {
            enabled: true,
            fileName: "FileSpecifications",
            allowExportSelectedData: false,
            icon: 'fa fa-trash'
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "gridFileSpecificationFilterStorage"
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
            { dataField: 'fileNumber', caption: 'File Number', dataType: 'string' },
            { dataField: 'fileName', caption: 'File Name', dataType: 'string' },
            {
                dataField: 'isRetired',
                caption: 'Retired',
                dataType: 'boolean',
                visible: true,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            { dataField: 'section', caption: 'Section', dataType: 'string' },
            { dataField: 'supportGroup', caption: 'Support Group', dataType: 'string' },
            { dataField: 'application', caption: 'Application', dataType: 'string' },
            { dataField: 'collection', caption: 'Collection', dataType: 'string' },
            { dataField: 'reportAction', caption: 'Report Action', dataType: 'string', visible: false },
            { dataField: 'generationGroup', caption: 'Generation Group', dataType: 'string', visible: false },
            { dataField: 'approvalGroup', caption: 'Approval Group', dataType: 'string', visible: false },
            { dataField: 'submissionGroup', caption: 'Submission Group', dataType: 'string', visible: false },
            {
                dataField: 'generators', caption: 'Generators', dataType: 'string',
                cellTemplate: function (container, options) {
                    options.data.generators.forEach(function (item) { $('<span>' + item + '</span><br />').appendTo(container) });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.generators.join(", ");
                }
            },
            {
                dataField: 'approvers', caption: 'Approvers', dataType: 'string',
                cellTemplate: function (container, options) {
                    options.data.approvers.forEach(function (item) { $('<span>' + item + '</span><br />').appendTo(container) });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.approvers.join(", ");
                }
            },
            {
                dataField: 'submitters', caption: 'Submitters', dataType: 'string',
                cellTemplate: function (container, options) {
                    options.data.submitters.forEach(function (item) { $('<span>' + item + '</span><br />').appendTo(container) });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.submitters.join(", ");
                }
            },
            {
                dataField: 'isSEA', caption: 'SEA',
                dataType: 'boolean',
                visible: false,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            {
                dataField: 'isLEA', caption: 'LEA', dataType: 'boolean',
                visible: false,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            {
                dataField: 'isSCH', caption: 'SCH',
                dataType: 'boolean',
                visible: false,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            {
                width: 120,
                alignment: 'center',
                cellTemplate: function (container, options) {

                    $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                        .text('Edit')
                        .attr('aria-label', 'Edit ' + options.data.fileName)
                        .on('dxclick',
                            function (e) {
                                editFileSpecification($(this), options.data);
                            })
                        .appendTo(container);

                    if (options.data.canRetire) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Retire')
                            .attr('aria-label', 'Retire ' + options.data.fileName)
                            .on('dxclick',
                                function (e) {
                                    retire($(this), options.data);
                                })
                            .appendTo(container);
                    }
                    if (options.data.canActivate) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Activate')
                            .attr('aria-label', 'Activate ' + options.data.fileName)
                            .on('dxclick',
                                function (e) {
                                    activate($(this), options.data);
                                })
                            .appendTo(container);
                    }

                }
            },
        ],
        sortByGroupSummaryInfo: [
            {
                summaryItem: "count"
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "id",
                    displayFormat: '{0} Total File Specifications',
                    summaryType: 'count',
                    showInGroupFooter: true,
                    showInColumn: 'FileNumber'
                }
            ],
            groupItems: [
                {
                    summaryType: "count",
                    displayFormat: '{0} File Specifications',
                }
            ]
        },
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
        },
        onContentReady: function () {
            gridContentReady(); 
        },
    }).dxDataGrid("instance");

    function gridContentReady() {
        $('#panel-message').hide();
        if ($grid.getCombinedFilter() !== undefined) {
            $('#panel-message').show();
        }
        $(".dx-datagrid-table").addClass("table");
        $('.dx-button').attr('data-toggle', 'tooltip'); 
        $('[data-toggle="tooltip"]').tooltip();
    }

    function activate(container, data) {
        var id = data.id;
        BootstrapDialog.confirm('Retire File Specification, are you sure?', function (result) {
            if (result) {
                window.$showModalWorking();
                $.ajax({
                    url: '/api/filespecification/activate/' + id,
                    type: 'POST',
                    success: function (data) {
                        $grid.refresh();
                        toastr.success('Activated file for ' + data.fileName + ' (' + data.fileNumber + ')');
                    },
                    error: function (err) {
                        toastr.error('Error activating file');
                    }
                }).always(function () {
                    window.$hideModalWorking();
                });
            }
        });
    }

    function retire(container, data) {
        var id = data.id;
        BootstrapDialog.confirm('Retire File Specification, are you sure?', function (result) {
            if (result) {
                window.$showModalWorking();
                $.ajax({
                    url: '/api/filespecification/retire/' + id,
                    type: 'POST',
                    success: function (data) {
                        toastr.warning('Retired file for ' + data.fileName + ' (' + data.fileNumber + ')');
                        $grid.refresh();
                    },
                    error: function (err) {
                        toastr.error('Error retiring file');
                    }
                }).always(function () {
                    window.$hideModalWorking();
                });
            }
        });


    }

    function editFileSpecification(container, data) {
        var title = 'Edit File Specification';
        var url = '/home/editfileSpecification/' + data.id;
        var postUrl = '/api/filespecification/' + data.id;

        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_WARNING,
            size: window.BootstrapDialog.SIZE_WIDE,
            draggable: true,
            title: title,
            message: $('<div></div>').load(url, function (resp, status, xhr) {
                if (status === 'error') {
                    toastr.error('Error showing history');
                }
            }),
            onshown: function (dialog) {
                var btn = dialog.getButton(dialog.getButtons()[1].id);
                $(document).on('change', '#form', function () {
                    $('#form').validate({
                        rules: {
                            fileNumber: { required: true },
                            fileName: { required: true }
                        },
                        messages: {
                            fileNumber: { required: 'File Number is required' },
                            fileName: { required: 'File Name is required' }
                        },
                        onfocusout: function (element) {
                            this.element(element);
                        }
                    });
                    var form = $('#form');

                    if (form.valid()) {
                        btn.enable();
                    } else {
                        btn.disable();
                    }
                });
            },
            buttons: [
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                        $grid.refresh();
                    }
                },
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    action: function (dialogRef) {

                        dialogRef.enableButtons(false);
                        dialogRef.setClosable(false);

                        $showModalWorking($('.panel-body'));

                        var data = $('form').serializeJSON();
                        $.ajax({
                            contentType: 'application/json; charset=utf-8',
                            type: "POST",
                            url: postUrl,
                            data: JSON.stringify(data),
                            dataType: 'json',
                            success: function (data) {
                                toastr.success('Saved changes for ' + data.fileName + ' (' + data.fileNumber + ')');
                                dialogRef.close();
                                $grid.refresh();
                            },
                            error: function (error) {
                                toastr.error('Error saving file changes');
                            },
                            complete: function (status) {

                            }
                        });
                    }
                }
            ]
        });

    }

   
})();