using Aden.Web.Helpers;
using Aden.Web.Models;
using System;

namespace Aden.Web.ViewModels
{
    public class WorkItemViewDto
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public int DataYear { get; set; }

        public string DisplayDataYear => $"{DataYear - 1}-{DataYear}";

        public DateTime? AssignedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string FileName { get; set; }
        public string FileNumber { get; set; }

        public string DisplayFileName => $"{FileName} ({FileNumber})";

        public string ReportAction { get; set; }

        public WorkItemAction Action { get; set; }

        public WorkItemState WorkItemState { get; set; }
        public string WorkItemStateDisplay => WorkItemState.GetDescription();

        public string ActionName => Action.GetShortName();


        public bool CanGenerate => Action == WorkItemAction.Generate;
        public bool CanSubmit => Action == WorkItemAction.Submit;
        public bool CanReject => Action == WorkItemAction.Review || Action == WorkItemAction.Approve;
        public bool CanReviewError => Action == WorkItemAction.ReviewError;

        public bool CanReview => Action == WorkItemAction.Review;

        //TODO: Need logic to cancel completed work item assignment
        public bool CanCancel => false;

        public bool IsManualUpload => ReportAction?.ToLower() == "manual";
        public string AssignedUser { get; set; }
    }
}
