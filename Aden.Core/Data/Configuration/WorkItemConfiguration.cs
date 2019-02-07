﻿using System.Data.Entity.ModelConfiguration;
using Aden.Core.Models;

namespace Aden.Core.Data.Configuration
{
    public class WorkItemConfiguration : EntityTypeConfiguration<WorkItem>
    {
        public WorkItemConfiguration()
        {
            ToTable("Aden.WorkItems");
            Property(s => s.Id).HasColumnName("WorkItemId");
            Property(s => s.WorkItemAction).HasColumnName("WorkItemActionId");
            Property(s => s.WorkItemState).HasColumnName("WorkItemStateId");
            Property(s => s.AssignedDate).HasColumnType("datetime2");
            Property(s => s.AssignedUserId).HasColumnName("UserProfileId");
        }
    }
}
