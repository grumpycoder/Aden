using Aden.Web.Data;
using Aden.Web.Helpers;
using Aden.Web.Models;
using ALSDE.Services;
using CSharpFunctionalExtensions;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Security.Claims;

namespace Aden.Web.Services
{
    public class MembershipService
    {
        private readonly AdenContext _context;

        public MembershipService(AdenContext context)
        {
            _context = new AdenContext();
        }

        public UserProfile GetAssignee(Group group)
        {
            if (!group.Users.Any()) return null;

            var members = group.Users.Select(x => x.EmailAddress);

            var currentWorkItems = _context.WorkItems.AsNoTracking()
                .Include(x => x.AssignedUser)
                .Where(x => x.WorkItemState == WorkItemState.NotStarted).ToList();

            var alreadyAssignedMembers = currentWorkItems
                .Where(u => members.Contains(u.AssignedUser.EmailAddress))
                .ToLookup(m => m.AssignedUser.EmailAddress);

            var firstAvailableMember = members.FirstOrDefault(x => !alreadyAssignedMembers.Contains(x));

            if (firstAvailableMember != null)
            {
                var e = group.Users.FirstOrDefault(x => x.EmailAddress == firstAvailableMember);
                return e;
            }

            var nextAvailable = currentWorkItems
                .Where(u => members.Contains(u.AssignedUser.EmailAddress)).ToList()
                .GroupBy(u => u.AssignedUser.EmailAddress).Select(n => new
                {
                    n.Key,
                    Count = n.Count()
                }).OrderBy(x => x.Count).FirstOrDefault();

            return nextAvailable == null ? null : group.Users.FirstOrDefault(x => x.EmailAddress == nextAvailable.Key);

        }

        public List<UserProfile> GetGroupMembers(string groupName)
        {
            if (string.IsNullOrWhiteSpace(groupName)) return null;

            var group = _context.Groups.Include(u => u.Users).FirstOrDefault(x => x.Name == groupName);

            var users = group?.Users;

            return users;
        }

        public bool GroupExists(string groupName)
        {
            var groupService = new IdemGroupService();
            return groupService.GroupExists(groupName);

        }

        public List<Group> GetUserGroups(string username)
        {
            var _user = _context.Users.Include(x => x.Groups).FirstOrDefault(x => x.EmailAddress == username);

            return _user.Groups;
        }

        public UserProfile GetUserProfile(Guid identityGuid)
        {
            return _context.Users.FirstOrDefault(x => x.IdentityGuid == identityGuid);
        }

        public void SyncClaims(ClaimsIdentity identity)
        {
            var claim = identity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value;

            var user = _context.Users.FirstOrDefault(x => x.IdentityGuid == new Guid(claim));

            if (user == null) user = new UserProfile();

            user.EmailAddress = identity.GetClaimValue(ClaimTypes.Email);
            user.LastName = identity.GetClaimValue(ClaimTypes.Surname);
            user.FirstName = identity.GetClaimValue(ClaimTypes.GivenName);
            user.FullName = identity.GetClaimValue(ClaimTypes.Name);
            user.IdentityGuid = new Guid(identity.GetClaimValue(ClaimTypes.NameIdentifier));
            _context.Users.AddOrUpdate(user);
            _context.SaveChanges();

            var groups = GetUserGroups(user.EmailAddress);
            foreach (var @group in groups)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, @group.Name));
                identity.AddClaim(new Claim(ClaimsIdentity.DefaultNameClaimType, @group.Name));
            }
            //Set homepage
            identity.AddUpdateClaim(ClaimTypes.Webpage, "Assignments");

            if (identity.HasClaim(x => x.Type == ClaimTypes.Role && x.Value.Contains("AdenAdministrators")))
                identity.AddUpdateClaim(ClaimTypes.Webpage, "Dashboard");

            //if (identity.HasClaim(x => x.Type == ClaimTypes.Role && x.Value.Contains("AdenExecutive")))
            //    identity.AddUpdateClaim(ClaimTypes.Webpage, "SubmissionReport");


        }
    }



}
