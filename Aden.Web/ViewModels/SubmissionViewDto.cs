﻿using Aden.Web.Helpers;
using Aden.Web.Models;
using Humanizer;
using System;
using System.Security.Claims;
using System.Web;

namespace Aden.Web.ViewModels
{
    public class SubmissionViewDto
    {
        public int Id { get; set; }
        public string FileNumber { get; set; }
        public string FileName { get; set; }
        public DateTime? SubmissionDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? NextDueDate { get; set; }

        public DateTime? DeadlineDate => NextDueDate ?? DueDate;

        public int? DataYear { get; set; }
        public string DisplayDataYear => $"{DataYear - 1}-{DataYear}";

        public DateTime? LastUpdated { get; set; }
        public string LastUpdatedFriendly => $"{LastUpdated.Humanize(false)}";

        public string Section { get; set; }
        public string DataGroups { get; set; }
        public string Application { get; set; }
        public string Collection { get; set; }
        public string SupportGroup { get; set; }

        public string ReportAction { get; set; }
        public string GenerationUserGroup { get; set; }
        public string ApprovalUserGroup { get; set; }
        public string SubmissionUserGroup { get; set; }

        public string CurrentAssignment { get; set; }

        public bool IsSEA { get; set; }
        public bool IsLEA { get; set; }
        public bool IsSCH { get; set; }

        public SubmissionState SubmissionState { get; set; }

        public string SubmissionStateDisplay => SubmissionState.GetDisplayName();

        public bool HasStarted => SubmissionState != SubmissionState.NotStarted;
        public bool CanCancel => SubmissionState == SubmissionState.AssignedForGeneration && HasAdmin;
        public bool CanStart => SubmissionState == SubmissionState.NotStarted && HasAdmin;

        public bool CanReopen => (SubmissionState == SubmissionState.Complete || SubmissionState == SubmissionState.Waived) && HasAdmin;

        public bool StartDisabled => CanStart && (string.IsNullOrWhiteSpace(GenerationUserGroup) ||
                                                                                              string.IsNullOrWhiteSpace(ApprovalUserGroup) ||
                                                                                              string.IsNullOrWhiteSpace(SubmissionUserGroup));

        public bool ReopenDisabled => CanReopen && (string.IsNullOrWhiteSpace(GenerationUserGroup) ||
                                                    string.IsNullOrWhiteSpace(ApprovalUserGroup) ||
                                                    string.IsNullOrWhiteSpace(SubmissionUserGroup));

        public bool CanWaiver => CanStart && HasAdmin;

        public bool CanReview => HasStarted;

        public bool HasAdmin => (HttpContext.Current.User as ClaimsPrincipal).HasClaim(ClaimTypes.Role, Constants.GlobalAdministrators); //claim != null;

        public int? CurrentReportId { get; set; }
    }
}