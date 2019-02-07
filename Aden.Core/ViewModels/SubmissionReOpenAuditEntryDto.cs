﻿using System;

namespace Aden.Core.ViewModels
{
    public class SubmissionReOpenAuditEntryDto
    {
        public int SubmissionId { get; set; }
        public string Message { get; set; }
        public DateTime NextSubmissionDate { get; set; }

        public SubmissionReOpenAuditEntryDto(int submissionId)
        {
            SubmissionId = submissionId;
        }

        public SubmissionReOpenAuditEntryDto()
        {

        }
    }
}
