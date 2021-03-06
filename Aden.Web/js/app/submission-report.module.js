$(function () {
    console.log('submission report view ready');

    window.assignmentUpdated = false;

    var uri = "/api/submission";

    var $grid = $('#gridReport').dxDataGrid({
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
        filterRow: { visible: true },
        headerFilter: { visible: true },
        groupPanel: { visible: false },
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
                cellTemplate: function (container, options) {
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
            { dataField: 'deadlineDate', caption: 'Submission Deadline', dataType: 'date', visibleIndex: 1 },
            { dataField: 'fileNumber', caption: 'File Number', visibleIndex: 2 },
            { dataField: 'fileName', caption: 'File Name', visibleIndex: 3 },
            { dataField: 'displayDataYear', caption: 'Data Year', visibleIndex: 4 },
            { dataField: 'section', caption: 'Section', visibleIndex: 5 },
            { dataField: 'submissionStateDisplay', caption: 'Status', visibleIndex: 6 },
            { dataField: 'currentAssignment', caption: 'Assigned', visibleIndex: 7 },
            { dataField: 'startDate', caption: 'Started Date', dataType: 'date', visibleIndex: 10 },
            { dataField: 'application', caption: 'Application', visibleIndex: 11 },
            { dataField: 'supportGroup', caption: 'Support Group', visibleIndex: 12 },
            { dataField: 'collection', caption: 'Collection', visibleIndex: 13 },
            { dataField: 'submissionDate', caption: 'Date Submitted', dataType: 'date' },
            {
                dataField: 'daysOverdue', caption: 'Days Overdue', dataType: 'decimal',
                headerFilter: {
                    dataSource: [{
                        text: "Less than 30",
                        value: ["daysOverdue", "<", 30]
                    }, {

                        text: "30 - 90",
                        value: [["daysOverdue", ">=", 30], ["daysOverdue", "<", 90]]
                    }, {

                        text: "90 - 120",
                        value: [["daysOverdue", ">=", 90], ["daysOverdue", "<", 120]]
                    },
                    {

                        text: "Greater than 120",
                        value: [["daysOverdue", ">=", 120]]
                    }]
                }
            },
            {
                dataField: 'completionDays', caption: 'Completion Days', dataType: 'decimal',
                headerFilter: {
                    dataSource: [{
                        text: "Less than 30",
                        value: ["completionDays", "<", 30]
                    }, {

                        text: "30 - 90",
                        value: [["completionDays", ">=", 30], ["completionDays", "<", 90]]
                    }, {

                        text: "90 - 120",
                        value: [["completionDays", ">=", 90], ["completionDays", "<", 120]]
                    },
                    {

                        text: "Greater than 120",
                        value: [["completionDays", ">=", 120]]
                    }]
                }
            },
            { dataField: 'lastUpdatedFriendly', caption: 'Last Update', visible: false },
            {
                dataField: 'isSEA',
                caption: 'SEA',
                dataType: 'boolean',
                visible: true,
                visibleIndex: 3,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            {
                dataField: 'isLEA',
                caption: 'LEA',
                dataType: 'boolean',
                visible: true,
                visibleIndex: 4,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            {
                dataField: 'isSCH',
                caption: 'SCH',
                dataType: 'boolean',
                visible: true,
                visibleIndex: 5,
                showEditorAlways: false,
                trueText: 'Yes',
                falseText: 'No',
                customizeText: function (cellInfo) {
                    if (cellInfo.value) return 'Yes';

                    return 'No';
                }
            },
            {
                dataField: 'generators',
                caption: 'Generators',
                dataType: 'string',
                visible: true,
                visibleIndex: 8,
                cellTemplate: function (container, options) {
                    options.data.generators.forEach(function (item) {
                        $('<span>' + item + '</span><br />').appendTo(container)
                    });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.generators.join(", ");
                }
            },
            {
                dataField: 'approvers',
                caption: 'Approvers',
                dataType: 'string',
                visible: true,
                visibleIndex: 9,
                cellTemplate: function (container, options) {
                    options.data.approvers.forEach(function (item) {
                        $('<span>' + item + '</span><br />').appendTo(container)
                    });
                },
                allowFiltering: false,
                calculateDisplayValue: function (rowData) {
                    return rowData.approvers.join(", ");
                }
            },
            {
                dataField: 'submitters',
                caption: 'Submitters',
                dataType: 'string',
                visible: false,
                cellTemplate: function (container, options) {
                    options.data.submitters.forEach(function (item) {
                        $('<span>' + item + '</span><br />').appendTo(container);
                    });
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

                    if (options.data.canReview) {
                        $('<a/>').addClass('btn btn-default btn-sm btn-grid')
                            .text('Review File')
                            .attr('aria-label', 'Review submission report file')
                            .attr('href', '/review/' + options.data.dataYear + '/' + options.data.fileNumber)
                            .attr('target', '_blank')
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
        },
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
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
                            resetAllButtons();
                        }
                    }
                }
            );
        }
    }).dxDataGrid("instance");

    function gridContentReady() {
        console.log('grid content ready');
        $(".dx-datagrid-table").addClass("table");
        $('.dx-button').attr('data-toggle', 'tooltip');
        $('[data-toggle="tooltip"]').tooltip();

        $('#panel-message').hide();
        if ($grid.getCombinedFilter() !== undefined) {
            if ($grid.getCombinedFilter().length > 0) {
                $('#panel-message').show();

            }
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
            message: $('<div></div>').load(url,
                function (resp, status, xhr) {
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

    function resetAllButtons() {
        $('#btnStatusFilter button').siblings().removeClass('active');
        $('#btnGroupDue button').siblings().removeClass('active');
        $('#btnSupportGroup button').siblings().removeClass('active');
    }

    function resetButton(name) {
        $('#' + name + ' button').siblings().removeClass('active');
    }

    $('#btnStatusFilter button').on('click',
        function (e) {
            var btn = $(this);
            resetButton('btnGroupDue');
            resetButton('btnSupportGroup');
            if (btn.hasClass('active')) {
                btn.removeClass('active');
                applyStatusFilter();
            } else {
                btn.addClass('active').siblings().removeClass('active');
                applyStatusFilter(btn.val());
            }

            gridContentReady();
        });

    $('#btnGroupDue button').on('click',
        function (e) {
            var btn = $(this);
            resetButton('btnStatusFilter');
            resetButton('btnSupportGroup');
            if (btn.hasClass('active')) {
                btn.removeClass('active');
                applyDueFilter();
            } else {
                btn.addClass('active').siblings().removeClass('active');
                applyDueFilter(btn.val());
            }
            gridContentReady();
        });

    $('#btnSupportGroup button').on('click',
        function (e) {
            var btn = $(this);
            resetButton('btnStatusFilter');
            resetButton('btnGroupDue');
            if (btn.hasClass('active')) {
                btn.removeClass('active');
                applyGroupFilter();
            } else {
                btn.addClass('active').siblings().removeClass('active');
                applyGroupFilter(btn.val());
            }
            gridContentReady();
        });

    var combinedFilter = [];
    var statusFilter = [];
    var dueFilter = [];
    var groupFilter = [];

    function applyStatusFilter(status) {
        statusFilter = [];
        $grid.deleteColumn('lastUpdatedFriendly');
        $grid.deleteColumn('submissionDate');

        if (status === undefined) {
            combinedFilter = statusFilter;
            applyFilters();
            return;
        }
        var date = moment().add(0, 'days').format();
        if (status === 'Completed') {
            $grid.addColumn({ dataField: 'submissionDate', caption: 'Date Submitted', visibleIndex: 17 });
            statusFilter.push(["submissionStateDisplay", "=", "Completed"], "or", ["submissionStateDisplay", "=", "Waived"]);
        }
        if (status === 'Overdue') {
            $grid.addColumn({ dataField: 'lastUpdatedFriendly', caption: 'Last Update', visibleIndex: 17 });
            statusFilter.push(['deadlineDate', '<', date], ['submissionStateDisplay', '<>', 'Completed'], ['submissionStateDisplay', '<>', 'Waived']);
        }
        combinedFilter = statusFilter;
        applyFilters();
    }

    function applyDueFilter(numDays) {
        dueFilter = [];
        if (numDays === undefined) {
            combinedFilter = dueFilter;
            applyFilters();
            return;
        }

        var temp = [];
        var currentDate = moment().add(0, 'days').format();
        var date = moment().add(numDays, 'days').format();

        temp.push(["deadlineDate", ">=", currentDate]);
        temp.push('and');
        temp.push(["deadlineDate", "<=", date]);
        temp.push(["submissionStateDisplay", "<>", "Completed"]);
        temp.push(["submissionStateDisplay", "<>", "Waived"]);

        dueFilter.push(temp);

        combinedFilter = dueFilter;
        applyFilters();
    }

    function applyGroupFilter(group) {
        groupFilter = [];
        if (group === undefined) {
            combinedFilter = groupFilter;
            applyFilters();
            return;
        }
        groupFilter.push(["supportGroup", "=", group]);

        combinedFilter = groupFilter;
        applyFilters();
    }


    function applyFilters() {
        $grid.clearFilter();
        $grid.filter(combinedFilter);
    }

});