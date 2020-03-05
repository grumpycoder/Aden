﻿using System.Collections.Generic;

namespace Aden.Web.ViewModels
{
    public class FileSpecificationViewDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileNumber { get; set; }
        public string SpecificationUrl { get; set; }

        public bool? IsRetired { get; set; }
        public string FileNameFormat { get; set; }
        public string ReportAction { get; set; }
        public int? DataYear { get; set; }
        public string DisplayDataYear => $"{DataYear - 1}-{DataYear}";

        public string Section { get; set; }
        public string DataGroups { get; set; }
        public string Application { get; set; }
        public string Collection { get; set; }
        public string SupportGroup { get; set; }

        public bool IsSEA { get; set; }
        public bool IsLEA { get; set; }
        public bool IsSCH { get; set; }

        public bool CanRetire => (bool)(IsRetired.HasValue ? !IsRetired : true);
        public bool CanActivate => !CanRetire;



        public string GenerationGroup { get; set; }
        public string ApprovalGroup { get; set; }
        public string SubmissionGroup { get; set; }

        public List<string> Generators { get; set; }
        public List<string> Approvers { get; set; }
        public List<string> Submitters { get; set; }
    }
}
