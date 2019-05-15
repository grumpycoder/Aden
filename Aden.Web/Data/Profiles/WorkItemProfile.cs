﻿using Aden.Web.Helpers;
using Aden.Web.Models;
using Aden.Web.ViewModels;
using AutoMapper;

namespace Aden.Web.Data.Profiles
{
    public class WorkItemProfile : Profile
    {
        public WorkItemProfile()
        {

            CreateMap<WorkItem, WorkItemHistoryDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.AssignedDate, opt => opt.MapFrom(s => s.AssignedDate))
                .ForMember(d => d.AssignedUser, opt => opt.MapFrom(s => s.AssignedUser.FullName))
                .ForMember(d => d.WorkItemState, opt => opt.MapFrom(s => s.WorkItemState))
                .ForMember(d => d.CompletedDate, opt => opt.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
                .ForMember(d => d.Action, opt => opt.MapFrom(s => s.WorkItemAction))
                .ForAllOtherMembers(d => d.Ignore())
                ;

            CreateMap<WorkItem, AssignmentDto>()
                .ForMember(d => d.WorkItemAction, opt => opt.MapFrom(s => s.WorkItemAction.GetDisplayName()))
                .ForMember(d => d.AssignedUser, opt => opt.MapFrom(s => s.AssignedUser))
                .ForMember(d => d.WorkItemId, opt => opt.MapFrom(s => s.Id))
                .ForAllOtherMembers(d => d.Ignore());

            CreateMap<WorkItem, WorkItemViewDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.DataYear, opt => opt.MapFrom(s => s.Report.Submission.DataYear))
                .ForMember(d => d.ReportId, opt => opt.MapFrom(s => s.ReportId))
                .ForMember(d => d.DueDate, opt => opt.MapFrom(s => s.Report.Submission.DueDate))
                .ForMember(d => d.AssignedDate, opt => opt.MapFrom(s => s.AssignedDate))
                .ForMember(d => d.CompletedDate, opt => opt.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.Report.Submission.FileSpecification.FileName))
                .ForMember(d => d.FileNumber, opt => opt.MapFrom(s => s.Report.Submission.FileSpecification.FileNumber))
                .ForMember(d => d.Action, opt => opt.MapFrom(s => s.WorkItemAction))
                .ForMember(d => d.ReportAction,
                    opt => opt.MapFrom(s => s.Report.Submission.FileSpecification.ReportAction))
                .ForMember(d => d.WorkItemState, opt => opt.MapFrom(s => s.WorkItemState))
                .ForMember(d => d.AssignedUser, opt => opt.MapFrom(s => s.AssignedUser.EmailAddress))
                .ForAllOtherMembers(d => d.Ignore());


            CreateMap<WorkItem, SubmissionErrorDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.Report.Submission.FileSpecification.FileName))
                .ForMember(d => d.FileNumber, opt => opt.MapFrom(s => s.Report.Submission.FileSpecification.FileNumber))
                .ForAllOtherMembers(d => d.Ignore());

            CreateMap<WorkItem, WorkItemUploadDto>()
                .ForMember(d => d.FileName,
                    opt => opt.MapFrom(s => s.Report.Submission.FileSpecification.FileDisplayName))
                ;


        }
    }
}
