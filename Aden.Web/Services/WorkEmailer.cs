using Aden.Web.Helpers;
using Aden.Web.Models;
using FluentEmail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace Aden.Web.Services
{
    public static class WorkEmailer
    {
        public static void Send(WorkItem workItem, Submission submission, HttpPostedFileBase[] files = null)
        {

            Email.DefaultRenderer = new RazorRenderer();

            var sender = Constants.ReplyAddress;
            var templatePath = Constants.WorkItemTemplatePath;
            var taskIcon = Constants.TaskIcon;
            var subject = string.Empty;


            if (workItem.WorkItemAction == 0)
            {
                subject = $"{submission.FileSpecification.FileDisplayName} Submission Successful Document Version #{workItem.Report?.CurrentDocumentVersion ?? 1}";
                templatePath = Constants.SubmissionTemplatePath;
                taskIcon = Constants.SuccessIcon;
            }

            if (workItem.WorkItemAction == WorkItemAction.ReviewError)
            {
                taskIcon = Constants.ErrorIcon;
                //subject = $"{submission.FileSpecification.FileDisplayName} {workItem.WorkItemAction.GetDisplayName()} Assignment";
                subject = $"{submission.FileSpecification.FileDisplayName} {workItem.WorkItemAction.GetDisplayName()} Unsuccessful Submission Document Version #{workItem.Report?.CurrentDocumentVersion ?? 1}";
                templatePath = Constants.WorkItemTemplatePath;
            }

            if (submission.SubmissionState == SubmissionState.NotStarted)
            {
                subject = $"{submission.FileSpecification.FileDisplayName} {workItem.WorkItemAction.GetDisplayName()} Assignment Cancelled Document Version #{workItem.Report?.CurrentDocumentVersion ?? 1}";
                templatePath = Constants.CancelTemplatePath;
                taskIcon = Constants.CancelledIcon;
            }

            if (string.IsNullOrWhiteSpace(subject)) subject = $"{submission.FileSpecification.FileDisplayName} {workItem.WorkItemAction.GetDisplayName()} Assignment Document Version #{workItem.Report?.CurrentDocumentVersion ?? 1}";

            var model = new EmailModel()
            {
                WorkItemAction = workItem.WorkItemAction != 0 ? workItem.WorkItemAction.GetDisplayName() : "",
                Notes = workItem.Description ?? string.Empty,
                DueDate = submission.NextDueDate ?? submission.DueDate ?? DateTime.Now,
                FileName = submission.FileSpecification.FileDisplayName,
                Icon = taskIcon
            };
            var email = Email
                    .From(sender, sender)
                    .To(workItem.AssignedUser.EmailAddress)
                    .Subject(subject)
                    .BodyAsHtml()
                    .Body("")
                    .UsingTemplateFromFile(templatePath, model);

            if (files != null)
            {
                foreach (var file in files)
                {
                    file.InputStream.Position = 0;
                    email.Message.Attachments.Add(new Attachment(file.InputStream, file.FileName));
                }
            }

            email.Send();

        }

        public static void RequestAccess(UserProfile user, string sendFom)
        {
            Email.DefaultRenderer = new RazorRenderer();

            var sender = Constants.ReplyAddress;
            var templatePath = Constants.UserRequestTemplatePath;

            var subject = "Add user to Aden Viewers";
            var model = user.EmailAddress;

            var email = Email
                .From(sendFom, sendFom)
                .To(Constants.SupportDesk)
                .Subject(subject)
                .BodyAsHtml()
                .Body("")
                .UsingTemplateFromFile(templatePath, model);

            email.Send();
        }

        public static void SendErrorNotification(WorkItem workItem, Submission submission, HttpPostedFileBase[] files, List<UserProfile> notifiers)
        {
            Email.DefaultRenderer = new RazorRenderer();

            var sender = Constants.ReplyAddress;
            var templatePath = Constants.ErrorTemplatePath;
            var taskIcon = Constants.ErrorIcon;
            var subject = $"{submission.FileSpecification.FileDisplayName} Submission Error Document Version #{workItem.Report.CurrentDocumentVersion ?? 1}";

            var model = new EmailModel()
            {
                AssignedUser = workItem.AssignedUser.FullName,
                WorkItemAction = workItem.WorkItemAction != 0 ? workItem.WorkItemAction.GetDescription() : "",
                Notes = workItem.Description ?? string.Empty,
                DueDate = submission.NextDueDate ?? submission.DueDate ?? DateTime.Now,
                FileName = submission.FileSpecification.FileDisplayName,
                Icon = taskIcon
            };
            var email = Email
                    .From(sender, sender)
                    .To(workItem.AssignedUser.EmailAddress)
                    .Subject(subject)
                    .BodyAsHtml()
                    .Body("")
                    .UsingTemplateFromFile(templatePath, model);

            if (notifiers != null)
                foreach (var address in notifiers.ToList())
                {
                    email.CC(address.EmailAddress, address.FullName);
                }

            if (files != null)
            {
                foreach (var file in files)
                {
                    file.InputStream.Position = 0;
                    email.Message.Attachments.Add(new Attachment(file.InputStream, file.FileName));
                }
            }

            email.Send();
        }

        public static void SendCompletion(WorkItem workItem, Submission submission, List<UserProfile> notifiers)
        {
            Email.DefaultRenderer = new RazorRenderer();

            var sender = Constants.ReplyAddress;
            var templatePath = Constants.SubmissionTemplatePath;
            var taskIcon = Constants.SuccessIcon;
            var subject = string.Empty;

            subject = $"{submission.FileSpecification.FileDisplayName} Completed Document Version #{workItem.Report.CurrentDocumentVersion ?? 1}";

            var model = new EmailModel()
            {
                AssignedUser = workItem.AssignedUser.FullName,
                WorkItemAction = workItem.WorkItemAction != 0 ? workItem.WorkItemAction.GetDescription() : "",
                Notes = workItem.Description ?? string.Empty,
                DueDate = submission.NextDueDate ?? submission.DueDate ?? DateTime.Now,
                FileName = submission.FileSpecification.FileDisplayName,
                Icon = taskIcon
            };
            var email = Email
                .From(sender, sender)
                .To(workItem.AssignedUser.EmailAddress)
                .Subject(subject)
                .BodyAsHtml()
                .Body("")
                .UsingTemplateFromFile(templatePath, model);

            if (notifiers != null)
                foreach (var address in notifiers.ToList())
                {
                    email.CC(address.EmailAddress, address.FullName);
                }

            email.Send();
        }
    }

    public class EmailModel
    {
        public string AssignedUser { get; set; }
        public string WorkItemAction { get; set; }
        public string Notes { get; set; }
        public DateTime DueDate { get; set; }
        public string FileName { get; set; }
        public string Icon { get; set; }

        public string AssignmentsUrl
        {
            get
            {
                var url = "https://devaden.alsde.edu/assignments";

                switch (Constants.Environment
)
                {
                    case "Production":
                        url = "https://aden.alsde.edu/assignments";
                        break;
                    case "Stage":
                        url = "https://stageaden.alsde.edu/assignments";
                        break;
                    case "Test":
                        url = "https://testaden.alsde.edu/assignments";
                        break;
                    default:
                        url = "https://devaden.alsde.edu/assignments";
                        break;
                }
                return url;
            }
        }
    }



}
