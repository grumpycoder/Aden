﻿$(function () {
    console.log('submission view ready');

    window.assignmentUpdated = false;

    var uri = "/api/submission";

    var $grid = $('#grid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: uri,
            updateUrl: uri
        }),
        remoteOperations: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        showBorders: true,
        wordWrapEnabled: true,
        'export': {
            enabled: true,
            fileName: "Submissions",
            allowExportSelectedData: false,
            icon: 'fa fa-trash'
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "gridSubmissionFilterStorage"
        },
        filterRow: { visible: true },
        headerFilter: { visible: true },
        groupPanel: { visible: true },
        scrolling: { mode: "virtual", rowRenderingMode: "virtual" },
        paging: { pageSize: 20 },
        height: 650,
        columnResizingMode: "nextColumn",
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: { enabled: true },
        columns: [
            {
                alignment: 'center',
                width: 100, 
                cellTemplate: function(container, options) {
                    $('<a/>').addClass('btn btn-default btn-sm btn-sm-grid')
                        .text('Audit')
                        .attr('aria-label', 'submission audit ' + options.data.fileName)
                        .on('dxclick',
                            function (e) {
                                console.log(options);
                                showHistory(options);
                            })
                        .appendTo(container);
                }
            },
            { dataField: 'fileNumber', caption: 'File Number' },
            { dataField: 'fileName', caption: 'File Name' },
            { dataField: 'submissionStateDisplay', caption: 'Status' },
            { dataField: 'currentAssignment', caption: 'Assigned' },
            { dataField: 'lastUpdatedFriendly', caption: 'Last Update' },
            { dataField: 'deadlineDate', caption: 'Submission Deadline', dataType: 'date' },
            { dataField: 'submissionDate', caption: 'Date Submitted', dataType: 'date' },
            { dataField: 'displayDataYear', caption: 'Data Year' },
            { dataField: 'section', caption: 'Section', visible: false },
            { dataField: 'application', caption: 'Application', visible: false },
            { dataField: 'supportGroup', caption: 'Support Group', visible: false },
            { dataField: 'collection', caption: 'Collection', visible: false },
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
                dataField: 'generators', caption: 'Generators', dataType: 'string', visible: false, 
                cellTemplate: function (container, options) {
                    options.data.generators.forEach(function (item) { $('<span>' + item + '</span><br />').appendTo(container) });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.generators.join(", ");
                }
            },
            {
                dataField: 'approvers', caption: 'Approvers', dataType: 'string', visible: false, 
                cellTemplate: function (container, options) {
                    options.data.approvers.forEach(function (item) { $('<span>' + item + '</span><br />').appendTo(container) });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.approvers.join(", ");
                }
            },
            {
                dataField: 'submitters', caption: 'Submitters', dataType: 'string', visible: false, 
                cellTemplate: function (container, options) {
                    options.data.submitters.forEach(function (item) { $('<span>' + item + '</span><br />').appendTo(container) });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.submitters.join(", ");
                }
            }, 
            {
                width: 200,
                alignment: 'center',
                cellTemplate: function (container, options) {
                    if (options.data.canStart) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Start')
                            .attr('aria-label', 'Start submission ' + options.data.fileName)
                            .on('dxclick',
                                function (e) {
                                    startWorkFlow($(this), options.data);
                                })
                            .appendTo(container);
                    }

                    if (options.data.canCancel) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Cancel')
                            .attr('aria-label', 'Cancel submission ' + options.data.fileName)
                            .on('dxclick',
                                function () {
                                    cancelWorkFlow($(this), options.data);
                                })
                            .appendTo(container);
                    }

                    if (options.data.canReview) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Review File')
                            .attr('aria-label', 'Review submission report file')
                            .attr('href', '/review/' + options.data.dataYear + '/' + options.data.fileNumber)
                            .attr('target', '_blank')
                            .appendTo(container);
                    }

                    if (options.data.canReopen) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Reopen')
                            .attr('aria-label', 'Repopen submission ' + options.data.fileName)
                            .on('dxclick',
                                function (e) {
                                    reopenSubmission($(this), options.data);
                                })
                            .appendTo(container);
                    }

                    if (options.data.canWaiver) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Waiver')
                            .attr('aria-label', 'Waive submission ' + options.data.fileName)
                            .on('dxclick',
                                function (e) {
                                    waiverWorkFlow($(this), options.data);
                                })
                            .appendTo(container);
                    }

                }
            }
        ],
        sortByGroupSummaryInfo: [{ summaryItem: "count" }],
        summary: {
            totalItems: [
                {
                    column: "fileNumber",
                    displayFormat: '{0} Submissions',
                    summaryType: 'count',
                    showInGroupFooter: true,
                    showInColumn: 'FileNumber'
                }
            ],
            groupItems: [
                {
                    summaryType: "count",
                    displayFormat: '{0} Submissions'
                }

            ]
        },
        onRowPrepared: function (row) {
            if (row.rowType === 'data') {
                addRowClass(row.rowElement, row.data);
            }
        },
        onContentReady: function () {
            gridContentReady(); 
            $(".dx-datagrid-table").addClass("table");
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
        }
    }).dxDataGrid("instance");

    function gridContentReady() {
        $('#panel-message').hide();
        if ($grid.getCombinedFilter() !== undefined) {
            $('#panel-message').show();
        }
    }

    function showHistory(e) {
        var title = 'Submission History - [' + e.row.data.fileName + ']';
        var url = '/history/' + e.row.data.id;

        BootstrapDialog.show({
            size: window.BootstrapDialog.SIZE_WIDE,
            draggable: true,
            closable: false,
            title: title,
            message: $('<div></div>').load(url, function (resp, status, xhr) {
                if (status === 'error') {
                    toastr.error('Error retrieving history');
                }
            }),
            buttons: [
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        if (window.assignmentUpdated === true) {
                            $grid.refresh();
                            window.assignmentUpdated = false;
                        }
                        dialogRef.close();
                    }
                }
            ]
        });

    }

    function startWorkFlow(container, data) {
        var id = data.id;
        $toggleWorkingButton(container);
        $.ajax({
            url: '/api/submission/start/' + id,
            type: 'POST',
            success: function (data) {
                toastr.success('Started submission process for ' + data.fileName + ' (' + data.fileNumber + ')');
                $grid.refresh();
            },
            error: function (error) {
                toastr.error('Error starting submission process: ' + error.responseJSON.message);
            },
            complete: function (status) {

                $toggleWorkingButton(container);
            }
        });


    }

    function cancelWorkFlow(container, data) {
        var id = data.id;

        BootstrapDialog.confirm('Cancel Submission, are you sure?', function (result) {
            if (result) {
                window.$showModalWorking();
                $.ajax({
                    url: '/api/submission/cancel/' + id,
                    type: 'POST',
                    success: function (response) {
                        toastr.warning('Cancelled submission process for ' + response.fileName + ' (' + response.fileNumber + ')');
                        $grid.refresh();
                    },
                    error: function (error) {
                        toastr.error('Error cancelling submission process');
                    },
                    complete: function (status) {
                        window.$hideModalWorking();
                    }
                });
            }
        });
    }

    function reopenSubmission(container, data) {

        var url = '/home/reopen/' + data.id;
        var title = 'Reopen Reason';
        var postUrl = '/api/submission/reopen/' + data.id;


        BootstrapDialog.show({
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
                btn.disable();
                $(document).on('change', '#form', function () {
                    $('#form').validate({
                        rules: {
                            message: { required: true },
                            nextSubmissionDate: { required: true }
                        },
                        messages: {
                            message: { required: 'Description is required' },
                            nextSubmissionDate: { required: 'New Submission Date is required' }
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
                            contentType: 'application/json;',
                            type: "POST",
                            url: postUrl,
                            data: JSON.stringify(data),
                            dataType: 'json',
                            success: function (response) {
                                toastr.success('Reopened submission process for ' + response.fileName + ' (' + response.fileNumber + ')');
                                $grid.refresh();
                            },
                            error: function (error) {
                                toastr.error('Error starting submission process: ' + error.responseJSON.message);
                            },
                            complete: function (status) {
                                dialogRef.close();
                            }
                        });
                    }
                }
            ]
        });

    }

    function waiverWorkFlow(container, data) {
        var title = 'Waiver Reason';
        var url = '/home/waiver/' + data.id;
        var postUrl = '/api/submission/waive/' + data.id;
        BootstrapDialog.show({
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
                btn.disable();
                $(document).on('change', '#form', function () {
                    $('#form').validate({
                        rules: {
                            message: { required: true }
                        },
                        messages: {
                            message: { required: 'Description is required' }
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
                            success: function (response) {
                                toastr.success('Waived submission process for ' + response.fileName + ' (' + response.fileNumber + ')');
                                dialogRef.close();
                                $grid.refresh();
                            },
                            error: function (error) {
                                toastr.error('Error waiving submission process');
                            },
                            complete: function (status) {
                            }
                        });
                    }
                }
            ]
        });

    }

    function addRowClass(rowElement, data) {
        var classes = ['active', 'success', 'info', 'warning', 'danger'];
        var $moment = window.moment();

        if (data.submissionStateDisplay === 'Completed' || data.submissionStateDisplay === 'Waived') {
            rowElement.addClass(classes[1]);
            return;
        }

        if (data.submissionStateDisplay === 'CompleteWithErrors') {
            //console.log('complete with errors');
            rowElement.addClass(classes[2]);
            return;
        }

        if (data.submissionStateDisplay !== 'Completed' && $moment.isSameOrAfter(data.dueDate)) {
            rowElement.addClass(classes[4]);
            return;
        }

        if (data.submissionStateDisplay !== 'Completed' && $moment.add(14, 'days').isSameOrAfter(data.dueDate)) {
            rowElement.addClass(classes[3]);
            return;
        }
    }
});